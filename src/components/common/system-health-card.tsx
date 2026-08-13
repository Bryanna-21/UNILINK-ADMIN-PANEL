interface Props {
  title: string;
  value: string;
  status: "healthy" | "degraded" | "offline";
}

export default function SystemHealthCard({ title, value, status }: Props) {
  return (
    <div className="card p-6 status-edge" data-status={status}>
      <h3 className="text-sm font-medium text-ink-muted">{title}</h3>
      <p className="text-2xl font-display font-semibold text-ink mt-3 capitalize">{value}</p>
      <p
        className={`mt-3 text-sm font-medium capitalize ${
          status === "healthy" ? "text-accent-bright" : status === "degraded" ? "text-warn" : "text-danger"
        }`}
      >
        {status}
      </p>
    </div>
  );
}
