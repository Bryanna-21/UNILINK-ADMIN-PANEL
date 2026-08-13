"use client";

import { X } from "lucide-react";

import { useModalStore } from "@/store/modal.store";

export default function GlobalModal() {
  const { open, content, closeModal } = useModalStore();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-6"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="card w-full max-w-[600px] p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          aria-label="Close dialog"
          className="absolute top-4 right-4 text-ink-muted hover:text-ink"
        >
          <X size={22} />
        </button>

        {content}
      </div>
    </div>
  );
}
