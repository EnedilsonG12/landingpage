import React from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../state/AuthContext";

function UserModal({ isOpen, onClose, onOpenRegistro }) {
  const { user } = useAuth();

  if (!isOpen) return null;

  if (!user) {
    return createPortal(
      <div className="modal-overlay" onMouseDown={onClose}>
        <div className="modal-box" onMouseDown={(e) => e.stopPropagation()}>
          <p>Cargando información...</p>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal-box" style={{color: "#fff"}} onMouseDown={(e) => e.stopPropagation()}>
        <button className="btn-close" onClick={onClose}>X</button>
        <h2>Información del Usuario</h2>

        <p><strong>Nombre:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rol:</strong> {user.role}</p>

        <hr />
        {user.role === "admin" && (
          <button onClick={onOpenRegistro}>Registrar nuevo usuario</button>
        )}
      </div>
    </div>,
    document.body
  );
}

export default UserModal;
