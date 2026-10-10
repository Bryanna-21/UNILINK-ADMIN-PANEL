"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// One management screen for campuses, faculties and departments, in the same style as
// the units page (DashboardLayout, React Query, card/input-field/btn-* classes).
// Endpoints: GET/POST /admin/<path>, PUT/DELETE /admin/<path>/:id (all superadmin-only
// on the backend, so this page is gated the same way).

export interface StructureField {
  key: string;
  label: string;
  required?: boolean;
  ref?: string; // admin list endpoint that fills a dropdown, e.g. "/admin/universities"
}
export interface StructureColumn {
  label: string;
  keys: string[]; // first key that has a value wins
}
interface Props {
  title: string;
  subtitle: string;
  singular: string;
  path: string; // e.g. "/admin/campuses"
  fields: StructureField[];
  columns: StructureColumn[];
  icon: any;
}

const idOf = (o: any) => o?.id ?? o?._id;

export default function StructurePage({ title, subtitle, singular, path, fields, columns, icon: Icon }: Props) {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["structure", path],
    queryFn: async () => (await api.get(path, { params: { limit: 100 } })).data.data || [],
    enabled: user?.role === "superadmin",
  });

  const { data: refs = {} } = useQuery<Record<string, any[]>>({
    queryKey: ["structure-refs", path],
    queryFn: async () => {
      const out: Record<string, any[]> = {};
      for (const f of fields.filter((x) => x.ref)) {
        out[f.key] = (await api.get(f.ref!, { params: { limit: 100 } })).data.data || [];
      }
      return out;
    },
    enabled: user?.role === "superadmin",
  });

  const save = useMutation({
    mutationFn: async () => {
      const body: Record<string, string> = {};
      fields.forEach((f) => {
        const v = (form[f.key] || "").trim();
        if (v) body[f.key] = v;
      });
      return editing ? api.put(`${path}/${idOf(editing)}`, body) : api.post(path, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["structure", path] });
      close();
    },
    onError: (e: any) => setError(e?.response?.data?.message || "Could not save. Please try again."),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => api.delete(`${path}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["structure", path] }),
    onError: (e: any) => alert(e?.response?.data?.message || "Could not delete."),
  });

  const close = () => {
    setOpen(false);
    setEditing(null);
    setForm({});
    setError("");
  };

  const openCreate = () => {
    setEditing(null);
    setForm({});
    setError("");
    setOpen(true);
  };

  const openEdit = (item: any) => {
    const next: Record<string, string> = {};
    fields.forEach((f) => {
      const v = item[f.key];
      next[f.key] = (v && typeof v === "object" ? idOf(v) : v) ?? "";
    });
    setEditing(item);
    setForm(next);
    setError("");
    setOpen(true);
  };

  // Show a name, resolving a bare id against the dropdown lists when the API sent only the id.
  const cell = (item: any, keys: string[]) => {
    for (const k of keys) {
      const v = item[k];
      if (v === undefined || v === null || v === "") continue;
      if (typeof v === "object") return v.name ?? "—";
      const found = Object.values(refs).flat().find((o: any) => idOf(o) === v);
      return found ? (found as any).name : String(v);
    }
    return "—";
  };

  if (user?.role !== "superadmin") {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <Icon size={48} className="mx-auto mb-4 text-ink-muted opacity-50" />
          <h2 className="text-xl font-semibold text-ink">Access Denied</h2>
          <p className="text-ink-muted mt-2">Only superadmins can manage {title.toLowerCase()}.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-semibold text-ink">{title}</h1>
            <p className="text-ink-muted mt-2 text-sm">{subtitle}</p>
          </div>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Add {singular}
          </button>
        </div>

        {isLoading ? (
          <div className="card p-8 text-center text-ink-muted">Loading...</div>
        ) : items.length === 0 ? (
          <div className="card p-12 text-center">
            <Icon size={48} className="mx-auto mb-4 text-ink-muted opacity-30" />
            <p className="text-ink-muted">Nothing here yet. Add a {singular.toLowerCase()} to get started.</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-surface-raised border-b border-border">
                <tr>
                  {columns.map((c) => (
                    <th key={c.label} className="px-6 py-3 text-left text-xs font-semibold text-ink-muted">
                      {c.label}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-semibold text-ink-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item: any) => (
                  <tr key={idOf(item)} className="hover:bg-surface-raised transition">
                    {columns.map((c) => (
                      <td key={c.label} className="px-6 py-4 text-sm text-ink">
                        {cell(item, c.keys)}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-2 hover:bg-surface-raised rounded-lg text-ink-muted hover:text-ink transition"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${item.name}"?`)) remove.mutate(idOf(item));
                          }}
                          className="p-2 hover:bg-danger/10 rounded-lg text-ink-muted hover:text-danger transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {open && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-card p-6 w-full max-w-md border border-border">
              <h2 className="text-xl font-display font-semibold text-ink mb-4">
                {editing ? `Edit ${singular}` : `Create ${singular}`}
              </h2>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {fields.map((f) => (
                  <div key={f.key}>
                    <label className="block text-sm font-medium text-ink mb-2">
                      {f.label}
                      {f.required ? " *" : ""}
                    </label>
                    {f.ref ? (
                      <select
                        value={form[f.key] || ""}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        className="input-field"
                      >
                        <option value="">Select...</option>
                        {(refs[f.key] || []).map((o: any) => (
                          <option key={idOf(o)} value={idOf(o)}>
                            {o.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={form[f.key] || ""}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        className="input-field"
                      />
                    )}
                  </div>
                ))}
                {error && <p className="text-sm text-danger">{error}</p>}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={close} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setError("");
                    const missing = fields.find((f) => f.required && !(form[f.key] || "").trim());
                    if (missing) return setError(`${missing.label} is required.`);
                    save.mutate();
                  }}
                  disabled={save.isPending}
                  className="btn-primary flex-1"
                >
                  {editing ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
