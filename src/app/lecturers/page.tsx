"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, AlertCircle, Loader } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import Modal from "@/components/common/modal";
import api from "@/lib/axios";

interface Lecturer {
  id: string;
  name: string;
  email: string;
  department: string;
  status: "active" | "inactive";
  createdAt: string;
}

interface CreateLecturerForm {
  name: string;
  email: string;
  password: string;
  department: string;
}

export default function LecturersPage() {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateLecturerForm>({
    name: "",
    email: "",
    password: "",
    department: "",
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    department: "",
  });

  // Load lecturers
  const loadLecturers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/admin/lecturers", {
        params: { page, limit: 10, search: search || undefined },
      });

      setLecturers(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to load lecturers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLecturers();
  }, [page, search]);

  // Create lecturer
  const handleCreate = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError("Name, email, and password required");
      return;
    }

    try {
      await api.post("/admin/lecturers", formData);
      setShowCreateModal(false);
      setFormData({ name: "", email: "", password: "", department: "" });
      loadLecturers();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create lecturer");
    }
  };

  // Update lecturer
  const handleUpdate = async () => {
    if (!selectedLecturer) return;

    try {
      await api.put(`/admin/lecturers/${selectedLecturer.id}`, editFormData);
      setShowEditModal(false);
      setSelectedLecturer(null);
      loadLecturers();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update lecturer");
    }
  };

  // Delete lecturer
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lecturer?")) return;

    try {
      await api.delete(`/admin/lecturers/${id}`);
      loadLecturers();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete lecturer");
    }
  };

  const openEditModal = (lecturer: Lecturer) => {
    setSelectedLecturer(lecturer);
    setEditFormData({
      name: lecturer.name,
      email: lecturer.email,
      department: lecturer.department,
    });
    setShowEditModal(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-semibold text-ink">
              Lecturer Management
            </h1>
            <p className="text-ink-muted mt-1">Manage platform lecturers and instructors</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            <Plus size={18} />
            Add Lecturer
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-ink-muted" size={18} />
            <input
              type="text"
              placeholder="Search lecturers..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-ink placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex gap-3 bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-lg">
            <AlertCircle size={20} className="flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin text-accent" size={32} />
          </div>
        )}

        {/* Lecturers Table */}
        {!loading && (
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            {lecturers.length === 0 ? (
              <div className="text-center py-12 text-ink-muted">
                <p>No lecturers found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface-light border-b border-border">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-ink">Name</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-ink">Email</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-ink">Department</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-ink">Status</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-ink">Joined</th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-ink">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lecturers.map((lecturer) => (
                      <tr key={lecturer.id} className="border-b border-border hover:bg-surface-light transition">
                        <td className="px-6 py-4 text-ink font-medium">{lecturer.name}</td>
                        <td className="px-6 py-4 text-ink-muted">{lecturer.email}</td>
                        <td className="px-6 py-4 text-ink-muted">{lecturer.department || "—"}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            lecturer.status === "active"
                              ? "bg-green-500/20 text-green-500"
                              : "bg-red-500/20 text-red-500"
                          }`}>
                            {lecturer.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-ink-muted text-sm">
                          {new Date(lecturer.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => openEditModal(lecturer)}
                            className="p-2 hover:bg-surface-light rounded transition"
                            title="Edit"
                          >
                            <Edit2 size={16} className="text-ink-muted hover:text-accent" />
                          </button>
                          <button
                            onClick={() => handleDelete(lecturer.id)}
                            className="p-2 hover:bg-surface-light rounded transition"
                            title="Delete"
                          >
                            <Trash2 size={16} className="text-ink-muted hover:text-red-500" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-surface border border-border rounded disabled:opacity-50 hover:bg-surface-light transition"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-ink-muted">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-surface border border-border rounded disabled:opacity-50 hover:bg-surface-light transition"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Create Lecturer Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Lecturer"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-ink placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-ink placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="lecturer@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-ink placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">Department</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-ink placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="e.g., Computer Science"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-ink hover:bg-surface-light rounded transition"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-accent text-white rounded hover:opacity-90 transition"
            >
              Create
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Lecturer Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Lecturer"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-2">Name</label>
            <input
              type="text"
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-ink placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">Email</label>
            <input
              type="email"
              value={editFormData.email}
              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-ink placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">Department</label>
            <input
              type="text"
              value={editFormData.department}
              onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg text-ink placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 text-ink hover:bg-surface-light rounded transition"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-accent text-white rounded hover:opacity-90 transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
