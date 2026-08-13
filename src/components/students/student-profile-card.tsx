interface Props {
  student: {
    name: string;
    email: string;
    status: string;
    universityId?: string;
    createdAt: string;
  };
}

export default function StudentProfileCard({ student }: Props) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-2xl font-semibold text-white">
          {student.name.charAt(0).toUpperCase()}
        </div>

        <div>
          <h2 className="text-xl font-display font-semibold text-ink">{student.name}</h2>
          <p className="text-ink-muted text-sm">{student.email}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-ink-muted">University ID</span>
          <span className="text-ink">{student.universityId || "Not set"}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-ink-muted">Registered</span>
          <span className="text-ink">{new Date(student.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-ink-muted">Status</span>
          <span
            className="status-edge px-3 py-1 rounded-full bg-surface-raised text-xs capitalize"
            data-status={student.status}
          >
            {student.status}
          </span>
        </div>
      </div>
    </div>
  );
}
