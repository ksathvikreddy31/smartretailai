import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  useEffect(() => {
    let isMounted = true;
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp * 1000 > Date.now()) {
          if (isMounted) setUser({ id: payload.id, email: payload.sub, role: payload.role });
        } else {
          logout();
        }
      } catch {
        logout();
      }
    } else {
      if (isMounted) setUser(null);
    }
    
    if (isMounted) setLoading(false);
    
    return () => {
      isMounted = false;
    };
  }, [token, logout]);

  const login = useCallback(async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { access_token, role, id } = res.data;
    
    localStorage.setItem("token", access_token);
    setToken(access_token);
    setUser({ id, email, role });
    
    // Using replace to avoid back-button logging them back out incorrectly
    navigate(`/${role}`, { replace: true });
    return res.data;
  }, [navigate]);

  const register = useCallback(async (email, password, role) => {
    const res = await api.post("/auth/register", { email, password, role });
    return res.data;
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    login,
    register,
    logout
  }), [user, token, loading, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}