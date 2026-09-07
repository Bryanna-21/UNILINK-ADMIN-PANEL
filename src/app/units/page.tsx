"use client";

import { useState } from "react";
import { Plus, BookOpen, Edit2, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Unit {
  id: string;
  code: string;
  name: string;
  description?: string;
  credits: number;
  university?: string;
  universityId?: string;
  status: "active" | "inactive";
  createdAt: string;
}

export default function UnitsManagementPage() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    credits: "3",
    universityId: "",
  });

  // Redirect if not superadmin
  if (user?.role !== "superadmin") {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <BookOpen size={48} className="mx-auto mb-4 text-ink-muted opacity-50" />
          <h2 className="text-xl font-semibold text-ink">Access Denied</h2>
          <p className="text-ink-muted mt-2">Only superadmins can manage units.</p>
        </div>
      </DashboardLayout>
    );
  }

  const { data: units = [], isLoading } = useQuery({
    queryKey: ["units"],
    queryFn: async () => {
      const response = await api.get("/admin/units");
      return response.data.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post("/admin/units", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      setIsModalOpen(false);
      setFormData({ code: "", name: "", description: "", credits: "3", universityId: "" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.put(`/admin/units/${editingUnit?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
      setEditingUnit(null);
      setFormData({ code: "", name: "", description: "", credits: "3", universityId: "" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (unitId: string) => {
      return api.delete(`/admin/units/${unitId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });

  const handleSubmit = () => {
    if (editingUnit) {
      updateMutation.mutate({
        ...formData,
        credits: parseInt(formData.credits),
      });
    } else {
      createMutation.mutate({
        ...formData,
        credits: parseInt(formData.credits),
      });
    }
  };

  const handleEdit = (unit: Unit) => {
    setEditingUnit(unit);
    setFormData({
      code: unit.code,
      name: unit.name,
      description: unit.description || "",
      credits: unit.credits.toString(),
      universityId: unit.universityId || "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUnit(null);
    setFormData({ code: "", name: "", description: "", credits: "3", universityId: "" });
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-semibold text-ink">Units Management</h1>
            <p className="text-ink-muted mt-2 text-sm">Create and manage academic units/courses</p>
          </div>
          <button
            onClick={() => {
              setEditingUnit(null);
              setFormData({ code: "", name: "", description: "", credits: "3", universityId: "" });
              setIsModalOpen(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Add Unit
          </button>
        </div>

        {isLoading ? (
          <div className="card p-8 text-center text-ink-muted">Loading units...</div>
        ) : units.length === 0 ? (
          <div className="card p-12 text-center">
            <BookOpen size={48} className="mx-auto mb-4 text-ink-muted opacity-30" />
            <p className="text-ink-muted">No units created yet. Add one to get started.</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-surface-raised border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ink-muted">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ink-muted">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ink-muted">
                    Credits
                  </th>
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
                {units.map((unit: Unit) => (
                  <tr key={unit.id} className="hover:bg-surface-raised transition">
                    <td className="px-6 py-4 text-sm font-semibold text-ink">{unit.code}</td>
                    <td className="px-6 py-4 text-sm text-ink">{unit.name}</td>
                    <td className="px-6 py-4 text-sm text-ink-muted">{unit.credits}</td>
                    <td className="px-6 py-4 text-sm text-ink">{unit.university || "—"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          unit.status === "active"
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {unit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(unit)}
                          className="p-2 hover:bg-surface-raised rounded-lg text-ink-muted hover:text-ink transition"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete unit "${unit.code}"?`)) {
                              deleteMutation.mutate(unit.id);
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
                {editingUnit ? "Edit Unit" : "Create Unit"}
              </h2>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="input-field"
                    placeholder="e.g., CS101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="Unit name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    placeholder="Unit description"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Credits</label>
                  <input
                    type="number"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                    className="input-field"
                    min="1"
                    max="6"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-2">University</label>
                  <input
                    type="text"
                    value={formData.universityId}
                    onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
                    className="input-field"
                    placeholder="University ID"
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
                  {editingUnit ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
