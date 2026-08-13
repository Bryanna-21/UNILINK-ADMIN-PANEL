interface Props {
  report: {
    _id: string;
    type: string;
    message?: string;
    location?: string;
    status: "open" | "resolved" | "dismissed";
    priority: "low" | "medium" | "high";
    createdAt: string;
    userId?: { name?: string; email?: string } | string;
  };
  onSetStatus: (status: "open" | "resolved" | "dismissed") => void;
  isPending?: boolean;
}

export default function ReportCard({ report, onSetStatus, isPending }: Props) {
  const reporterName =
    typeof report.userId === "object" && report.userId?.name ? report.userId.name : "Unknown user";

  return (
    <div className="card p-6 status-edge" data-status={report.status === "high" ? "high" : report.status}>
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
          {report.status !== "resolved" && (
            <button
              onClick={() => onSetStatus("resolved")}
              disabled={isPending}
              className="px-4 py-2 rounded-lg bg-accent/15 text-accent-bright text-sm font-medium hover:bg-accent/25 disabled:opacity-50"
            >
              Resolve
            </button>
          )}

          {report.status !== "dismissed" && (
            <button
              onClick={() => onSetStatus("dismissed")}
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
