interface Props {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: Props) {
  return (
    <div className="bg-danger/10 border border-danger/25 text-danger p-6 rounded-card flex items-center justify-between gap-4">
      <p>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="shrink-0 px-4 py-2 rounded-lg bg-danger/15 hover:bg-danger/25 text-sm font-medium"
        >
          Retry
        </button>
      )}
    </div>
  );
}
