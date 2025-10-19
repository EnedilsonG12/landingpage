import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // guarda datos del usuario
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Restaurar usuario si hay token guardado
  useEffect(() => {
    if (token && !user) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ email: payload.email, role: payload.role }); // 🔹 guardar role también
      } catch (error) {
        console.error("Error restaurando usuario:", error);
        logout();
      }
    }
  }, [token]);

  const login = (userData, jwt) => {
    setUser({ email: userData.email, role: userData.role }); // 🔹 guardar role
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
