"use client";

import { useState } from "react";
import { Megaphone, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import api from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Post an announcement to one university, or to every university (UniLink-wide). Students see
// them in the app. An admin tied to a university can only post to that university.
// Backend: GET/POST /admin/announcements, DELETE /admin/announcements/:id, GET /admin/scope.
const GLOBAL = "GLOBAL";
const idOf = (o: any): string => o?.id ?? o?._id;

export default function AnnouncementsPage() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [target, setTarget] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const { data: scope } = useQuery({
    queryKey: ["admin-scope"],
    queryFn: async () => (await api.get("/admin/scope")).data.data as { assigned: boolean; universityId: string | null; universityName: string | null; canPostGlobal: boolean },
  });
  const { data: universities = [] } = useQuery<any[]>({
    queryKey: ["university-options"],
    queryFn: async () => (await api.get("/admin/options/universities")).data.data || [],
    enabled: !!scope && !scope.assigned,
  });
  const { data, isLoading, error: loadError } = useQuery({
    queryKey: ["announcements", page],
    queryFn: async () => (await api.get("/admin/announcements", { params: { page, limit: 20 } })).data,
  });
  const items: any[] = data?.data || [];
  const totalPages: number = data?.pagination?.totalPages || 1;
  const effectiveTarget = scope?.assigned ? scope.universityId || "" : target;

  const create = useMutation({
    mutationFn: async () =>
      api.post("/admin/announcements", {
        title: title.trim(),
        body: body.trim(),
        ...(effectiveTarget === GLOBAL ? { global: true } : { universityId: effectiveTarget }),
      }),
    onSuccess: () => {
      setTitle("");
      setBody("");
      setError("");
      setNotice("Announcement posted.");
      setPage(1);
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: (e: any) => {
      setNotice("");
      setError(e?.response?.data?.message || "Could not post the announcement.");
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => api.delete(`/admin/announcements/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["announcements"] }),
    onError: (e: any) => alert(e?.response?.data?.message || "Could not delete the announcement."),
  });

  const submit = () => {
    setError("");
    setNotice("");
    if (!title.trim() || !body.trim()) return setError("A title and a message are required.");
    if (!effectiveTarget) return setError("Choose who the announcement is for.");
    create.mutate();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-3xl font-display font-semibold text-ink">Announcements</h1>
          <p className="text-ink-muted mt-1 text-sm">Reach students and staff of one university, or all of UniLink.</p>
        </div>

        <div className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Audience</label>
            {scope?.assigned ? (
              <p className="text-sm text-ink">{scope.universityName || "Your university"}</p>
            ) : (
              <select value={target} onChange={(e) => setTarget(e.target.value)} className="input-field">
                <option value="">Select...</option>
                {scope?.canPostGlobal && <option value={GLOBAL}>UniLink (all universities)</option>}
                {universities.map((u) => (
                  <option key={idOf(u)} value={idOf(u)}>
                    {u.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={150} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Message</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={2000} rows={5} className="input-field" />
            <p className="text-xs text-ink-muted mt-1">{body.length}/2000</p>
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          {notice && <p className="text-sm text-success">{notice}</p>}
          <button onClick={submit} disabled={create.isPending} className="btn-primary flex items-center gap-2 disabled:opacity-50">
            <Megaphone size={16} />
            {create.isPending ? "Posting..." : "Post announcement"}
          </button>
        </div>

        {loadError && <p className="text-danger text-sm">Could not load announcements.</p>}
        {isLoading ? (
          <div className="card p-8 text-center text-ink-muted">Loading...</div>
        ) : items.length === 0 ? (
          <div className="card p-8 text-center text-ink-muted">No announcements yet.</div>
        ) : (
          <ul className="space-y-3">
            {items.map((a) => (
              <li key={a.id} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-ink">{a.title}</p>
                    <p className="text-xs text-ink-muted mt-1">
                      {a.universityName} · {a.postedByName} · {new Date(a.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-ink mt-3 whitespace-pre-wrap">{a.body}</p>
                  </div>
                  <button
                    onClick={() => confirm(`Delete "${a.title}"? Students will no longer see it.`) && remove.mutate(a.id)}
                    className="p-2 hover:bg-danger/10 rounded-lg text-ink-muted hover:text-danger transition shrink-0"
                    title="Delete"
                    aria-label={`Delete ${a.title}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
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
      </div>
    </DashboardLayout>
  );
}
