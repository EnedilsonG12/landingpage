import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import UserModal from "./UserModal";
import Usuarios from "./Usuarios";
import { useAuth } from "../state/AuthContext";
import "./navbar.css";


function Navbar() {
  const { user } = useAuth(); // usuario logueado real desde contexto
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isUsuariosModalOpen, setIsUsuariosModalOpen] = useState(false);

  return (
    <nav className="navbar">
      <h1 data-text="Tienda Online">Tienda Online</h1>
      <div
        className="user-icon"
        onClick={() => user && setIsUserModalOpen(true)}
        title={user ? user.username : "Sin usuario"}
      >
        <FaUserCircle size={60} />
      </div>

      {/* Modal de información del usuario */}
      {isUserModalOpen && (
        <UserModal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
          onOpenRegistro={() => setIsUsuariosModalOpen(true)}
        />
      )}

      {/* Modal de registro de nuevo usuario */}
      {isUsuariosModalOpen && (
        <Usuarios
          isOpen={isUsuariosModalOpen}
          onClose={() => setIsUsuariosModalOpen(false)}
          onProductAdded={() => alert("Usuario agregado!")}
        />
      )}
    </nav>
  );
}

export default Navbar;
