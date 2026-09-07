"use client";

import { useState } from "react";
import { Plus, Building2 } from "lucide-react";

import DashboardLayout from "@/components/layout/dashboard-layout";
import UniversityCard from "@/components/universities/university-card";
import SearchBar from "@/components/common/search-bar";
import EmptyState from "@/components/common/empty-state";
import ErrorState from "@/components/common/error-state";
import SkeletonCard from "@/components/loaders/skeleton-card";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUniversities, useSetUniversityVerified } from "@/hooks/use-universities";

export default function UniversitiesPage() {
  const user = useAuthStore((state) => state.user);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", country: "" });
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useUniversities({ search: search || undefined });
  const verifyMutation = useSetUniversityVerified();

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post("/admin/universities", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["universities"] });
      setIsModalOpen(false);
      setFormData({ name: "", email: "", country: "" });
      refetch();
    },
  });

  const universities = data?.data ?? [];

  const handleAddUniversity = () => {
    if (formData.name && formData.email) {
      createMutation.mutate(formData);
    }
  };

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-semibold text-ink">Universities</h1>
            <p className="text-ink-muted mt-2 text-sm">Institution verification and directory.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-3 lg:items-end">
            <div className="w-full lg:w-[300px]">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search universities..."
              />
            </div>

            {user?.role === "superadmin" && (
              <button
                onClick={() => {
                  setFormData({ name: "", email: "", country: "" });
                  setIsModalOpen(true);
                }}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={18} />
                Add University
              </button>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {error && <ErrorState message="Couldn't load universities." onRetry={() => refetch()} />}

        {!isLoading && !error && universities.length === 0 && (
          <EmptyState
            title="No universities yet"
            description="No universities have been onboarded to the platform yet."
          />
        )}

        {!isLoading && !error && universities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {universities.map((university: any) => (
              <UniversityCard
                key={university._id}
                university={university}
                isPending={verifyMutation.isPending}
                onVerify={() =>
                  verifyMutation.mutate({ universityId: university._id, verified: true })
                }
              />
            ))}
          </div>
        )}

        {/* Add University Modal - Superadmin only */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-card p-6 w-full max-w-md border border-border">
              <h2 className="text-xl font-display font-semibold text-ink mb-4">Add University</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    University Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="e.g., University of Nairobi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                    placeholder="contact@university.ac.ke"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="input-field"
                    placeholder="Kenya"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUniversity}
                  disabled={createMutation.isPending || !formData.name || !formData.email}
                  className="btn-primary flex-1"
                >
                  {createMutation.isPending ? "Adding..." : "Add University"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
