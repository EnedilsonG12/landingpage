import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import "../styles/products.css";

function RegistroModal({ isOpen, onClose, onProductAdded }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [newRole, setNewRole] = useState(""); // Para agregar rol nuevo
  const [roles, setRoles] = useState([]); // Roles existentes desde users

  // 🔹 Cargar roles únicos de la tabla users
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`);
        const data = await res.json();

        // Extraer roles únicos y ordenarlos alfabéticamente
        const rolesUnicos = [...new Set(data.map((user) => user.role))].sort();
        setRoles(rolesUnicos);
      } catch (err) {
        console.error("Error al obtener roles:", err);
      }
    };
    fetchRoles();
  }, []);

  // 🔹 Cerrar modal con ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rolFinal = role === "__nuevo" ? newRole : role;

    if (!username || !email || !password || !rolFinal) {
      Swal.fire({
        icon: "warning",
        title: "Atención",
        text: "Todos los campos son requeridos ⚠️❌",
        background: "#1e1e1e",
        color: "#ffcc00",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          email,
          password,
          role: rolFinal,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Usuario agregado correctamente ✅",
          showConfirmButton: false,
          timer: 2000,
          background: "#1e1e1e",
          color: "#0cff7c",
        });

        // Limpiar campos
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("");
        setNewRole("");

        if (onProductAdded) onProductAdded();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "Error al guardar usuario ❌",
          background: "#1e1e1e",
          color: "#ff4d4d",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al conectarse al servidor ❌",
        background: "#1e1e1e",
        color: "#ff4d4d",
      });
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal-box" onMouseDown={(e) => e.stopPropagation()}>

        <h2>Agregar Usuario</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <input
            type="text"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Select de roles */}
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Seleccione Rol de Usuario</option>
            {roles.map((rol) => (
              <option key={rol} value={rol}>{rol}</option>
            ))}
            <option value="__nuevo">Agregar nuevo rol</option>
          </select>

          {/* Input para nuevo rol */}
          {role === "__nuevo" && (
            <input
              type="text"
              placeholder="Ingrese nuevo rol"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            />
          )}

          <button type="submit">Guardar</button>
          <button onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default RegistroModal;
