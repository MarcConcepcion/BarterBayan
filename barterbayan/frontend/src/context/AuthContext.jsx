import { createContext, useContext, useState, useEffect } from "react";
import { apiGet } from "../utils/api";
 
const AuthContext = createContext(null);
 
export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
 
  // On first mount, verify session with PHP
  useEffect(() => {
    apiGet("/auth/check_session.php")
      .then(data => {
        if (data.success) setUser(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
 
  const login = (userData) => {
    setUser(userData);
  };
 
  const logout = () => {
    setUser(null);
  };
 
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
 
export function useAuth() {
  return useContext(AuthContext);
}
