"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, hydrated } = useAuthStore();

  useEffect(() => {
    if (!hydrated) return;
    if (!token || !user) {
      const next = encodeURIComponent(pathname || "/dashboard");
      router.replace(`/login?next=${next}`);
      return;
    }
    if (user.role !== "admin" && user.role !== "superadmin") {
      router.replace("/unauthorized");
    }
  }, [hydrated, token, user, pathname, router]);

  if (!hydrated || !token || !user || (user.role !== "admin" && user.role !== "superadmin")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  return children;
}
