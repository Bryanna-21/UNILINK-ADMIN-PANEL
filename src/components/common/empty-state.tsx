interface Props {
  title: string;

  description: string;
}

export default function EmptyState({
  title,
  description,
}: Props) {
  return (
    <div
      className="
      card
      text-center
      py-20
    "
    >
      <h2 className="text-3xl font-bold">
        {title}
      </h2>

      <p className="text-gray-400 mt-3">
        {description}
      </p>
    </div>
  );
}
