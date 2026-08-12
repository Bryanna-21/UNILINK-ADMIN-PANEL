"use client";

import { X } from "lucide-react";
import Sidebar from "./sidebar";

export default function MobileSidebar({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button aria-label="Close menu" onClick={onClose} className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
      <div className="relative w-[280px] h-full shadow-2xl">
        <button onClick={onClose} aria-label="Close navigation" className="absolute right-3 top-4 z-10 h-9 w-9 rounded-lg bg-white/10 text-white flex items-center justify-center">
          <X size={18} />
        </button>
        <Sidebar mobile />
      </div>
    </div>
  );
}
