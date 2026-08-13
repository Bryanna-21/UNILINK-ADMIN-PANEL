interface Props {
  action: string;
  admin: string;
  target: string;
  time: string;
  result: "success" | "failure";
}

// Formats machine-readable action strings like "suspend_user" into
// "Suspend user" without needing a giant lookup table for every
// possible action — new admin actions added later still render
// sensibly without a matching UI update.
function humanizeAction(action: string) {
  return action.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

export default function AuditLogCard({ action, admin, target, time, result }: Props) {
  return (
    <div className="card p-5 status-edge" data-status={result === "success" ? "resolved" : "high"}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-medium text-ink">{humanizeAction(action)}</h3>
          <p className="text-ink-muted text-sm mt-1">
            By {admin} · Target: <span className="font-mono text-xs">{target}</span>
          </p>
        </div>
        <p className="text-xs text-ink-muted shrink-0">{time}</p>
      </div>
    </div>
  );
}
