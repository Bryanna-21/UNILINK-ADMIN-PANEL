interface Props {
  title: string;
  value: string | number;
  growth?: string;
}

export default function StatsCard({ title, value, growth }: Props) {
  return (
    <div className="card p-6">
      <p className="text-ink-muted text-sm">{title}</p>
      <h2 className="text-3xl font-display font-semibold text-ink mt-3">{value}</h2>
      {growth && <p className="text-accent-bright mt-3 text-sm">{growth}</p>}
    </div>
  );
}
