"use client";

import { useState } from "react";
import { Wallet, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import api from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Post loans and sponsorships for students. UniLink only lists them and links to the provider: it
// takes no applications and handles no money. Backend: GET/POST /admin/opportunities,
// DELETE /admin/opportunities/:id, GET /admin/scope. An admin tied to a university posts only to
// that university; a superadmin or platform admin can also post for all of UniLink.
const GLOBAL = "GLOBAL";
const idOf = (o: any): string => o?.id ?? o?._id;
const empty = { type: "loan", title: "", provider: "", amountText: "", description: "", eligibility: "", link: "", deadline: "" };

export default function OpportunitiesPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(empty);
  const [target, setTarget] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const set = (k: keyof typeof empty, v: string) => setForm((f) => ({ ...f, [k]: v }));

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
    queryKey: ["opportunities", page],
    queryFn: async () => (await api.get("/admin/opportunities", { params: { page, limit: 20 } })).data,
  });
  const items: any[] = data?.data || [];
  const totalPages: number = data?.pagination?.totalPages || 1;
  const effectiveTarget = scope?.assigned ? scope.universityId || "" : target;
  const today = new Date().toISOString().slice(0, 10);

  const create = useMutation({
    mutationFn: async () =>
      api.post("/admin/opportunities", {
        ...form,
        title: form.title.trim(),
        provider: form.provider.trim(),
        description: form.description.trim(),
        ...(effectiveTarget === GLOBAL ? { global: true } : { universityId: effectiveTarget }),
      }),
    onSuccess: () => {
      setForm(empty);
      setError("");
      setNotice("Listing posted.");
      setPage(1);
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
    },
    onError: (e: any) => {
      setNotice("");
      setError(e?.response?.data?.message || "Could not post the listing.");
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => api.delete(`/admin/opportunities/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["opportunities"] }),
    onError: (e: any) => alert(e?.response?.data?.message || "Could not delete the listing."),
  });

  const submit = () => {
    setError("");
    setNotice("");
    if (!form.title.trim() || !form.provider.trim() || !form.description.trim()) return setError("A title, who is offering it, and a description are required.");
    if (!effectiveTarget) return setError("Choose who the listing is for.");
    if (form.link.trim() && !/^https:\/\//i.test(form.link.trim())) return setError("The link must start with https://");
    create.mutate();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-3xl font-display font-semibold text-ink">Loans &amp; Sponsorships</h1>
          <p className="text-ink-muted mt-1 text-sm">Tell students about loans and sponsorships. They see these in the app under Settings, Financial Support. UniLink only lists them and links to the provider.</p>
        </div>

        <div className="card p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Type</label>
              <select value={form.type} onChange={(e) => set("type", e.target.value)} className="input-field">
                <option value="loan">Loan</option>
                <option value="sponsorship">Sponsorship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Audience</label>
              {scope?.assigned ? (
                <p className="text-sm text-ink py-2">{scope.universityName || "Your university"}</p>
              ) : (
                <select value={target} onChange={(e) => setTarget(e.target.value)} className="input-field">
                  <option value="">Select...</option>
                  {scope?.canPostGlobal && <option value={GLOBAL}>All universities (UniLink)</option>}
                  {universities.map((u) => (
                    <option key={idOf(u)} value={idOf(u)}>
                      {u.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Title *</label>
              <input value={form.title} onChange={(e) => set("title", e.target.value)} maxLength={150} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Offered by *</label>
              <input value={form.provider} onChange={(e) => set("provider", e.target.value)} maxLength={120} className="input-field" placeholder="e.g. HELB, a foundation, a company" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Description *</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} maxLength={2000} rows={4} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Who can apply</label>
            <textarea value={form.eligibility} onChange={(e) => set("eligibility", e.target.value)} maxLength={1000} rows={2} className="input-field" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Amount</label>
              <input value={form.amountText} onChange={(e) => set("amountText", e.target.value)} maxLength={80} className="input-field" placeholder="e.g. Up to KES 60,000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Link (https)</label>
              <input value={form.link} onChange={(e) => set("link", e.target.value)} maxLength={500} className="input-field" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-2">Closes on</label>
              <input type="date" min={today} value={form.deadline} onChange={(e) => set("deadline", e.target.value)} className="input-field" />
            </div>
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          {notice && <p className="text-sm text-success">{notice}</p>}
          <button onClick={submit} disabled={create.isPending} className="btn-primary flex items-center gap-2 disabled:opacity-50">
            <Wallet size={16} />
            {create.isPending ? "Posting..." : "Post listing"}
          </button>
        </div>

        {loadError && <p className="text-danger text-sm">Could not load listings.</p>}
        {isLoading ? (
          <div className="card p-8 text-center text-ink-muted">Loading...</div>
        ) : items.length === 0 ? (
          <div className="card p-8 text-center text-ink-muted">No listings yet.</div>
        ) : (
          <ul className="space-y-3">
            {items.map((o) => (
              <li key={o.id} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent/15 text-accent capitalize">{o.type}</span>
                      {o.expired && <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-warning/15 text-warning">Closed</span>}
                      <span className="text-xs text-ink-muted">{o.universityName}</span>
                    </div>
                    <p className="font-semibold text-ink mt-2">{o.title}</p>
                    <p className="text-xs text-ink-muted mt-1">
                      {o.provider}
                      {o.amountText ? ` · ${o.amountText}` : ""}
                      {o.deadline ? ` · closes ${new Date(o.deadline).toLocaleDateString()}` : ""}
                    </p>
                    <p className="text-sm text-ink mt-3 whitespace-pre-wrap break-words">{o.description}</p>
                  </div>
                  <button
                    onClick={() => confirm(`Delete "${o.title}"? Students will no longer see it.`) && remove.mutate(o.id)}
                    className="p-2 hover:bg-danger/10 rounded-lg text-ink-muted hover:text-danger transition shrink-0"
                    title="Delete"
                    aria-label={`Delete ${o.title}`}
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
