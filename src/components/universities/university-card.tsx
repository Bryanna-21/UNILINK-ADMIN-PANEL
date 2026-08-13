interface Props {
  university: {
    _id: string;
    name: string;
    country?: string;
    studentCount: number;
    verified: boolean;
    createdAt: string;
  };
  onVerify: () => void;
  isPending?: boolean;
}

export default function UniversityCard({ university, onVerify, isPending }: Props) {
  return (
    <div className="card p-6 status-edge" data-status={university.verified ? "verified" : "pending"}>
      <h2 className="text-lg font-display font-semibold text-ink">{university.name}</h2>
      {university.country && <p className="text-ink-muted text-xs mt-0.5">{university.country}</p>}

      <p className="text-ink-muted mt-3 text-sm">
        {university.studentCount.toLocaleString()} student{university.studentCount === 1 ? "" : "s"}
      </p>

      <p className="text-ink-muted text-xs mt-1">
        Onboarded {new Date(university.createdAt).toLocaleDateString()}
      </p>

      <div className="mt-5">
        {university.verified ? (
          <span className="inline-block bg-accent/15 text-accent-bright px-4 py-2 rounded-lg text-sm font-medium">
            Verified
          </span>
        ) : (
          <button
            onClick={onVerify}
            disabled={isPending}
            className="btn-primary text-sm disabled:opacity-50"
          >
            {isPending ? "Verifying..." : "Verify"}
          </button>
        )}
      </div>
    </div>
  );
}
