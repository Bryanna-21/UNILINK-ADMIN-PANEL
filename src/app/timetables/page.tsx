"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Plus, Trash2, X } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import api from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// School timetable. Admins write it, publish it for the lecturers of one university to discuss
// (comments and an approve/object vote), then finalize it. Backend: /admin/timetables.
// Editing a published timetable starts a new version and lecturers vote again.
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const idOf = (o: any): string => o?.id ?? o?._id;
const STATUS_STYLE: Record<string, string> = {
  draft: "bg-surface-raised text-ink-muted",
  published: "bg-accent/15 text-accent",
  finalized: "bg-success/10 text-success",
};
type Row = { day: string; start: string; end: string; unitCode: string; unitName: string; lecturer: string; room: string };
const blankRow = (): Row => ({ day: "Monday", start: "08:00", end: "10:00", unitCode: "", unitName: "", lecturer: "", room: "" });

export default function TimetablesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const [editor, setEditor] = useState<{ id: string | null } | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["timetables", page],
    queryFn: async () => (await api.get("/admin/timetables", { params: { page, limit: 20 } })).data,
  });
  const items: any[] = data?.data || [];
  const totalPages: number = data?.pagination?.totalPages || 1;
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["timetables"] });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-semibold text-ink">School Timetable</h1>
            <p className="text-ink-muted mt-1 text-sm">Write the timetable, publish it for lecturers to discuss, then finalize it.</p>
          </div>
          <button onClick={() => setEditor({ id: null })} className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            New timetable
          </button>
        </div>

        {error && <p className="text-danger text-sm">{(error as any)?.response?.data?.message || "Could not load timetables."}</p>}
        {isLoading ? (
          <div className="card p-8 text-center text-ink-muted">Loading...</div>
        ) : items.length === 0 ? (
          <div className="card p-12 text-center">
            <CalendarDays size={48} className="mx-auto mb-4 text-ink-muted opacity-30" />
            <p className="text-ink-muted">No timetables yet. Create one to get started.</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-surface-raised border-b border-border">
                <tr>
                  {["Title", "University", "Status", "Rows", "Responses"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-ink-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((t) => (
                  <tr key={t.id} onClick={() => setOpenId(t.id)} className="hover:bg-surface-raised cursor-pointer transition">
                    <td className="px-4 py-3 text-sm text-ink">
                      <span className="font-medium">{t.title}</span>
                      {t.term && <span className="text-ink-muted"> · {t.term}</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-muted">{t.universityName}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLE[t.status] || ""}`}>
                        {t.status}
                        {t.status !== "draft" ? ` v${t.version}` : ""}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-muted">{t.rows}</td>
                    <td className="px-4 py-3 text-sm text-ink-muted">
                      {t.status === "draft" ? (
                        "—"
                      ) : (
                        <>
                          <span className="block">Lecturers: {t.tally.lecturer.approve} yes · {t.tally.lecturer.object} no · {t.tally.lecturer.pending} waiting</span>
                          <span className="block">Students: {t.tally.student.approve} yes · {t.tally.student.object} no</span>
                          <span className="block text-xs">{t.windowOpen ? `Open until ${new Date(t.suggestionsCloseAt).toLocaleDateString()}` : t.status === "published" ? "Window closed" : ""}</span>
                        </>
                      )}
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

        {openId && <Detail id={openId} onClose={() => setOpenId(null)} onEdit={() => { setEditor({ id: openId }); setOpenId(null); }} onChanged={refresh} />}
        {editor && <Editor id={editor.id} onClose={() => setEditor(null)} onSaved={() => { setEditor(null); refresh(); }} />}
      </div>
    </DashboardLayout>
  );
}

function Detail({ id, onClose, onEdit, onChanged }: { id: string; onClose: () => void; onEdit: () => void; onChanged: () => void }) {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const { data: t, isLoading } = useQuery({
    queryKey: ["timetable", id],
    queryFn: async () => (await api.get(`/admin/timetables/${id}`)).data.data,
  });
  const reload = () => {
    queryClient.invalidateQueries({ queryKey: ["timetable", id] });
    onChanged();
  };
  const run = useMutation({
    mutationFn: async (fn: () => Promise<unknown>) => fn(),
    onSuccess: () => {
      setError("");
      reload();
    },
    onError: (e: any) => setError(e?.response?.data?.message || "That did not work. Please try again."),
  });
  const act = (path: string, body?: object) => () => api.post(`/admin/timetables/${id}/${path}`, body ?? {});

  const byDay = (t?.entries || []).reduce((acc: Record<string, any[]>, e: any) => ((acc[e.day] = acc[e.day] || []).push(e), acc), {});

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={onClose}>
      <div className="w-full max-w-2xl h-full overflow-y-auto bg-surface border-l border-border p-6 space-y-5" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Timetable details">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-display font-semibold text-ink">{t?.title || "Timetable"}</h2>
            {t && (
              <p className="text-xs text-ink-muted mt-1">
                {t.universityName}
                {t.term ? ` · ${t.term}` : ""} · <span className="capitalize">{t.status}</span> {t.status !== "draft" ? `v${t.version}` : ""}
              </p>
            )}
          </div>
          <button onClick={onClose} aria-label="Close" className="p-2 text-ink-muted hover:text-ink">
            <X size={18} />
          </button>
        </div>

        {isLoading || !t ? (
          <p className="text-ink-muted">Loading...</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {t.status !== "finalized" && (
                <button onClick={onEdit} className="btn-secondary">
                  Edit
                </button>
              )}
              {t.status === "draft" && (
                <button onClick={() => confirm("Publish this timetable? Lecturers of this university will be able to see and discuss it.") && run.mutate(act("publish"))} disabled={run.isPending} className="btn-primary disabled:opacity-50">
                  Publish for discussion
                </button>
              )}
              {t.status === "published" && (
                <button
                  onClick={() => confirm("Finalize this timetable? Comments and voting close, and it can no longer be edited.") && run.mutate(act("finalize"))}
                  disabled={run.isPending || !t.canFinalize}
                  title={t.canFinalize ? "" : `You can finalize once the suggestion window closes on ${new Date(t.finalizeBlockedUntil).toLocaleDateString()}`}
                  className="btn-primary disabled:opacity-50"
                >
                  Finalize
                </button>
              )}
              <button
                onClick={() =>
                  confirm("Delete this timetable and its discussion? This cannot be undone.") &&
                  run.mutate(async () => {
                    await api.delete(`/admin/timetables/${id}`);
                    onChanged();
                    onClose();
                  })
                }
                disabled={run.isPending}
                className="px-4 py-2 rounded-lg bg-danger/10 text-danger text-sm font-medium hover:bg-danger/20 disabled:opacity-50 flex items-center gap-2"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
            {error && <p className="text-sm text-danger">{error}</p>}

            {t.status === "published" && (
              <p className="text-sm text-ink">
                {t.windowOpen
                  ? `Lecturers and students can respond until ${new Date(t.suggestionsCloseAt).toLocaleString()}. You can finalize after that.`
                  : "The suggestion window has closed. You can finalize now, or edit the timetable to start a new round."}
              </p>
            )}

            {t.conflicts.length > 0 && (
              <div className="rounded-lg bg-warning/10 p-3 text-sm text-warning">
                <p className="font-semibold">Clashes to check ({t.conflicts.length})</p>
                <ul className="mt-1 list-disc pl-5">
                  {t.conflicts.map((c: any, i: number) => (
                    <li key={i}>
                      {c.day}: {c.a} and {c.b} share the same {c.type === "room" ? "room" : "lecturer"} at overlapping times
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <section>
              <h3 className="text-sm font-semibold text-ink mb-2">Timetable ({t.entries.length} rows)</h3>
              {t.entries.length === 0 ? (
                <p className="text-sm text-ink-muted">No rows yet.</p>
              ) : (
                Object.entries(byDay).map(([day, rows]: [string, any]) => (
                  <div key={day} className="mb-3">
                    <p className="text-xs font-semibold text-ink-muted uppercase">{day}</p>
                    <ul className="mt-1 space-y-1">
                      {rows.map((e: any, i: number) => (
                        <li key={i} className="text-sm text-ink">
                          <span className="font-mono text-ink-muted">
                            {e.start}-{e.end}
                          </span>{" "}
                          <span className="font-medium">{e.unitCode}</span>
                          {e.unitName ? ` ${e.unitName}` : ""}
                          <span className="text-ink-muted">
                            {e.lecturer ? ` · ${e.lecturer}` : ""}
                            {e.room ? ` · ${e.room}` : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </section>

            {t.status !== "draft" && (
              <section>
                <h3 className="text-sm font-semibold text-ink mb-2">Responses to version {t.version}</h3>
                {(["lecturer", "student"] as const).map((role) => {
                  const tl = t.tally[role];
                  const list = t.responses.filter((r: any) => r.role === role);
                  return (
                    <div key={role} className="mb-4">
                      <p className="text-sm font-medium text-ink capitalize">
                        {role}s: {tl.approve} approve · {tl.object} object · {tl.pending} haven't responded (of {role === "lecturer" ? t.lecturerCount : t.studentCount})
                      </p>
                      <ul className="space-y-2 mt-2">
                        {list.map((r: any) => (
                          <li key={r.userId} className="text-sm">
                            <span className={r.vote === "approve" ? "text-success font-medium" : "text-danger font-medium"}>{r.vote === "approve" ? "Approved" : "Objected"}</span> <span className="text-ink">{r.name}</span>
                            {r.reason && <p className="text-ink-muted whitespace-pre-wrap">{r.reason}</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
                {t.pendingLecturers.length > 0 && <p className="text-xs text-ink-muted">Lecturers still to respond: {t.pendingLecturers.map((p: any) => p.name).join(", ")}</p>}
              </section>
            )}

            {t.status !== "draft" && (
              <section>
                <h3 className="text-sm font-semibold text-ink mb-2">Discussion</h3>
                {t.comments.length === 0 && <p className="text-sm text-ink-muted">No comments yet.</p>}
                <ul className="space-y-3">
                  {t.comments.map((c: any) => (
                    <li key={c.id} className="text-sm">
                      <p className="text-xs text-ink-muted">
                        {c.userName} ({c.role}) · v{c.version} · {new Date(c.createdAt).toLocaleString()}
                      </p>
                      <p className="text-ink whitespace-pre-wrap">{c.text}</p>
                      <button
                        onClick={() => confirm("Remove this comment for everyone?") && run.mutate(() => api.delete(`/admin/timetables/${id}/comments/${c.id}`))}
                        disabled={run.isPending}
                        className="text-xs text-ink-muted hover:text-danger"
                      >
                        Remove comment
                      </button>
                    </li>
                  ))}
                </ul>
                {t.status === "published" && (
                  <div className="mt-3">
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={2} maxLength={1000} className="input-field" placeholder="Reply to the lecturers" />
                    <button
                      onClick={() =>
                        run.mutate(async () => {
                          await act("comments", { text: comment.trim() })();
                          setComment("");
                        })
                      }
                      disabled={run.isPending || !comment.trim()}
                      className="btn-secondary mt-2 disabled:opacity-50"
                    >
                      Post comment
                    </button>
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Editor({ id, onClose, onSaved }: { id: string | null; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState("");
  const [term, setTerm] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [rows, setRows] = useState<Row[]>([blankRow()]);
  const [status, setStatus] = useState("draft");
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(!id);

  const { data: scope } = useQuery({
    queryKey: ["admin-scope"],
    queryFn: async () => (await api.get("/admin/scope")).data.data as { assigned: boolean; universityId: string | null; universityName: string | null },
  });
  const { data: universities = [] } = useQuery<any[]>({
    queryKey: ["university-options"],
    queryFn: async () => (await api.get("/admin/options/universities")).data.data || [],
    enabled: !!scope && !scope.assigned,
  });

  useEffect(() => {
    if (!id) return;
    api.get(`/admin/timetables/${id}`).then((r) => {
      const t = r.data.data;
      setTitle(t.title);
      setTerm(t.term || "");
      setStatus(t.status);
      setRows(t.entries.length ? t.entries.map((e: any) => ({ ...blankRow(), ...e })) : [blankRow()]);
      setLoaded(true);
    }).catch(() => setError("Could not load this timetable."));
  }, [id]);

  const save = useMutation({
    mutationFn: async () => {
      const entries = rows.map((r) => ({ ...r, unitCode: r.unitCode.trim(), unitName: r.unitName.trim(), lecturer: r.lecturer.trim(), room: r.room.trim() }));
      if (id) return api.put(`/admin/timetables/${id}`, { title: title.trim(), term: term.trim(), entries });
      return api.post("/admin/timetables", { title: title.trim(), term: term.trim(), entries, universityId: scope?.assigned ? scope.universityId : universityId });
    },
    onSuccess: onSaved,
    onError: (e: any) => setError(e?.response?.data?.message || "Could not save the timetable."),
  });

  const setRow = (i: number, k: keyof Row, v: string) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, [k]: v } : r)));

  const submit = () => {
    setError("");
    if (!title.trim()) return setError("A title is required.");
    if (!id && !scope?.assigned && !universityId) return setError("Choose a university.");
    const bad = rows.findIndex((r) => !r.unitCode.trim());
    if (bad >= 0) return setError(`Row ${bad + 1}: a unit code is required. Remove empty rows.`);
    save.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface rounded-card border border-border w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 space-y-4" role="dialog" aria-label="Timetable editor">
        <h2 className="text-xl font-display font-semibold text-ink">{id ? "Edit timetable" : "New timetable"}</h2>
        {id && status === "published" && <p className="text-sm text-warning">This timetable is published. Saving starts a new version, everyone is asked to vote again, and the window stays open for at least 7 more days.</p>}
        {!loaded ? (
          <p className="text-ink-muted">Loading...</p>
        ) : (
          <>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Title *</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={150} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Term</label>
                <input value={term} onChange={(e) => setTerm(e.target.value)} maxLength={80} className="input-field" placeholder="e.g. Semester 1, 2026/27" />
              </div>
              {!id && (
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">University *</label>
                  {scope?.assigned ? (
                    <p className="text-sm text-ink py-2">{scope.universityName || "Your university"}</p>
                  ) : (
                    <select value={universityId} onChange={(e) => setUniversityId(e.target.value)} className="input-field">
                      <option value="">Select...</option>
                      {universities.map((u) => (
                        <option key={idOf(u)} value={idOf(u)}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="hidden md:grid grid-cols-12 gap-2 text-xs font-semibold text-ink-muted">
                <span className="col-span-2">Day</span>
                <span className="col-span-2">Start / End</span>
                <span className="col-span-1">Unit *</span>
                <span className="col-span-3">Unit name</span>
                <span className="col-span-2">Lecturer</span>
                <span className="col-span-1">Room</span>
                <span className="col-span-1" />
              </div>
              {rows.map((r, i) => (
                <div key={i} className="grid grid-cols-2 md:grid-cols-12 gap-2 items-center">
                  <select value={r.day} onChange={(e) => setRow(i, "day", e.target.value)} className="input-field md:col-span-2" aria-label={`Row ${i + 1} day`}>
                    {DAYS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                  <div className="flex gap-1 md:col-span-2">
                    <input type="time" value={r.start} onChange={(e) => setRow(i, "start", e.target.value)} className="input-field" aria-label={`Row ${i + 1} start`} />
                    <input type="time" value={r.end} onChange={(e) => setRow(i, "end", e.target.value)} className="input-field" aria-label={`Row ${i + 1} end`} />
                  </div>
                  <input value={r.unitCode} onChange={(e) => setRow(i, "unitCode", e.target.value)} maxLength={20} className="input-field md:col-span-1" placeholder="CS101" aria-label={`Row ${i + 1} unit code`} />
                  <input value={r.unitName} onChange={(e) => setRow(i, "unitName", e.target.value)} maxLength={100} className="input-field md:col-span-3" placeholder="Unit name" aria-label={`Row ${i + 1} unit name`} />
                  <input value={r.lecturer} onChange={(e) => setRow(i, "lecturer", e.target.value)} maxLength={100} className="input-field md:col-span-2" placeholder="Lecturer" aria-label={`Row ${i + 1} lecturer`} />
                  <input value={r.room} onChange={(e) => setRow(i, "room", e.target.value)} maxLength={60} className="input-field md:col-span-1" placeholder="Room" aria-label={`Row ${i + 1} room`} />
                  <button onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))} className="p-2 text-ink-muted hover:text-danger md:col-span-1" aria-label={`Remove row ${i + 1}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button onClick={() => setRows((rs) => [...rs, { ...blankRow(), day: rs[rs.length - 1]?.day || "Monday" }])} className="btn-secondary">
                Add row
              </button>
            </div>
          </>
        )}
        {error && <p className="text-sm text-danger">{error}</p>}
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button onClick={submit} disabled={save.isPending || !loaded} className="btn-primary disabled:opacity-50">
            {save.isPending ? "Saving..." : id ? "Save changes" : "Save draft"}
          </button>
        </div>
      </div>
    </div>
  );
}
