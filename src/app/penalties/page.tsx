"use client";

import { useEffect, useState } from "react";
import { Gavel, X } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Penalties and appeals. Backend: /admin/moderation/actions and /admin/moderation/appeals.
//   Awaiting approval: account closures proposed by one moderator. A DIFFERENT moderator approves
//                      or rejects; an unapproved proposal lapses after 7 days.
//   Appeals:           a person's appeal against a decision. Decided by a moderator who took no part
//                      in the original decision (the server enforces this and says why when not).
//   In force:          penalties currently applied; a moderator can lift one early.
// The person who filed a report is never shown anywhere here.

const label = (s: string) => (s || "").replace(/_/g, " ");
const when = (v?: string | null) => (v ? new Date(v).toLocaleString() : "—");
const day = (v?: string | null) => (v ? new Date(v).toLocaleDateString() : "—");
const ACTION_LABEL: Record<string, string> = {
  warning: "Warning",
  feature_restriction: "Feature restriction",
  temporary_suspension: "Suspension",
  permanent_termination: "Account closure",
  content_removal: "Content removal",
};
const STATUS_STYLE: Record<string, string> = {
  pending_approval: "bg-warn/15 text-warn",
  active: "bg-danger/15 text-danger",
  pending: "bg-warn/15 text-warn",
  under_review: "bg-warn/15 text-warn",
  upheld: "bg-surface-raised text-ink",
  overturned: "bg-success/15 text-success",
  reduced: "bg-success/15 text-success",
  rejected: "bg-surface-raised text-ink-muted",
  revoked: "bg-surface-raised text-ink-muted",
  expired: "bg-surface-raised text-ink-muted",
};

type Tab = "approvals" | "appeals" | "allAppeals" | "inForce";
const TABS: { id: Tab; name: string }[] = [
  { id: "approvals", name: "Awaiting approval" },
  { id: "appeals", name: "Open appeals" },
  { id: "inForce", name: "In force" },
  { id: "allAppeals", name: "All appeals" },
];

function Chip({ value }: { value: string }) {
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLE[value] || "bg-surface-raised text-ink"}`}>{label(value)}</span>;
}

export default function PenaltiesPage() {
  const user = useAuthStore((state) => state.user);
  const isSuper = user?.role === "superadmin";
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("approvals");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<any | null>(null);

  const isAppeals = tab === "appeals" || tab === "allAppeals";
  const path = isAppeals ? "/admin/moderation/appeals" : "/admin/moderation/actions";
  const status = tab === "approvals" ? "pending_approval" : tab === "inForce" ? "active" : tab === "appeals" ? "pending" : "all";

  const { data, isLoading, error } = useQuery({
    queryKey: ["pen-list", tab, page],
    queryFn: async () => (await api.get(path, { params: { status, page, limit: 20 } })).data,
    refetchInterval: 30000,
  });
  const rows: any[] = data?.data || [];
  const totalPages: number = data?.pagination?.totalPages || 1;
  const changed = () => queryClient.invalidateQueries({ queryKey: ["pen-list"] });

  const empty: Record<Tab, string> = {
    approvals: "No account closures are waiting for a second moderator.",
    appeals: "No appeals are waiting for review.",
    inForce: "No penalties are in force.",
    allAppeals: "No appeals yet.",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-semibold text-ink">Penalties and appeals</h1>
          <p className="text-ink-muted mt-1 text-sm">Closing an account needs a second moderator. Appeals are decided by someone who took no part in the original decision.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === t.id ? "bg-accent text-white" : "bg-surface-raised text-ink-muted hover:text-ink"}`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {error && <p className="text-danger text-sm">{(error as any)?.response?.data?.message || "Could not load this list."}</p>}

        {isLoading ? (
          <div className="card p-8 text-center text-ink-muted">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="card p-12 text-center">
            <Gavel size={48} className="mx-auto mb-4 text-ink-muted opacity-30" />
            <p className="text-ink-muted">{empty[tab]}</p>
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-raised border-b border-border">
                <tr>
                  {(isAppeals ? ["Person", "Decision appealed", "Filed", "Status", "Your part"] : ["Person", "Action", "Status", "Proposed by", "Deadline / ends"]).map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-ink-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) =>
                  isAppeals ? (
                    <tr key={r.id} onClick={() => setSelected(r)} className="hover:bg-surface-raised transition cursor-pointer">
                      <td className="px-4 py-3 text-sm text-ink">{r.userName || "—"}</td>
                      <td className="px-4 py-3 text-sm text-ink">{ACTION_LABEL[r.actionType] || label(r.actionType)}</td>
                      <td className="px-4 py-3 text-sm text-ink-muted">{day(r.createdAt)}</td>
                      <td className="px-4 py-3">
                        <Chip value={r.status} />
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-muted">
                        {r.status === "pending" || r.status === "under_review" ? (r.canDecide ? "You can decide this" : r.cannotDecideBecause) : "Decided"}
                      </td>
                    </tr>
                  ) : (
                    <tr key={r.id} onClick={() => setSelected(r)} className="hover:bg-surface-raised transition cursor-pointer">
                      <td className="px-4 py-3 text-sm text-ink">{r.userName || "—"}</td>
                      <td className="px-4 py-3 text-sm text-ink">{r.label || ACTION_LABEL[r.actionType]}</td>
                      <td className="px-4 py-3">
                        <Chip value={r.status} />
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-muted">{r.proposedByName || "—"}</td>
                      <td className="px-4 py-3 text-sm text-ink-muted">{r.status === "pending_approval" ? `Lapses ${day(r.pendingExpiresAt)}` : r.expiresAt ? `Ends ${day(r.expiresAt)}` : "Until lifted"}</td>
                    </tr>
                  )
                )}
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

        {selected && !isAppeals && <ActionDrawer row={selected} isSuper={isSuper} onClose={() => setSelected(null)} onChanged={changed} />}
        {selected && isAppeals && <AppealDrawer id={selected.id} onClose={() => setSelected(null)} onChanged={changed} />}
      </div>
    </DashboardLayout>
  );
}

