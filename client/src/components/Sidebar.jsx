import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import { useCart } from "../state/CartContext"; // 🔹 Importa el contexto del carrito
import AdminModal from "../pages/Products";
import Variedades from "../images/Variedades.png";
import "./sidebar.css";

import {
  FaHome,
  FaPlus,
  FaClipboardList,
  FaBoxOpen,
  FaChartBar,
  FaShoppingCart,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

export default function Sidebar({ collapsed, setCollapsed }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart } = useCart(); // 🔹 Accedemos al carrito
  const navigate = useNavigate();

  // Función para obtener la cantidad total de productos
  const getCartCount = () => cart.reduce((total, item) => total + item.qty, 0);

  const handleProductAdded = () => {
    console.log("Producto agregado, refrescar lista si quieres");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* 🔹 Botón de colapsar */}
      <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
        <FaBars size={20} />
      </button>

      {/* 🔹 Contenido superior */}
      <div className="sidebar-content">
        {!collapsed && (
          <>
            <h2>Menú</h2>
            <img
              src={Variedades}
              alt="Variedades Los Hermanos"
              className="sidebar-logo"
            />
          </>
        )}

        <nav>
          <ul className="sidebar-list">
            <li>
              <Link to="/home" className="sidebar-link">
                <FaHome /> {!collapsed && "Home"}
              </Link>
            </li>

            {user?.role === "admin" && (
              <li>
                <button
                  style={{ background: "none", border: "none" }}
                  className="sidebar-link"
                  onClick={() => setModalOpen(true)}
                >
                  <FaPlus /> {!collapsed && "Producto"}
                </button>
              </li>
            )}

            {(user?.role === "admin" ||
              user?.role === "repartidor" ||
              user?.role === "usuario") && (
              <li>
                <Link to="/orders" className="sidebar-link">
                  <FaClipboardList /> {!collapsed && "Órdenes"}
                </Link>
              </li>
            )}

            {(user?.role === "admin" || user?.role === "repartidor") && (
              <li>
                <Link to="/order_items" className="sidebar-link">
                  <FaBoxOpen /> {!collapsed && "Detalle de Pedidos"}
                </Link>
              </li>
            )}

            {user?.role === "admin" && (
              <>
                <li>
                  <Link to="/general" className="sidebar-link">
                    <FaChartBar /> {!collapsed && "General"}
                  </Link>
                </li>
                <li>
                  <Link to="/ventas" className="sidebar-link">
                    <FaClipboardList /> {!collapsed && "Ventas"}
                  </Link>
                </li>
                <li>
                  <Link to="/estadisticas" className="sidebar-link">
                    <FaChartBar /> {!collapsed && "Estadísticas"}
                  </Link>
                </li>
              </>
            )}

            {/* 🔹 Carrito con contador */}
            <li className="cart-item">
              <Link to="/cart" className="sidebar-link cart-link">
                <div className="cart-icon-container">
                  <FaShoppingCart size={20} />
                  {getCartCount() > 0 && (
                    <span className="cart-badge">{getCartCount()}</span>
                  )}
                </div>
                {!collapsed}
              </Link>
            </li>

          </ul>
        </nav>
      </div>

      {/* 🔹 Botón de cerrar sesión */}
      <div className="sidebar-footer">
        <button className="btn btn-danger sidebar-link" onClick={handleLogout}>
          <FaSignOutAlt /> {!collapsed && "Cerrar Sesión"}
        </button>
      </div>

      {/* 🔹 Modal de productos */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onProductAdded={handleProductAdded}
      />
    </aside>
  );
}
