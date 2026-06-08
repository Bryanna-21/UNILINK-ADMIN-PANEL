"use client";

import { ReactNode } from "react";

import { useAuthStore } from "@/store/auth.store";

interface Props {
  allowedRoles: string[];

  children: ReactNode;
}

export default function PermissionGuard({
  allowedRoles,
  children,
}: Props) {
  const user = useAuthStore(
    (state) => state.user
  );

  if (!user) return null;

  if (
    !allowedRoles.includes(
      user.role
    )
  ) {
    return (
      <div className="card">
        <h2 className="text-2xl font-bold">
          Access Denied
        </h2>

        <p className="text-gray-400 mt-2">
          You do not have permission
          to access this resource.
        </p>
      </div>
    );
  }

  return children;
}