function Drawer({ title, subtitle, onClose, children }: { title: string; subtitle?: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={onClose}>
      <div className="w-full max-w-xl h-full overflow-y-auto bg-surface border-l border-border p-6 space-y-5" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={title}>
        <div className="flex items-start justify-between">
          <div>
            {subtitle && <p className="text-xs text-ink-muted">{subtitle}</p>}
            <h2 className="text-xl font-display font-semibold text-ink">{title}</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-2 text-ink-muted hover:text-ink">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Evidence({ evidence }: { evidence: any }) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-ink mb-1">What was reported (copied when the decision was made)</h3>
      <pre className="text-xs bg-surface-raised rounded-lg p-3 overflow-x-auto max-h-56 whitespace-pre-wrap break-words">
        {evidence?.snapshot ? JSON.stringify(evidence.snapshot, null, 2).slice(0, 4000) : "No copy was captured."}
      </pre>
    </section>
  );
}

function useRun(onChanged: () => void, refreshKey: unknown[]) {
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const run = useMutation({
    mutationFn: async (fn: () => Promise<unknown>) => fn(),
    onSuccess: () => {
      setError("");
      queryClient.invalidateQueries({ queryKey: refreshKey });
      onChanged();
    },
    onError: (e: any) => setError(e?.response?.data?.message || "That did not work. Please try again."),
  });
  return { run, error };
}

