"use client";

import { useState } from "react";

import SearchBar from "../common/search-bar";
import Pagination from "../common/pagination";
import EmptyState from "../common/empty-state";
import ErrorState from "../common/error-state";
import SkeletonCard from "../loaders/skeleton-card";
import StudentDetailsModal from "./student-details-modal";

import { useModalStore } from "@/store/modal.store";
import { useStudents } from "@/hooks/use-students";
import { useSetStudentStatus } from "@/hooks/use-student-actions";

interface Student {
  _id: string;
  name: string;
  email: string;
  status: "active" | "suspended";
  universityId?: string;
  createdAt: string;
}

export default function StudentsTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { openModal } = useModalStore();
  const { data, isLoading, error, refetch } = useStudents({ page, search, limit: 20 });
  const statusMutation = useSetStudentStatus();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message="Couldn't load students. The server may be unreachable."
        onRetry={() => refetch()}
      />
    );
  }

  const students: Student[] = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  return (
    <div className="card p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-display font-semibold text-ink">Students</h2>
          <p className="text-ink-muted text-sm mt-1">
            {data?.pagination?.total ?? 0} students across all universities.
          </p>
        </div>

        <div className="w-full lg:w-[300px]">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
          />
        </div>
      </div>

      {students.length === 0 ? (
        <EmptyState
          title="No students found"
          description={search ? "Try a different search term." : "No student accounts exist yet."}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-ink-muted">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Registered</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="border-b border-border/60">
                  <td className="py-4 text-ink">{student.name}</td>
                  <td className="py-4 text-ink-muted font-mono text-xs">{student.email}</td>
                  <td className="py-4 text-ink-muted">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <span
                      className="status-edge inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-raised text-xs capitalize"
                      data-status={student.status}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(<StudentDetailsModal student={student} />)}
                        className="px-3 py-1 rounded-lg bg-accent/15 text-accent-bright text-xs font-medium hover:bg-accent/25"
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          statusMutation.mutate({
                            studentId: student._id,
                            status: student.status === "active" ? "suspended" : "active",
                          })
                        }
                        disabled={statusMutation.isPending}
                        className="px-3 py-1 rounded-lg bg-warn/15 text-warn text-xs font-medium hover:bg-warn/25 disabled:opacity-50"
                      >
                        {student.status === "active" ? "Suspend" : "Reactivate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6">
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
