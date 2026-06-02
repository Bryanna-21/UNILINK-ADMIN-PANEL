import { useAuth } from "../context/AuthContext";

export default function RoleGuard({
  allowedRoles,
  children,
}) {
  const { admin } = useAuth();

  if (!admin) {
    return null;
  }

  if (
    !allowedRoles.includes(admin.role)
  ) {
    return (
      <div>
        <h2>Access Denied</h2>
      </div>
    );
  }

  return children;
}
