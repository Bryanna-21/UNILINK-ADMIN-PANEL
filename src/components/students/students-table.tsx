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

import {
  useSuspendStudent,
  useDeleteStudent,
} from "@/hooks/use-student-actions";

export default function StudentsTable() {
  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(1);

  const { openModal } =
    useModalStore();

  const {
    data,
    isLoading,
    error,
  } = useStudents(
    page,
    search
  );

  const suspendMutation =
    useSuspendStudent();

  const deleteMutation =
    useDeleteStudent();

  if (isLoading) {
    return (
      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-6
      "
      >
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState message="Failed to load students." />
    );
  }

  if (!data?.data?.length) {
    return (
      <EmptyState
        title="No Students"
        description="No student records found."
      />
    );
  }

  return (
    <div className="card">
      <div
        className="
        flex
        flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-4
        mb-6
      "
      >
        <div>
          <h2 className="text-2xl font-bold">
            Students
          </h2>

          <p className="text-gray-400 mt-1">
            Student management
            system.
          </p>
        </div>

        <div className="w-full lg:w-[300px]">
          <SearchBar
            value={search}
            onChange={setSearch}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr
              className="
              border-b
              border-white/10
              text-left
            "
            >
              <th className="pb-4">
                Name
              </th>

              <th className="pb-4">
                University
              </th>

              <th className="pb-4">
                Course
              </th>

              <th className="pb-4">
                Year
              </th>

              <th className="pb-4">
                Status
              </th>

              <th className="pb-4">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {data.data.map(
              (
                student: any
              ) => (
                <tr
                  key={student.id}
                  className="
                  border-b
                  border-white/5
                "
                >
                  <td className="py-5">
                    {student.name}
                  </td>

                  <td className="py-5">
                    {
                      student.university
                    }
                  </td>

                  <td className="py-5">
                    {student.course}
                  </td>

                  <td className="py-5">
                    Year{" "}
                    {student.year}
                  </td>

                  <td className="py-5">
                    <span
                      className={`
                    px-3
                    py-1
                    rounded-full
                    text-sm

                    ${
                      student.status ===
                      "Active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }
                  `}
                    >
                      {
                        student.status
                      }
                    </span>
                  </td>

                  <td className="py-5">
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          openModal(
                            <StudentDetailsModal
                              student={
                                student
                              }
                            />
                          )
                        }
                        className="
                        bg-blue-500/20
                        text-blue-400
                        px-3
                        py-1
                        rounded-lg
                      "
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          suspendMutation.mutate(
                            student.id
                          )
                        }
                        className="
                        bg-yellow-500/20
                        text-yellow-400
                        px-3
                        py-1
                        rounded-lg
                      "
                      >
                        Suspend
                      </button>

                      <button
                        onClick={() =>
                          deleteMutation.mutate(
                            student.id
                          )
                        }
                        className="
                        bg-red-500/20
                        text-red-400
                        px-3
                        py-1
                        rounded-lg
                      "
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={
          data.totalPages || 1
        }
        onPageChange={setPage}
      />
    </div>
  );
}
