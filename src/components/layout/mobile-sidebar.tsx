"use client";

import { useState } from "react";

import {
  Menu,
  X,
} from "lucide-react";

import Sidebar from "./sidebar";

export default function MobileSidebar() {
  const [open, setOpen] =
    useState(false);

  return (
    <>
      <button
        onClick={() =>
          setOpen(true)
        }
        className="
        lg:hidden
        glass
        p-3
        rounded-xl
      "
      >
        <Menu size={20} />
      </button>

      {open && (
        <div
          className="
          fixed
          inset-0
          z-50
          bg-black/60
        "
        >
          <div
            className="
            w-[270px]
            h-screen
            bg-[#050816]
            p-4
          "
          >
            <div className="flex justify-end mb-4">
              <button
                onClick={() =>
                  setOpen(false)
                }
              >
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
