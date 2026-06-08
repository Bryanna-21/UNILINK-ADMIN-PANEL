interface Props {
  title: string;

  value: string;

  status: string;
}

export default function SystemHealthCard({
  title,
  value,
  status,
}: Props) {
  return (
    <div className="card">
      <h3 className="text-xl font-bold">
        {title}
      </h3>

      <h2 className="text-4xl font-bold mt-4">
        {value}
      </h2>

      <p
        className={`
        mt-3

        ${
          status === "Healthy"
            ? "text-green-400"
            : "text-red-400"
        }
      `}
      >
        {status}
      </p>
    </div>
  );
}
