"use client";

import Sidebar from "./sidebar";
import MobileSidebar from "./mobile-sidebar";
import Topbar from "./topbar";
import AuthGuard from "@/components/auth/auth-guard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="lg:flex bg-bg min-h-screen">
        <div className="hidden lg:block fixed left-0 top-0 z-10">
          <Sidebar />
        </div>

        <main className="w-full lg:ml-[260px] p-4 lg:p-6">
          <div className="flex items-center gap-4 mb-4 lg:hidden">
            <MobileSidebar />
          </div>

          <Topbar />

          <div className="mt-6">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}
