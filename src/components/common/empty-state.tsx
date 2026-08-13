interface Props {
  title: string;
  description: string;
}

export default function EmptyState({ title, description }: Props) {
  return (
    <div className="card text-center py-16 px-6">
      <h2 className="text-xl font-display font-semibold text-ink">{title}</h2>
      <p className="text-ink-muted mt-2 text-sm">{description}</p>
    </div>
  );
}
