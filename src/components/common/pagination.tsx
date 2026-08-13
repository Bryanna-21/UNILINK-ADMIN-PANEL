interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  // Cap visible page buttons rather than rendering hundreds for large
  // datasets — shows a window around the current page.
  const windowSize = 5;
  const start = Math.max(1, currentPage - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize - 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="flex items-center gap-2" role="navigation" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-2 rounded-lg bg-surface-raised text-ink-muted disabled:opacity-40 hover:text-ink"
        aria-label="Previous page"
      >
        Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          aria-current={currentPage === page ? "page" : undefined}
          className={`px-4 py-2 rounded-lg text-sm ${
            currentPage === page ? "bg-accent text-white" : "bg-surface-raised text-ink-muted hover:text-ink"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-2 rounded-lg bg-surface-raised text-ink-muted disabled:opacity-40 hover:text-ink"
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
}
