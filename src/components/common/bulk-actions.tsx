interface Props {
  selected: string[];

  onDelete: () => void;

  onSuspend: () => void;
}

export default function BulkActions({
  selected,
  onDelete,
  onSuspend,
}: Props) {
  if (!selected.length)
    return null;

  return (
    <div
      className="
      glass
      p-4
      rounded-2xl
      flex
      items-center
      justify-between
      mb-6
    "
    >
      <p>
        {selected.length} selected
      </p>

      <div className="flex gap-3">
        <button
          onClick={onSuspend}
          className="
          bg-yellow-500/20
          text-yellow-400
          px-4
          py-2
          rounded-lg
        "
        >
          Suspend
        </button>

        <button
          onClick={onDelete}
          className="
          bg-red-500/20
          text-red-400
          px-4
          py-2
          rounded-lg
        "
        >
          Delete
        </button>
      </div>
    </div>
  );
}
