"use client";

import { useState } from "react";

import SearchBar from "../common/search-bar";

import Pagination from "../common/pagination";

const users = [
  {
    id: 1,
    name: "John Doe",
    role: "Student",
    status: "Active",
  },

  {
    id: 2,
    name: "Sarah Smith",
    role: "Moderator",
    status: "Suspended",
  },

  {
    id: 3,
    name: "Michael Brown",
    role: "Student",
    status: "Active",
  },
];

export default function UsersTable() {
  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(1);

  const filteredUsers =
    users.filter((user) =>
      user.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

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
            Users
          </h2>

          <p className="text-gray-400 mt-1">
            Platform users
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
              text-left
              border-b
              border-white/10
            "
            >
              <th className="pb-4">
                Name
              </th>

              <th className="pb-4">
                Role
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
            {filteredUsers.map(
              (user) => (
                <tr
                  key={user.id}
                  className="
                  border-b
                  border-white/5
                "
                >
                  <td className="py-5">
                    {user.name}
                  </td>

                  <td className="py-5">
                    {user.role}
                  </td>

                  <td className="py-5">
                    <span
                      className={`
                    px-3
                    py-1
                    rounded-full
                    text-sm

                    ${
                      user.status ===
                      "Active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }
                  `}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="py-5">
                    <div className="flex gap-3">
                      <button
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
                        className="
                      bg-red-500/20
                      text-red-400
                      px-3
                      py-1
                      rounded-lg
                    "
                      >
                        Suspend
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
        totalPages={5}
        onPageChange={setPage}
      />
    </div>
  );
}
