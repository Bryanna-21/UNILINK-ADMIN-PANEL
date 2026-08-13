"use client";

import { useState } from "react";

import DashboardLayout from "@/components/layout/dashboard-layout";
import UniversityCard from "@/components/universities/university-card";
import SearchBar from "@/components/common/search-bar";
import EmptyState from "@/components/common/empty-state";
import ErrorState from "@/components/common/error-state";
import SkeletonCard from "@/components/loaders/skeleton-card";

import { useUniversities, useSetUniversityVerified } from "@/hooks/use-universities";

export default function UniversitiesPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, error, refetch } = useUniversities({ search: search || undefined });
  const verifyMutation = useSetUniversityVerified();

  const universities = data?.data ?? [];

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-semibold text-ink">Universities</h1>
            <p className="text-ink-muted mt-2 text-sm">Institution verification and directory.</p>
          </div>

          <div className="w-full lg:w-[300px]">
            <SearchBar value={search} onChange={setSearch} placeholder="Search universities..." />
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
      </div>
    </DashboardLayout>
  );
}
