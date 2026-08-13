interface Props {
  role: string;

  setRole: (
    role: string
  ) => void;
}

export default function AdvancedFilter({
  role,
  setRole,
}: Props) {
  return (
    <select
      value={role}
      onChange={(e) =>
        setRole(
          e.target.value
        )
      }
      className="
      glass
      px-4
      py-3
      rounded-xl
      outline-none
    "
    >
      <option value="">
        All Roles
      </option>

      <option value="admin">
        Admin
      </option>

      <option value="moderator">
        Moderator
      </option>

      <option value="student">
        Student
      </option>
    </select>
  );
}
