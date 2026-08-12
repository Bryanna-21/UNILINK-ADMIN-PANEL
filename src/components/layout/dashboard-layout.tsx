"use client";

import Sidebar from "./sidebar";
import Topbar from "./topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-shell">
      <Sidebar />
      <main className="lg:ml-[264px] min-h-screen">
        <Topbar />
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
