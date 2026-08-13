"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";

// Next.js Edge Middleware cannot read localStorage (it runs server-side,
// before any browser JS executes) — that's a hard platform boundary,
// not something worked around here. This guard is the real route
// protection: it runs client-side, after the auth store has rehydrated
// from localStorage (see hooks/use-auth-init.ts).
//
// This is a UX/routing convenience, not the actual security boundary —
// the real boundary is requireRole("admin") on the backend
// (UNILINK-BACKEND src/middleware/role.middleware.js). Anyone could
// disable JS and hit the API directly; the backend is what stops them.
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, hydrated } = useAuthStore();

  useEffect(() => {
    // Wait for rehydration before making any redirect decision — acting
    // on the pre-hydration null state is exactly what causes a
    // legitimately logged-in admin to flash-redirect to /login on refresh.
    if (!hydrated) return;

    if (!token || !user) {
      const next = encodeURIComponent(pathname || "/dashboard");
      router.replace(`/login?next=${next}`);
      return;
    }

    if (user.role !== "admin") {
      router.replace("/unauthorized");
    }
  }, [hydrated, token, user, pathname, router]);

  // Nothing rendered until we're sure this is an authenticated admin —
  // this is what prevents a protected page's real content from
  // flashing on screen before the redirect fires.
  if (!hydrated || !token || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  return children;
}
