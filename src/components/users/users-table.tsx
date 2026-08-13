"use client";

import { useState } from "react";

import SearchBar from "../common/search-bar";
import Pagination from "../common/pagination";
import EmptyState from "../common/empty-state";
import ErrorState from "../common/error-state";
import SkeletonCard from "../loaders/skeleton-card";
import UserDetailsModal from "./user-details-modal";

import { useUsers, useSetUserStatus } from "@/hooks/use-users";
import { useAuthStore } from "@/store/auth.store";
import { useModalStore } from "@/store/modal.store";

interface UserRow {
  _id: string;
  name: string;
  email: string;
  role: "student" | "lecturer" | "admin";
  status: "active" | "suspended";
  createdAt: string;
}

const roleFilters: { label: string; value: "student" | "lecturer" | "admin" | undefined }[] = [
  { label: "All roles", value: undefined },
  { label: "Students", value: "student" },
  { label: "Lecturers", value: "lecturer" },
  { label: "Admins", value: "admin" },
];

export default function UsersTable() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<"student" | "lecturer" | "admin" | undefined>(undefined);
  const [page, setPage] = useState(1);

  const currentUser = useAuthStore((state) => state.user);
  const { openModal } = useModalStore();
  const { data, isLoading, error, refetch } = useUsers({ page, search, role });
  const statusMutation = useSetUserStatus();

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
    return <ErrorState message="Couldn't load users." onRetry={() => refetch()} />;
  }

  const users: UserRow[] = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  return (
    <div className="card p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-display font-semibold text-ink">Users</h2>
          <p className="text-ink-muted text-sm mt-1">{data?.pagination?.total ?? 0} accounts.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <select
            value={role ?? ""}
            onChange={(e) => {
              setRole((e.target.value || undefined) as typeof role);
              setPage(1);
            }}
            className="input-field sm:w-[160px]"
          >
            {roleFilters.map((f) => (
              <option key={f.label} value={f.value ?? ""}>
                {f.label}
              </option>
            ))}
          </select>

          <div className="w-full sm:w-[260px]">
            <SearchBar
              value={search}
              onChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {users.length === 0 ? (
        <EmptyState title="No users found" description="Try a different search or filter." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-border text-ink-muted">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => {
                const isSelf = user._id === currentUser?.id;

                return (
                  <tr key={user._id} className="border-b border-border/60">
                    <td className="py-4 text-ink">{user.name}</td>
                    <td className="py-4 text-ink-muted font-mono text-xs">{user.email}</td>
                    <td className="py-4 text-ink capitalize">{user.role}</td>
                    <td className="py-4">
                      <span
                        className="status-edge inline-flex px-3 py-1 rounded-full bg-surface-raised text-xs capitalize"
                        data-status={user.status}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal(<UserDetailsModal user={user} />)}
                          className="px-3 py-1 rounded-lg bg-accent/15 text-accent-bright text-xs font-medium hover:bg-accent/25"
                        >
                          View
                        </button>

                        <button
                          onClick={() =>
                            statusMutation.mutate({
                              userId: user._id,
                              status: user.status === "active" ? "suspended" : "active",
                            })
                          }
                          disabled={isSelf || statusMutation.isPending}
                          title={isSelf ? "You can't change your own account status" : undefined}
                          className="px-3 py-1 rounded-lg bg-warn/15 text-warn text-xs font-medium hover:bg-warn/25 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {user.status === "active" ? "Suspend" : "Reactivate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
