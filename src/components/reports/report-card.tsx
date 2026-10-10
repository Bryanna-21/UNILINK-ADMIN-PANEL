"use client";

import { useState } from "react";

import { useAcknowledgeReport, useRespondToReport } from "@/hooks/use-reports";

interface Props {
  report: {
    _id: string;
    type: string;
    message?: string;
    location?: string;
    coordinates?: { latitude?: number | null; longitude?: number | null };
    status: "OPEN" | "ACKNOWLEDGED" | "RESPONDING" | "ESCALATED" | "RESOLVED" | "DISMISSED";
    priority: "low" | "medium" | "high";
    createdAt: string;
    userId?: { name?: string; email?: string } | string;
  };
  onSetStatus: (status: "RESOLVED" | "DISMISSED") => void;
  isPending?: boolean;
}

export default function ReportCard({ report, onSetStatus, isPending }: Props) {
  // Acknowledge and respond are handled here, so the reports page itself needs no change.
  const acknowledge = useAcknowledgeReport();
  const respond = useRespondToReport();
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");

  const reporterName =
    typeof report.userId === "object" && report.userId?.name ? report.userId.name : "Unknown user";

  // globals.css' .status-edge[data-status="..."] selectors are lowercase
  // (open/resolved/etc, same convention as the other status-edge users
  // on this dashboard - university/lecturer status). Lowercasing only
  // for this attribute keeps the real, uppercase EmergencyReport enum
  // value everywhere else (comparisons below, the API call).
  const statusEdgeValue = report.priority === "high" ? "high" : report.status.toLowerCase();

  const isSos = report.type === "sos";
  const isClosed = report.status === "RESOLVED" || report.status === "DISMISSED";
  const lat = report.coordinates?.latitude;
  const lng = report.coordinates?.longitude;
  const busy = isPending || acknowledge.isPending || respond.isPending;
  const actionError =
    (acknowledge.error as any)?.response?.data?.message || (respond.error as any)?.response?.data?.message;

  return (
    <div className="card p-6 status-edge" data-status={statusEdgeValue}>
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className={`text-lg font-display font-semibold capitalize ${isSos ? "text-danger" : "text-ink"}`}>
              {isSos ? "SOS alert" : `${report.type} report`}
            </h2>
            <span
              className="status-edge px-2.5 py-0.5 rounded-full bg-surface-raised text-xs capitalize"
              data-status={report.priority}
            >
              {report.priority} priority
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-raised text-xs capitalize text-ink-muted">
              {report.status.toLowerCase()}
            </span>
          </div>

          <p className="text-ink-muted mt-2 text-sm">Reported by {reporterName}</p>
          {report.location && <p className="text-ink-muted text-sm">Location: {report.location}</p>}
          {typeof lat === "number" && typeof lng === "number" && (
            <a
              href={`https://www.google.com/maps?q=${lat},${lng}`}
              target="_blank"
              rel="noreferrer"
              className="text-accent text-sm underline"
            >
              Open GPS point
            </a>
          )}
          {report.message && <p className="text-ink mt-3 text-sm">{report.message}</p>}

          <p className="text-ink-muted text-xs mt-3">{new Date(report.createdAt).toLocaleString()}</p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          {report.status === "OPEN" && (
            <button
              onClick={() => acknowledge.mutate(report._id)}
              disabled={busy}
              className="px-4 py-2 rounded-lg bg-surface-raised text-ink text-sm font-medium hover:text-accent disabled:opacity-50"
            >
              Acknowledge
            </button>
          )}

          {!isClosed && (
            <button
              onClick={() => setShowNote((v) => !v)}
              disabled={busy}
              className="px-4 py-2 rounded-lg bg-surface-raised text-ink text-sm font-medium hover:text-accent disabled:opacity-50"
            >
              Respond
            </button>
          )}

          {report.status !== "RESOLVED" && (
            <button
              onClick={() => onSetStatus("RESOLVED")}
              disabled={busy}
              className="px-4 py-2 rounded-lg bg-accent/15 text-accent-bright text-sm font-medium hover:bg-accent/25 disabled:opacity-50"
            >
              Resolve
            </button>
          )}

          {report.status !== "DISMISSED" && (
            <button
              onClick={() => onSetStatus("DISMISSED")}
              disabled={busy}
              className="px-4 py-2 rounded-lg bg-surface-raised text-ink-muted text-sm font-medium hover:text-ink disabled:opacity-50"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>

      {showNote && !isClosed && (
        <div className="mt-4 space-y-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="input-field"
            rows={3}
            placeholder="What is being done? This is recorded on the report."
          />
          <div className="flex gap-2">
            <button
              onClick={() =>
                respond.mutate(
                  { reportId: report._id, note: note.trim() },
                  {
                    onSuccess: () => {
                      setNote("");
                      setShowNote(false);
                    },
                  }
                )
              }
              disabled={busy || !note.trim()}
              className="btn-primary disabled:opacity-50"
            >
              Send response
            </button>
            <button onClick={() => setShowNote(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}

      {actionError && <p className="text-sm text-danger mt-3">{actionError}</p>}
    </div>
  );
}
