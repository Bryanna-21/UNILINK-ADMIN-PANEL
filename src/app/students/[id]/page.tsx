"use client";

import { useParams } from "next/navigation";

import DashboardLayout from "@/components/layout/dashboard-layout";
import StudentProfileCard from "@/components/students/student-profile-card";
import ErrorState from "@/components/common/error-state";
import SkeletonCard from "@/components/loaders/skeleton-card";

import { useStudent } from "@/hooks/use-student";

export default function StudentPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, error, refetch } = useStudent(params.id);

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold text-ink">Student Profile</h1>
          <p className="text-ink-muted mt-2 text-sm">Detailed student information.</p>
        </div>

        <div className="max-w-[500px]">
          {isLoading && <SkeletonCard />}
          {error && (
            <ErrorState message="Couldn't load this student." onRetry={() => refetch()} />
          )}
          {data?.data && <StudentProfileCard student={data.data} />}
        </div>
      </div>
    </DashboardLayout>
  );
}
