"use client";

import { useEffect, useState } from "react";
import { Flag, X } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import PenaltyForm from "@/components/moderation/penalty-form";

// Moderation queue for content reports. Backend: /admin/moderation/reports (list, detail, assign,
// note, escalate, resolve). Decisions are recorded with a full event trail. Acting on the content
// itself: posts can be deleted from here; accounts are handled on the Users page.
// The reporter's identity is never shown to moderators.
const OUTCOMES: Record<string, string> = {
  violation_confirmed: "Violation confirmed",
  no_violation: "No violation found",
  duplicate: "Duplicate of another report",
  insufficient_info: "Not enough information",
  bad_faith: "Bad-faith report",
};
const SEVERITY_STYLE: Record<string, string> = {
  P0: "bg-danger/15 text-danger",
  P1: "bg-warning/15 text-warning",
  P2: "bg-surface-raised text-ink",
  P3: "bg-surface-raised text-ink-muted",
};
const label = (s: string) => s.replace(/_/g, " ");

export default function ModerationPage() {
  const user = useAuthStore((state) => state.user);
  const isSuper = user?.role === "superadmin";
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"open" | "closed">("open");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["mod-reports", tab, page],
    queryFn: async () => (await api.get("/admin/moderation/reports", { params: { status: tab, page, limit: 20 } })).data,
    refetchInterval: 30000,
  });
  const reports: any[] = data?.data || [];
  const totalPages: number = data?.pagination?.totalPages || 1;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-semibold text-ink">Moderation</h1>
          <p className="text-ink-muted mt-1 text-sm">Reports from students. Most urgent first.</p>
          <Link href="/penalties" className="text-sm text-accent hover:underline">
            Penalties and appeals →
          </Link>
        </div>

        <div className="flex gap-2">
          {(["open", "closed"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${tab === t ? "bg-accent text-white" : "bg-surface-raised text-ink-muted hover:text-ink"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {error && <p className="text-danger text-sm">{(error as any)?.response?.data?.message || "Could not load reports."}</p>}

        {isLoading ? (
          <div className="card p-8 text-center text-ink-muted">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="card p-12 text-center">
            <Flag size={48} className="mx-auto mb-4 text-ink-muted opacity-30" />
            <p className="text-ink-muted">{tab === "open" ? "Nothing waiting for review." : "No closed reports yet."}</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-surface-raised border-b border-border">
                <tr>
                  {["Severity", "Category", "About", "Reference", "Status", "Assigned", "Due"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-ink-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reports.map((r) => (
                  <tr key={r.id} onClick={() => setSelected(r.id)} className="hover:bg-surface-raised transition cursor-pointer">
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${SEVERITY_STYLE[r.severity] || ""}`}>{r.severity}</span>
                      {r.imminent && <span className="ml-2 text-xs text-danger font-semibold">IMMINENT</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink capitalize">{label(r.category)}</td>
                    <td className="px-4 py-3 text-sm text-ink capitalize">{label(r.entityType)}</td>
                    <td className="px-4 py-3 text-sm text-ink-muted font-mono">{r.reference}</td>
                    <td className="px-4 py-3 text-sm text-ink capitalize">{label(r.status)}</td>
                    <td className="px-4 py-3 text-sm text-ink-muted">{r.assignedToName || "—"}</td>
                    <td className={`px-4 py-3 text-sm ${r.overdue ? "text-danger font-semibold" : "text-ink-muted"}`}>
                      {r.overdue ? "Overdue" : r.dueAt ? new Date(r.dueAt).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="btn-secondary disabled:opacity-50">
              Previous
            </button>
            <span className="text-sm text-ink-muted">
              Page {page} of {totalPages}
            </span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="btn-secondary disabled:opacity-50">
              Next
            </button>
          </div>
        )}

        {selected && (
          <ReportDrawer
            id={selected}
            isSuper={isSuper}
            onClose={() => setSelected(null)}
            onChanged={() => queryClient.invalidateQueries({ queryKey: ["mod-reports"] })}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

function ReportDrawer({ id, isSuper, onClose, onChanged }: { id: string; isSuper: boolean; onClose: () => void; onChanged: () => void }) {
  const queryClient = useQueryClient();
  const [note, setNote] = useState("");
  const [outcome, setOutcome] = useState("");
  const [resolveNote, setResolveNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const { data: report, isLoading } = useQuery({
    queryKey: ["mod-report", id],
    queryFn: async () => (await api.get(`/admin/moderation/reports/${id}`)).data.data,
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["mod-report", id] });
    onChanged();
  };
  const run = useMutation({
    mutationFn: async (fn: () => Promise<unknown>) => fn(),
    onSuccess: () => {
      setError("");
      refresh();
    },
    onError: (e: any) => setError(e?.response?.data?.message || "That did not work. Please try again."),
  });

  const post = (path: string, body?: object) => () => api.post(`/admin/moderation/reports/${id}/${path}`, body ?? {});
  const closed = report && (report.status === "resolved" || report.status === "dismissed");
  const lockedToSuper = report?.status === "escalated" && !isSuper;

  const deletePost = () => async () => {
    await api.delete(`/posts/${report.entityId}`);
    await api.post(`/admin/moderation/reports/${id}/note`, { note: "Content removed: the reported post was deleted." });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={onClose}>
      <div className="w-full max-w-xl h-full overflow-y-auto bg-surface border-l border-border p-6 space-y-5" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Report details">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-ink-muted font-mono">{report?.reference}</p>
            <h2 className="text-xl font-display font-semibold text-ink capitalize">{report ? label(report.category) : "Report"}</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-2 text-ink-muted hover:text-ink">
            <X size={18} />
          </button>
        </div>

        {isLoading || !report ? (
          <p className="text-ink-muted">Loading...</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className={`font-semibold px-2.5 py-1 rounded-full ${SEVERITY_STYLE[report.severity] || ""}`}>{report.severity}</span>
              <span className="px-2.5 py-1 rounded-full bg-surface-raised text-ink capitalize">{label(report.status)}</span>
              {report.imminent && <span className="px-2.5 py-1 rounded-full bg-danger/15 text-danger font-semibold">Reporter says: imminent danger</span>}
              {report.autoHidden && <span className="px-2.5 py-1 rounded-full bg-warning/15 text-warning">Content auto-hidden</span>}
              {report.overdue && <span className="px-2.5 py-1 rounded-full bg-danger/15 text-danger font-semibold">Overdue</span>}
            </div>

            {report.description && (
              <section>
                <h3 className="text-sm font-semibold text-ink mb-1">What the reporter said</h3>
                <p className="text-sm text-ink whitespace-pre-wrap">{report.description}</p>
              </section>
            )}

            <section>
              <h3 className="text-sm font-semibold text-ink mb-1">Reported {label(report.entityType)}</h3>
              {report.reportedUser && (
                <p className="text-sm text-ink-muted mb-2">
                  Posted by {report.reportedUser.name} ({report.reportedUser.role}, {report.reportedUser.status})
                </p>
              )}
              <pre className="text-xs bg-surface-raised rounded-lg p-3 overflow-x-auto max-h-56 whitespace-pre-wrap break-words">
                {report.evidence?.snapshot ? JSON.stringify(report.evidence.snapshot, null, 2).slice(0, 4000) : "No snapshot was captured."}
              </pre>
            </section>

            {report.resolution && (
              <section className="card p-4">
                <h3 className="text-sm font-semibold text-ink">Decision: {OUTCOMES[report.resolution.outcome] || report.resolution.outcome}</h3>
                <p className="text-sm text-ink mt-1 whitespace-pre-wrap">{report.resolution.note}</p>
                <p className="text-xs text-ink-muted mt-2">
                  {report.resolution.resolvedByName} · {new Date(report.resolution.resolvedAt).toLocaleString()}
                </p>
              </section>
            )}

            {!closed && (
              <section className="space-y-4">
                {lockedToSuper && <p className="text-sm text-warning">This report was escalated. A superadmin decides it.</p>}
                <div className="flex flex-wrap gap-2">
                  {!lockedToSuper && (
                    <button onClick={() => run.mutate(post("assign"))} disabled={run.isPending} className="btn-secondary disabled:opacity-50">
                      Assign to me
                    </button>
                  )}
                  {report.entityType === "post" && !lockedToSuper && (
                    <button
                      onClick={() => confirm("Delete the reported post for everyone? This cannot be undone.") && run.mutate(deletePost())}
                      disabled={run.isPending}
                      className="px-4 py-2 rounded-lg bg-danger/10 text-danger text-sm font-medium hover:bg-danger/20 disabled:opacity-50"
                    >
                      Delete the post
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Note or escalation reason</label>
                  <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} maxLength={1000} className="input-field" />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() =>
                        run.mutate(async () => {
                          await post("note", { note: note.trim() })();
                          setNote("");
                        })
                      }
                      disabled={run.isPending || !note.trim()}
                      className="btn-secondary disabled:opacity-50"
                    >
                      Add note
                    </button>
                    {!isSuper && report.status !== "escalated" && (
                      <button
                        onClick={() =>
                          confirm("Escalate to a superadmin? You will not be able to decide this report afterwards.") &&
                          run.mutate(async () => {
                            await post("escalate", { note: note.trim() })();
                            setNote("");
                          })
                        }
                        disabled={run.isPending || !note.trim()}
                        className="btn-secondary disabled:opacity-50"
                      >
                        Escalate
                      </button>
                    )}
                  </div>
                </div>

                {!lockedToSuper && report.reportedUser && <PenaltyForm report={report} reportId={id} isSuper={isSuper} onDone={refresh} />}

                {!lockedToSuper && (
                  <div className="card p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-ink">Decide</h3>
                    <select value={outcome} onChange={(e) => setOutcome(e.target.value)} className="input-field">
                      <option value="">Choose an outcome...</option>
                      {(report.outcomes as string[]).map((o) => (
                        <option key={o} value={o}>
                          {OUTCOMES[o] || o}
                        </option>
                      ))}
                    </select>
                    <textarea value={resolveNote} onChange={(e) => setResolveNote(e.target.value)} rows={3} maxLength={2000} className="input-field" placeholder="Why you decided this (recorded on the report)" />
                    <button
                      onClick={() => confirm("Close this report with this decision?") && run.mutate(post("resolve", { outcome, note: resolveNote.trim() }))}
                      disabled={run.isPending || !outcome || !resolveNote.trim()}
                      className="btn-primary disabled:opacity-50"
                    >
                      Close report
                    </button>
                  </div>
                )}
              </section>
            )}

            {error && <p className="text-sm text-danger">{error}</p>}

            <section>
              <h3 className="text-sm font-semibold text-ink mb-2">History</h3>
              <ul className="space-y-2">
                {report.events.map((e: any, i: number) => (
                  <li key={i} className="text-sm">
                    <span className="text-ink capitalize">{label(e.type)}</span>
                    {e.to && e.from !== e.to ? <span className="text-ink-muted"> → {label(e.to)}</span> : null}
                    <span className="text-ink-muted">
                      {" "}
                      · {e.actorName || "System"} · {new Date(e.at).toLocaleString()}
                    </span>
                    {e.note && <p className="text-ink-muted whitespace-pre-wrap">{e.note}</p>}
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
