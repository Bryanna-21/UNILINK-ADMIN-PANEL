interface Props {
  currentPage: number;

  totalPages: number;

  onPageChange: (
    page: number
  ) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <div className="flex gap-3 mt-6">
      {Array.from(
        { length: totalPages },
        (_, i) => (
          <button
            key={i}
            onClick={() =>
              onPageChange(i + 1)
            }
            className={`
            px-4
            py-2
            rounded-lg

            ${
              currentPage === i + 1
                ? "bg-violet-600"
                : "bg-white/10"
            }
          `}
          >
            {i + 1}
          </button>
        )
      )}
    </div>
  );
}
