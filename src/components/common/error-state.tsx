interface Props {
  message: string;
}

export default function ErrorState({
  message,
}: Props) {
  return (
    <div
      className="
      bg-red-500/10
      border
      border-red-500/20
      text-red-400
      p-6
      rounded-2xl
    "
    >
      {message}
    </div>
  );
}
