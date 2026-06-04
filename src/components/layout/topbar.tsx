"use client";

import { Search, Bell } from "lucide-react";

export default function Topbar() {
  return (
    <header className="glass h-[80px] rounded-2xl px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 bg-white/5 px-4 py-3 rounded-xl w-[350px]">
        <Search size={18} />

        <input
          placeholder="Search..."
          className="bg-transparent outline-none w-full"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="glass p-3 rounded-xl">
          <Bell size={18} />
        </button>

        <div className="flex items-center gap-3 glass px-4 py-2 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center">
            A
          </div>

          <div>
            <h4 className="font-semibold">
              Admin
            </h4>

            <p className="text-xs text-gray-400">
              Super Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
