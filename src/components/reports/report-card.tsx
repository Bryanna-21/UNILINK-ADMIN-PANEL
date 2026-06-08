interface Props {
  report: {
    id: string;

    reason: string;

    reportedBy: string;

    status: string;
  };

  onResolve: () => void;

  onDelete: () => void;
}

export default function ReportCard({
  report,
  onResolve,
  onDelete,
}: Props) {
  return (
    <div className="card">
      <div
        className="
        flex
        flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-4
      "
      >
        <div>
          <h2 className="text-2xl font-bold">
            {report.reason}
          </h2>

          <p className="text-gray-400 mt-2">
            Reported by{" "}
            {report.reportedBy}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onResolve}
            className="
            bg-green-500/20
            text-green-400
            px-4
            py-2
            rounded-lg
          "
          >
            Resolve
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
    </div>
  );
}
