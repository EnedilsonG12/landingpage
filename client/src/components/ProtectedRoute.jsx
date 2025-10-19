import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, token } = useAuth();

  // 🚫 Si no hay sesión activa
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Si se especifican roles y el usuario no tiene permiso
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
