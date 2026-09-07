"use client";

import { useState } from "react";
import { Plus, Shield, Edit2, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Admin {
  id: string;
  name: string;
  email: string;
  university?: string;
  universityId?: string;
  createdAt: string;
  status: "active" | "inactive";
}

export default function AdminManagementPage() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", universityId: "" });

  // Redirect if not superadmin
  if (user?.role !== "superadmin") {
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

  const { data: admins = [], isLoading } = useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const response = await api.get("/admin/admins");
      return response.data.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post("/admin/admins", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      setIsModalOpen(false);
      setFormData({ name: "", email: "", universityId: "" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.put(`/admin/admins/${editingAdmin?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      setEditingAdmin(null);
      setFormData({ name: "", email: "", universityId: "" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (adminId: string) => {
      return api.delete(`/admin/admins/${adminId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  const handleSubmit = () => {
    if (editingAdmin) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({ name: admin.name, email: admin.email, universityId: admin.universityId || "" });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAdmin(null);
    setFormData({ name: "", email: "", universityId: "" });
  };

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
              setEditingAdmin(null);
              setFormData({ name: "", email: "", universityId: "" });
              setIsModalOpen(true);
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
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ink-muted">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ink-muted">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ink-muted">
                    University
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ink-muted">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-ink-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {admins.map((admin: Admin) => (
                  <tr key={admin.id} className="hover:bg-surface-raised transition">
                    <td className="px-6 py-4 text-sm font-medium text-ink">{admin.name}</td>
                    <td className="px-6 py-4 text-sm text-ink-muted">{admin.email}</td>
                    <td className="px-6 py-4 text-sm text-ink">{admin.university || "—"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          admin.status === "active"
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {admin.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(admin)}
                          className="p-2 hover:bg-surface-raised rounded-lg text-ink-muted hover:text-ink transition"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete admin "${admin.name}"?`)) {
                              deleteMutation.mutate(admin.id);
                            }
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

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-card p-6 w-full max-w-md border border-border">
              <h2 className="text-xl font-display font-semibold text-ink mb-4">
                {editingAdmin ? "Edit Admin" : "Create Admin"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="Admin name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                    placeholder="admin@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    University (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.universityId}
                    onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
                    className="input-field"
                    placeholder="University ID or name"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handleCloseModal} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="btn-primary flex-1"
                >
                  {editingAdmin ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
