"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2, UserCheck } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import PasswordInput from "@/components/common/password-input";
import api from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Add, edit and remove lecturers. Backend: GET/POST /admin/lecturers, PUT/DELETE /admin/lecturers/:id.
// "Remove" ends the lecturer's access and signs them out; their record stays so exams and
// timetables they created keep working. An admin tied to one university only sees and manages
// that university's lecturers; a superadmin or platform admin picks the university.
interface Lecturer {
  id: string;
  name: string;
  email: string;
  department: string;
  status: "active" | "inactive";
  universityId?: string | null;
}

const idOf = (o: any): string => o?.id ?? o?._id;
const emptyForm = { name: "", email: "", password: "", department: "", universityId: "" };

export default function LecturersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Lecturer | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data: scope } = useQuery({
    queryKey: ["admin-scope"],
    queryFn: async () => (await api.get("/admin/scope")).data.data as { assigned: boolean; universityId: string | null; universityName: string | null },
  });
  const { data: universities = [] } = useQuery<any[]>({
    queryKey: ["university-options"],
    queryFn: async () => (await api.get("/admin/universities", { params: { limit: 100 } })).data.data || [],
  });
  const { data, isLoading, error: loadError } = useQuery({
    queryKey: ["lecturers", page, debounced],
    queryFn: async () => (await api.get("/admin/lecturers", { params: { page, limit: 10, search: debounced || undefined } })).data,
  });
  const lecturers: Lecturer[] = data?.data || [];
  const totalPages: number = data?.pagination?.totalPages || 1;
  const assigned = !!scope?.assigned;

  const close = () => {
    setOpen(false);
    setEditing(null);
    setForm(emptyForm);
    setError("");
  };

  const save = useMutation({
    mutationFn: async () => {
      if (editing) {
        return api.put(`/admin/lecturers/${editing.id}`, { name: form.name.trim(), email: form.email.trim(), department: form.department.trim() });
      }
      return api.post("/admin/lecturers", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        department: form.department.trim(),
        universityId: assigned ? scope?.universityId : form.universityId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lecturers"] });
      close();
    },
    onError: (e: any) => setError(e?.response?.data?.message || "Could not save the lecturer."),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => api.delete(`/admin/lecturers/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lecturers"] }),
    onError: (e: any) => alert(e?.response?.data?.message || "Could not remove the lecturer."),
  });

  const submit = () => {
    setError("");
    if (!form.name.trim() || !form.email.trim()) return setError("Name and email are required.");
    if (!editing) {
      if (form.password.length < 8) return setError("The temporary password must be at least 8 characters.");
      if (!assigned && !form.universityId) return setError("Choose a university.");
    }
    save.mutate();
  };

  const openEdit = (l: Lecturer) => {
    setEditing(l);
    setForm({ name: l.name, email: l.email, password: "", department: l.department || "", universityId: l.universityId || "" });
    setError("");
    setOpen(true);
  };

  const universityName = (id?: string | null) => (id ? universities.find((u) => idOf(u) === id)?.name || "—" : "—");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-semibold text-ink">Lecturer Management</h1>
            <p className="text-ink-muted mt-1">
              {assigned && scope?.universityName ? `Lecturers of ${scope.universityName}` : "Add and remove lecturers"}
            </p>
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
            Add Lecturer
          </button>
        </div>

        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" placeholder="Search by name, email or department" aria-label="Search lecturers" />
        </div>

        {loadError && <p className="text-danger text-sm">{(loadError as any)?.response?.data?.message || "Could not load lecturers."}</p>}

        {isLoading ? (
          <div className="card p-8 text-center text-ink-muted">Loading lecturers...</div>
        ) : lecturers.length === 0 ? (
          <div className="card p-12 text-center">
            <UserCheck size={48} className="mx-auto mb-4 text-ink-muted opacity-30" />
            <p className="text-ink-muted">{debounced ? "No lecturers match your search." : "No lecturers yet. Add one to get started."}</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-surface-raised border-b border-border">
                <tr>
                  {["Name", "Email", "Department", "University", "Status"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-ink-muted">
                      {h}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-semibold text-ink-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {lecturers.map((l) => (
                  <tr key={l.id} className="hover:bg-surface-raised transition">
                    <td className="px-6 py-4 text-sm font-medium text-ink">{l.name}</td>
                    <td className="px-6 py-4 text-sm text-ink-muted">{l.email}</td>
                    <td className="px-6 py-4 text-sm text-ink">{l.department || "—"}</td>
                    <td className="px-6 py-4 text-sm text-ink">{universityName(l.universityId)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${l.status === "active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{l.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(l)} className="p-2 hover:bg-surface-raised rounded-lg text-ink-muted hover:text-ink transition" title="Edit" aria-label={`Edit ${l.name}`}>
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => confirm(`Remove ${l.name}? They will be signed out and lose access. Their exams and timetables are kept.`) && remove.mutate(l.id)}
                          className="p-2 hover:bg-danger/10 rounded-lg text-ink-muted hover:text-danger transition"
                          title="Remove"
                          aria-label={`Remove ${l.name}`}
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

        {open && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-card p-6 w-full max-w-md border border-border">
              <h2 className="text-xl font-display font-semibold text-ink mb-4">{editing ? "Edit Lecturer" : "Add Lecturer"}</h2>
              <div className="space-y-4 max-h-[65vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Department</label>
                  <input type="text" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="input-field" placeholder="e.g. Computer Science" />
                </div>
                {!editing && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-ink mb-2">Temporary password *</label>
                      <PasswordInput value={form.password} onChange={(v) => setForm({ ...form, password: v })} autoComplete="new-password" />
                      <p className="text-xs text-ink-muted mt-1">At least 8 characters. They should change it after signing in.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink mb-2">University *</label>
                      {assigned ? (
                        <p className="text-sm text-ink">{scope?.universityName || "Your university"}</p>
                      ) : (
                        <select value={form.universityId} onChange={(e) => setForm({ ...form, universityId: e.target.value })} className="input-field">
                          <option value="">Select a university...</option>
                          {universities.map((u) => (
                            <option key={idOf(u)} value={idOf(u)}>
                              {u.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </>
                )}
                {error && <p className="text-sm text-danger">{error}</p>}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={close} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button onClick={submit} disabled={save.isPending} className="btn-primary flex-1 disabled:opacity-50">
                  {save.isPending ? "Saving..." : editing ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
