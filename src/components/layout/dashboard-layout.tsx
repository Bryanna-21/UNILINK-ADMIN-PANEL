"use client";

import Sidebar from "./sidebar";
import Topbar from "./topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />

      <main className="ml-[270px] w-full p-6">
        <Topbar />

        <div className="mt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
