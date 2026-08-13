"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

import Sidebar from "./sidebar";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden bg-surface-raised p-3 rounded-xl text-ink"
        aria-label="Open navigation menu"
      >
        <Menu size={20} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setOpen(false)}>
          <div
            className="w-[260px] h-screen bg-surface p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-4">
              <button onClick={() => setOpen(false)} aria-label="Close navigation menu" className="text-ink">
                <X size={24} />
              </button>
            </div>

            <Sidebar />
          </div>
        </div>
      )}
    </>
  );
}
