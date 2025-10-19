import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return { email: payload.email, role: payload.role };
      } catch (err) {
        console.error("Error restaurando usuario:", err);
        localStorage.removeItem("token");
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  const login = (userData, jwt) => {
    setUser({ email: userData.email, role: userData.role });
    setToken(jwt);
    localStorage.setItem("token", jwt);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
