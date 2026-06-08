"use client";

import { X } from "lucide-react";

import { useModalStore } from "@/store/modal.store";

export default function GlobalModal() {
  const {
    open,
    content,
    closeModal,
  } = useModalStore();

  if (!open) return null;

  return (
    <div
      className="
      fixed
      inset-0
      z-[100]
      bg-black/70
      flex
      items-center
      justify-center
      p-6
    "
    >
      <div
        className="
        glass
        w-full
        max-w-[600px]
        rounded-3xl
        p-6
        relative
      "
      >
        <button
          onClick={closeModal}
          className="
          absolute
          top-4
          right-4
        "
        >
          <X size={22} />
        </button>

        {content}
      </div>
    </div>
  );
}
