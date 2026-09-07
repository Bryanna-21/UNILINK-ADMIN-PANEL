"use client";

import { useState } from "react";
import { X, Eye } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

interface ViewAsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewAsModal({ isOpen, onClose }: ViewAsModalProps) {
  const { startViewAs, endViewAs, viewAs } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<"student" | "lecturer" | null>(null);

  if (!isOpen) return null;

  const handleStartViewAs = (role: "student" | "lecturer") => {
    startViewAs(role);
    onClose();
  };

  const handleEndViewAs = () => {
    endViewAs();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-card p-6 w-full max-w-md border border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Eye size={20} className="text-accent" />
            <h2 className="text-xl font-display font-semibold text-ink">View As</h2>
          </div>
          <button
            onClick={onClose}
            className="text-ink-muted hover:text-ink transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {viewAs ? (
          <div className="space-y-4">
            <div className="bg-success/10 border border-success/25 rounded-lg p-4">
              <p className="text-sm text-ink-muted mb-1">Currently viewing as</p>
              <p className="text-lg font-semibold text-ink capitalize">{viewAs.asRole}</p>
              <p className="text-xs text-ink-muted mt-2">
                Started {Math.round((Date.now() - viewAs.startTime) / 1000)}s ago
              </p>
            </div>

            <p className="text-sm text-ink-muted">
              You're currently in "{viewAs.asRole}" perspective. You can view the platform as this
              role would see it, without affecting any actual data.
            </p>

            <button onClick={handleEndViewAs} className="btn-primary w-full">
              Return to Admin View
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-ink-muted mb-4">
              Choose a role to view the platform from their perspective. Your admin session
              remains active.
            </p>

            <button
              onClick={() => handleStartViewAs("student")}
              className="w-full text-left p-4 rounded-lg border border-border hover:bg-surface-raised transition"
            >
              <p className="font-medium text-ink">View as Student</p>
              <p className="text-xs text-ink-muted mt-1">
                See the platform from a student's perspective
              </p>
            </button>

            <button
              onClick={() => handleStartViewAs("lecturer")}
              className="w-full text-left p-4 rounded-lg border border-border hover:bg-surface-raised transition"
            >
              <p className="font-medium text-ink">View as Lecturer</p>
              <p className="text-xs text-ink-muted mt-1">
                See the platform from a lecturer's perspective
              </p>
            </button>

            <button
              onClick={onClose}
              className="w-full mt-4 text-ink-muted hover:text-ink transition text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