function ActionDrawer({ row, isSuper, onClose, onChanged }: { row: any; isSuper: boolean; onClose: () => void; onChanged: () => void }) {
  const [note, setNote] = useState("");
  const { run, error } = useRun(onChanged, ["pen-action", row.id]);
  const { data: a, isLoading } = useQuery({
    queryKey: ["pen-action", row.id],
    queryFn: async () => (await api.get(`/admin/moderation/actions/${row.id}`)).data.data,
  });

  const post = (verb: string, body: object) => () => api.post(`/admin/moderation/actions/${row.id}/${verb}`, body);
  const pending = a?.status === "pending_approval";
  const canLift = a?.status === "active" && a.actionType !== "content_removal" && (a.actionType !== "permanent_termination" || isSuper);

  return (
    <Drawer title={a ? ACTION_LABEL[a.actionType] || label(a.actionType) : "Decision"} subtitle={a?.userName} onClose={onClose}>
      {isLoading || !a ? (
        <p className="text-ink-muted">Loading...</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 text-xs">
            <Chip value={a.status} />
            {a.feature && <span className="px-2.5 py-1 rounded-full bg-surface-raised text-ink capitalize">{a.feature}</span>}
            {a.reducedFrom && <span className="px-2.5 py-1 rounded-full bg-surface-raised text-ink">Reduced from an account closure</span>}
          </div>

          <section>
            <h3 className="text-sm font-semibold text-ink mb-1">Reason the person was shown</h3>
            <p className="text-sm text-ink whitespace-pre-wrap">{a.reason}</p>
            {a.policySection && <p className="text-xs text-ink-muted mt-1">Community Standards section: {a.policySection}</p>}
          </section>

          <section className="text-sm text-ink-muted space-y-1">
            <p>Proposed or imposed by {a.proposedByName || "—"} on {when(a.createdAt)}</p>
            {a.approvedByName && <p>Approved by {a.approvedByName}</p>}
            {a.rejectedByName && <p>Not approved by {a.rejectedByName}{a.rejectionNote ? `: ${a.rejectionNote}` : ""}</p>}
            {a.revokedByName && <p>Lifted by {a.revokedByName}{a.revokedReason ? `: ${a.revokedReason}` : ""}</p>}
            {pending && <p className="text-warn">Lapses on {when(a.pendingExpiresAt)} if nobody approves it.</p>}
            {a.status === "active" && a.expiresAt && <p>Ends {when(a.expiresAt)}</p>}
          </section>

          <Evidence evidence={a.evidence} />

          {pending && (
            <section className="card p-4 space-y-3">
              <h3 className="text-sm font-semibold text-ink">Second moderator</h3>
              {row.canApprove ? (
                <>
                  <p className="text-xs text-ink-muted">Read the reason and the evidence. If you approve, the account is closed and the person can appeal.</p>
                  <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} maxLength={1000} className="input-field" placeholder="Note (required if you do not approve)" />
                  <div className="flex gap-2">
                    <button
                      onClick={() => confirm("Close this account? The person will be told and can appeal.") && run.mutate(post("approve", { note: note.trim() }))}
                      disabled={run.isPending}
                      className="btn-primary disabled:opacity-50"
                    >
                      Approve closure
                    </button>
                    <button onClick={() => run.mutate(post("reject", { note: note.trim() }))} disabled={run.isPending || !note.trim()} className="btn-secondary disabled:opacity-50">
                      Do not approve
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-ink-muted">You cannot approve this one: it needs a different moderator than the one who proposed it, and one who can see the case.</p>
              )}
            </section>
          )}

          {canLift && (
            <section className="card p-4 space-y-3">
              <h3 className="text-sm font-semibold text-ink">Lift early</h3>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} maxLength={1000} className="input-field" placeholder="Why you are lifting it (recorded)" />
              <button
                onClick={() => confirm("Lift this penalty now? The person will be told.") && run.mutate(post("revoke", { reason: note.trim() }))}
                disabled={run.isPending || !note.trim()}
                className="btn-secondary disabled:opacity-50"
              >
                Lift penalty
              </button>
            </section>
          )}
          {a.status === "active" && a.actionType === "permanent_termination" && !isSuper && <p className="text-xs text-ink-muted">Only a superadmin can lift an account closure.</p>}

          {error && <p className="text-sm text-danger">{error}</p>}
        </>
      )}
    </Drawer>
  );
}

