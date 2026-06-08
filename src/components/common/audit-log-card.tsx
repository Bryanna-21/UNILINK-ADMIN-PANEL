interface Props {
  action: string;

  admin: string;

  time: string;
}

export default function AuditLogCard({
  action,
  admin,
  time,
}: Props) {
  return (
    <div className="card">
      <h3 className="text-xl font-bold">
        {action}
      </h3>

      <p className="text-gray-400 mt-2">
        By {admin}
      </p>

      <p className="text-sm text-gray-500 mt-1">
        {time}
      </p>
    </div>
  );
}
