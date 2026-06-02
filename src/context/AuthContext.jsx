import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedAdmin = localStorage.getItem("admin");

    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin));
    }

    setLoading(false);
  }, []);

  const login = (adminData, token) => {
    localStorage.setItem(
      "admin",
      JSON.stringify(adminData)
    );

    localStorage.setItem(
      "adminToken",
      token
    );

    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");

    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
