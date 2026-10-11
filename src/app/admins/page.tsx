"use client";

import { useState } from "react";
import { Plus, Shield, Edit2, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import PasswordInput from "@/components/common/password-input";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Superadmin only. Backend: GET/POST /admin/admins, PUT/DELETE /admin/admins/:id.
// An admin tied to a university can only manage that university; one with no university is a
// platform admin. (The old form had no password field, so creating an admin always failed.)
interface Admin {
  id: string;
  name: string;
  email: string;
  status: string;
  universityId?: string | null;
}

const idOf = (o: any): string => o?.id ?? o?._id;
const emptyForm = { name: "", email: "", password: "", universityId: "", status: "active" };

export default function AdminsPage() {
  const user = useAuthStore((state) => state.user);
  const isSuper = user?.role === "superadmin";
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Admin | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  // All hooks run before the access check below, so the hook count never changes between renders.
  const { data: admins = [], isLoading } = useQuery<Admin[]>({
    queryKey: ["admins"],
    queryFn: async () => (await api.get("/admin/admins", { params: { limit: 100 } })).data.data || [],
    enabled: isSuper,
  });
  const { data: universities = [] } = useQuery<any[]>({
    queryKey: ["university-options"],
    queryFn: async () => (await api.get("/admin/universities", { params: { limit: 100 } })).data.data || [],
    enabled: isSuper,
  });

  const close = () => {
    setOpen(false);
    setEditing(null);
    setForm(emptyForm);
    setError("");
  };

  const save = useMutation({
    mutationFn: async () => {
      if (editing) {
        return api.put(`/admin/admins/${editing.id}`, {
          name: form.name.trim(),
          email: form.email.trim(),
          status: form.status,
          universityId: form.universityId,
        });
      }
      return api.post("/admin/admins", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        universityId: form.universityId || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      close();
    },
    onError: (e: any) => setError(e?.response?.data?.message || "Could not save the administrator."),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => api.delete(`/admin/admins/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admins"] }),
    onError: (e: any) => alert(e?.response?.data?.message || "Could not delete the administrator."),
  });

  const submit = () => {
    setError("");
    if (!form.name.trim() || !form.email.trim()) return setError("Name and email are required.");
    if (!editing && form.password.length < 8) return setError("The temporary password must be at least 8 characters.");
    save.mutate();
  };

  const openEdit = (a: Admin) => {
    setEditing(a);
    setForm({ name: a.name, email: a.email, password: "", universityId: a.universityId || "", status: a.status || "active" });
    setError("");
    setOpen(true);
  };

  const universityName = (id?: string | null) => (id ? universities.find((u) => idOf(u) === id)?.name || "Unknown" : "All universities");

  if (!isSuper) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <Shield size={48} className="mx-auto mb-4 text-ink-muted opacity-50" />
          <h2 className="text-xl font-semibold text-ink">Access Denied</h2>
          <p className="text-ink-muted mt-2">Only superadmins can manage administrators.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-semibold text-ink">Admin Management</h1>
            <p className="text-ink-muted mt-2 text-sm">Create and manage administrator accounts</p>
          </div>
          <button
            onClick={() => {
              setEditing(null);
              setForm(emptyForm);
              setError("");
              setOpen(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Add Admin
          </button>
        </div>

        {isLoading ? (
          <div className="card p-8 text-center text-ink-muted">Loading administrators...</div>
        ) : admins.length === 0 ? (
          <div className="card p-12 text-center">
            <Shield size={48} className="mx-auto mb-4 text-ink-muted opacity-30" />
            <p className="text-ink-muted">No administrators yet. Create one to get started.</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-surface-raised border-b border-border">
                <tr>
                  {["Name", "Email", "University", "Status"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-ink-muted">
                      {h}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-semibold text-ink-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {admins.map((a) => (
                  <tr key={a.id} className="hover:bg-surface-raised transition">
                    <td className="px-6 py-4 text-sm font-medium text-ink">{a.name}</td>
                    <td className="px-6 py-4 text-sm text-ink-muted">{a.email}</td>
                    <td className="px-6 py-4 text-sm text-ink">{universityName(a.universityId)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${a.status === "active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{a.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(a)} className="p-2 hover:bg-surface-raised rounded-lg text-ink-muted hover:text-ink transition" title="Edit" aria-label={`Edit ${a.name}`}>
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => confirm(`Delete admin "${a.name}"? This cannot be undone.`) && remove.mutate(a.id)}
                          className="p-2 hover:bg-danger/10 rounded-lg text-ink-muted hover:text-danger transition"
                          title="Delete"
                          aria-label={`Delete ${a.name}`}
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
              <h2 className="text-xl font-display font-semibold text-ink mb-4">{editing ? "Edit Admin" : "Create Admin"}</h2>
              <div className="space-y-4 max-h-[65vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Admin name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="admin@example.com" />
                </div>
                {!editing && (
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">Temporary password *</label>
                    <PasswordInput value={form.password} onChange={(v) => setForm({ ...form, password: v })} autoComplete="new-password" />
                    <p className="text-xs text-ink-muted mt-1">At least 8 characters. They should change it after signing in.</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">University</label>
                  <select value={form.universityId} onChange={(e) => setForm({ ...form, universityId: e.target.value })} className="input-field">
                    <option value="">All universities (platform admin)</option>
                    {universities.map((u) => (
                      <option key={idOf(u)} value={idOf(u)}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-ink-muted mt-1">An admin tied to a university can only manage that university.</p>
                </div>
                {editing && (
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">Status</label>
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                )}
                {error && <p className="text-sm text-danger">{error}</p>}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={close} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button onClick={submit} disabled={save.isPending} className="btn-primary flex-1 disabled:opacity-50">
                  {save.isPending ? "Saving..." : editing ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
