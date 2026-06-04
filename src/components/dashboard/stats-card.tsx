interface Props {
  title: string;
  value: string;
  growth: string;
}

export default function StatsCard({
  title,
  value,
  growth,
}: Props) {
  return (
    <div className="card">
      <p className="text-gray-400 text-sm">
        {title}
      </p>

      <h2 className="text-4xl font-bold mt-3">
        {value}
      </h2>

      <p className="text-green-400 mt-3 text-sm">
        {growth}
      </p>
    </div>
  );
}
