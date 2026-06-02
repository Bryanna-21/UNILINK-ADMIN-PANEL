import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
}) {
  const { admin, loading } = useAuth();

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!admin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
