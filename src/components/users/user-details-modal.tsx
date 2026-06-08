interface Props {
  user: {
    name: string;

    email: string;

    role: string;

    status: string;
  };
}

export default function UserDetailsModal({
  user,
}: Props) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">
        User Details
      </h2>

      <div className="space-y-4">
        <div>
          <p className="text-gray-400">
            Name
          </p>

          <h4 className="text-xl">
            {user.name}
          </h4>
        </div>

        <div>
          <p className="text-gray-400">
            Email
          </p>

          <h4 className="text-xl">
            {user.email}
          </h4>
        </div>

        <div>
          <p className="text-gray-400">
            Role
          </p>

          <h4 className="text-xl">
            {user.role}
          </h4>
        </div>

        <div>
          <p className="text-gray-400">
            Status
          </p>

          <h4 className="text-xl">
            {user.status}
          </h4>
        </div>
      </div>
    </div>
  );
}
