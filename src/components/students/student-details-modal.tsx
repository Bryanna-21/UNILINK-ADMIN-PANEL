interface Props {
  student: {
    name: string;
    email: string;
    status: string;
    universityId?: string;
    createdAt: string;
    role?: string;
  };
}

export default function StudentDetailsModal({ student }: Props) {
  const fields: { label: string; value: string }[] = [
    { label: "Name", value: student.name },
    { label: "Email", value: student.email },
    { label: "University ID", value: student.universityId || "Not set" },
    { label: "Registered", value: new Date(student.createdAt).toLocaleDateString() },
    { label: "Status", value: student.status },
  ];

  return (
    <div>
      <h2 className="text-2xl font-display font-semibold text-ink mb-6">Student Profile</h2>

      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.label}>
            <p className="text-ink-muted text-xs uppercase tracking-wide">{field.label}</p>
            <p className="text-ink text-lg mt-0.5 capitalize">{field.value}</p>
          </div>
        ))}
      </div>

      <p className="text-ink-muted text-xs mt-6 pt-4 border-t border-border">
        Course enrollment and academic year aren&apos;t shown here yet — the platform
        doesn&apos;t currently link enrollment records to the admin API. See project notes.
      </p>
    </div>
  );
}
