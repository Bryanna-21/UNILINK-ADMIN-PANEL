interface Props {
  user: {
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
  };
}

export default function UserDetailsModal({ user }: Props) {
  const fields = [
    { label: "Name", value: user.name },
    { label: "Email", value: user.email },
    { label: "Role", value: user.role },
    { label: "Registered", value: new Date(user.createdAt).toLocaleDateString() },
    { label: "Status", value: user.status },
  ];

  return (
    <div>
      <h2 className="text-2xl font-display font-semibold text-ink mb-6">User Details</h2>

      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.label}>
            <p className="text-ink-muted text-xs uppercase tracking-wide">{field.label}</p>
            <p className="text-ink text-lg mt-0.5 capitalize">{field.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