function AppealDrawer({ id, onClose, onChanged }: { id: string; onClose: () => void; onChanged: () => void }) {
  const [decision, setDecision] = useState("");
  const [days, setDays] = useState("");
  const [reason, setReason] = useState("");
  const { run, error } = useRun(onChanged, ["pen-appeal", id]);
  const { data: ap, isLoading } = useQuery({
    queryKey: ["pen-appeal", id],
    queryFn: async () => (await api.get(`/admin/moderation/appeals/${id}`)).data.data,
  });

  const open = ap && (ap.status === "pending" || ap.status === "under_review");
  const dayCount = Number(days);
  const needsDays = decision === "reduced";
  const ready = !!decision && !!reason.trim() && (!needsDays || (Number.isInteger(dayCount) && dayCount >= 1 && dayCount <= 90));
  const act = ap?.action;

  const submit = () => {
    const body: Record<string, unknown> = { decision, reason: reason.trim() };
    if (needsDays) body.reducedToDays = dayCount;
    run.mutate(() => api.post(`/admin/moderation/appeals/${id}/decide`, body));
  };

  return (
    <Drawer title="Appeal" subtitle={ap?.userName} onClose={onClose}>
      {isLoading || !ap ? (
        <p className="text-ink-muted">Loading...</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 text-xs">
            <Chip value={ap.status} />
            {act && <span className="px-2.5 py-1 rounded-full bg-surface-raised text-ink">{ACTION_LABEL[act.actionType] || label(act.actionType)}</span>}
          </div>

          <section>
            <h3 className="text-sm font-semibold text-ink mb-1">What the person says</h3>
            <p className="text-sm text-ink whitespace-pre-wrap">{ap.statement}</p>
            <p className="text-xs text-ink-muted mt-1">Filed {when(ap.createdAt)}</p>
          </section>

          {act && (
            <section className="card p-4 space-y-1">
              <h3 className="text-sm font-semibold text-ink">The decision being appealed</h3>
              <p className="text-sm text-ink whitespace-pre-wrap">{act.reason}</p>
              {act.policySection && <p className="text-xs text-ink-muted">Community Standards section: {act.policySection}</p>}
              <p className="text-xs text-ink-muted">
                Imposed by {act.imposedByName || "—"}
                {act.approvedByName ? `, approved by ${act.approvedByName}` : ""} · {when(act.startsAt)}
                {act.durationDays ? ` · ${act.durationDays} day(s)` : ""}
                {act.reducedFrom ? " · reduced from an account closure" : ""}
              </p>
            </section>
          )}
          {act && <Evidence evidence={act.evidence} />}

          {!open && ap.decision && (
            <section className="card p-4">
              <h3 className="text-sm font-semibold text-ink capitalize">Decided: {label(ap.decision)}</h3>
              <p className="text-sm text-ink mt-1 whitespace-pre-wrap">{ap.decisionReason}</p>
              <p className="text-xs text-ink-muted mt-2">
                {ap.reviewerName || "Moderator"} · {when(ap.decidedAt)}
              </p>
            </section>
          )}

          {open && !ap.canDecide && <p className="text-sm text-warn">{ap.cannotDecideBecause || "You cannot decide this appeal."}</p>}

          {open && ap.canDecide && (
            <section className="card p-4 space-y-3">
              <h3 className="text-sm font-semibold text-ink">Decide</h3>
              <select value={decision} onChange={(e) => setDecision(e.target.value)} className="input-field" aria-label="Decision">
                <option value="">Choose a decision...</option>
                <option value="upheld">Uphold: the decision stands</option>
                <option value="overturned">Overturn: lift it completely</option>
                {act && ["temporary_suspension", "feature_restriction", "permanent_termination"].includes(act.actionType) && (
                  <option value="reduced">{act.actionType === "permanent_termination" ? "Reduce: turn it into a suspension" : "Reduce: shorten it"}</option>
                )}
              </select>
              {needsDays && (
                <div>
                  <label className="block text-xs font-medium text-ink mb-1">
                    New length in days{act?.durationDays ? ` (it was ${act.durationDays})` : ""}
                  </label>
                  <input type="number" min={1} max={90} value={days} onChange={(e) => setDays(e.target.value)} className="input-field" />
                </div>
              )}
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} maxLength={2000} className="input-field" placeholder="Your reasons. The person will be shown this." />
              <button
                onClick={() => confirm("Record this decision? It is final and the person will be told.") && submit()}
                disabled={run.isPending || !ready}
                className="btn-primary disabled:opacity-50"
              >
                Record decision
              </button>
            </section>
          )}

          {error && <p className="text-sm text-danger">{error}</p>}
        </>
      )}
    </Drawer>
  );
}
