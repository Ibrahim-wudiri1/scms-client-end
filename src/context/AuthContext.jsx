import { createContext, useState, useEffect, useContext } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rememberedEmail, setRememberedEmail] = useState(
    localStorage.getItem("rememberedEmail") || ""
  );

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const login = async (email, password, rememberMe = false) => {
    const res = await axiosClient.post("/auth/login", { email, password });
    if (rememberMe) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("rememberedEmail", email);
      setRememberedEmail(email);
    } else {
      sessionStorage.setItem("token", res.data.token);
      localStorage.removeItem("rememberedEmail");
      setRememberedEmail("");
    }
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("rememberedEmail");
    setUser(null);
    window.location.href = "/";
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      axiosClient
        .get("/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, rememberedEmail }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
