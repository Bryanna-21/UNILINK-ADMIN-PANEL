"use client";

import Link from "next/link";
import { ShieldOff } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

export default function UnauthorizedPage() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-6">
      <div className="card max-w-md w-full p-8 text-center">
        <ShieldOff className="mx-auto mb-4 text-danger" size={40} />

        <h1 className="text-2xl font-display font-semibold text-ink">
          This account can&apos;t access the admin panel
        </h1>

        <p className="text-ink-muted mt-3">
          Your UniLink account is signed in, but it doesn&apos;t have
          administrator access. If you believe this is a mistake, contact
          your university&apos;s UniLink administrator.
        </p>

        <button
          onClick={() => {
            logout();
            window.location.href = "/login";
          }}
          className="btn-primary mt-6 w-full"
        >
          Sign out
        </button>

        <Link
          href="/login"
          className="block mt-3 text-sm text-ink-muted hover:text-ink"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
