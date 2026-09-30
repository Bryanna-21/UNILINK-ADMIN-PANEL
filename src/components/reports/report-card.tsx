interface Props {
  report: {
    _id: string;
    type: string;
    message?: string;
    location?: string;
    status: "OPEN" | "ACKNOWLEDGED" | "RESPONDING" | "ESCALATED" | "RESOLVED" | "DISMISSED";
    priority: "low" | "medium" | "high";
    createdAt: string;
    userId?: { name?: string; email?: string } | string;
  };
  onSetStatus: (status: "RESOLVED" | "DISMISSED") => void;
  isPending?: boolean;
}

export default function ReportCard({ report, onSetStatus, isPending }: Props) {
  const reporterName =
    typeof report.userId === "object" && report.userId?.name ? report.userId.name : "Unknown user";

  // globals.css' .status-edge[data-status="..."] selectors are lowercase
  // (open/resolved/etc, same convention as the other status-edge users
  // on this dashboard - university/lecturer status). Lowercasing only
  // for this attribute keeps the real, uppercase EmergencyReport enum
  // value everywhere else (comparisons below, the API call).
  const statusEdgeValue = report.priority === "high" ? "high" : report.status.toLowerCase();

  return (
    <div className="card p-6 status-edge" data-status={statusEdgeValue}>
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-display font-semibold text-ink capitalize">{report.type} report</h2>
            <span
              className="status-edge px-2.5 py-0.5 rounded-full bg-surface-raised text-xs capitalize"
              data-status={report.priority}
            >
              {report.priority} priority
            </span>
          </div>

          <p className="text-ink-muted mt-2 text-sm">Reported by {reporterName}</p>
          {report.location && <p className="text-ink-muted text-sm">Location: {report.location}</p>}
          {report.message && <p className="text-ink mt-3 text-sm">{report.message}</p>}

          <p className="text-ink-muted text-xs mt-3">{new Date(report.createdAt).toLocaleString()}</p>
        </div>

        <div className="flex gap-2 shrink-0">
          {report.status !== "RESOLVED" && (
            <button
              onClick={() => onSetStatus("RESOLVED")}
              disabled={isPending}
              className="px-4 py-2 rounded-lg bg-accent/15 text-accent-bright text-sm font-medium hover:bg-accent/25 disabled:opacity-50"
            >
              Resolve
            </button>
          )}

          {report.status !== "DISMISSED" && (
            <button
              onClick={() => onSetStatus("DISMISSED")}
              disabled={isPending}
              className="px-4 py-2 rounded-lg bg-surface-raised text-ink-muted text-sm font-medium hover:text-ink disabled:opacity-50"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
