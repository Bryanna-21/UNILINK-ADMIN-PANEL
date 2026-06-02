import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {

  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">

      <div>
        Welcome, {admin?.name}
      </div>

      <button onClick={handleLogout}>
        Logout
      </button>

    </header>
  );
}
