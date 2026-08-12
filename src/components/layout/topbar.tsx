"use client";

import { Bell, Search, ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import MobileSidebar from "./mobile-sidebar";

export default function Topbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 h-[76px] border-b border-slate-200 bg-white/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => setOpen(true)} className="lg:hidden h-10 w-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600">
            <Menu size={20} />
          </button>
          <div className="relative hidden sm:block w-[280px] lg:w-[380px]">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input aria-label="Global search" placeholder="Search users, universities, reports..." className="w-full h-10 rounded-xl bg-slate-100 pl-10 pr-4 text-sm text-slate-800 outline-none ring-0 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-100 border border-transparent focus:border-blue-200 transition" />
          </div>
          <div className="sm:hidden text-sm font-semibold text-slate-800">Admin Console</div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button aria-label="Notifications" className="relative h-10 w-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-200 transition">
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
          <button className="hidden sm:flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-1.5 hover:border-blue-200 transition">
            <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">AD</div>
            <div className="text-left">
              <div className="text-sm font-semibold text-slate-800 leading-4">Administrator</div>
              <div className="text-[11px] text-slate-500">Super Admin</div>
            </div>
            <ChevronDown size={15} className="text-slate-400" />
          </button>
        </div>
      </header>
      {open && <MobileSidebar onClose={() => setOpen(false)} />}
    </>
  );
}
