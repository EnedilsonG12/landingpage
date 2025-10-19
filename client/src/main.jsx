import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";

import { CartProvider } from "./state/CartContext";
import { AuthProvider, useAuth } from "./state/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import LoginWrapper from "./pages/LoginWrapper";
import Order_Items from "./pages/Order_Items";
import Orders from "./pages/Orders";
import General from "./pages/General";
import Ventas from "./pages/Ventas";
import Estadisticas from "./pages/Estadisticas";

import SeasonalBackground from "./components/SeasonalBackground";

// 🟢 Layout con Sidebar colapsable y contenido adaptable
function Layout({ children }) {
  const location = useLocation();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/";

  return (
    <div style={{ display: "flex", minHeight: "100vh", position: "relative" }}>
      {/* 🔹 Fondo animado */}
      <SeasonalBackground
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />

      {/* 🔹 Sidebar */}
      {!hideLayout && (
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      )}

      {/* 🔹 Contenedor principal */}
      <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
        {!hideLayout && user && <Navbar />}

        <main
          style={{
            flex: 1,
            padding: "80px 20px 20px",
            marginLeft: hideLayout ? 0 : collapsed ? "80px" : "220px",
            transition: "margin-left 0.3s ease",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/login" element={<LoginWrapper />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<LoginWrapper />} />

              {/* Rutas privadas generales */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/success"
                element={
                  <ProtectedRoute>
                    <Success />
                  </ProtectedRoute>
                }
              />

              {/* Rutas privadas por rol */}
              <Route
                path="/products"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <Products />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute roles={["admin", "repartidor", "usuario"]}>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order_items"
                element={
                  <ProtectedRoute roles={["admin", "repartidor"]}>
                    <Order_Items />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/general"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <General />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ventas"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <Ventas />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/estadisticas"
                element={
                  <ProtectedRoute roles={["admin"]}>
                    <Estadisticas />
                  </ProtectedRoute>
                }
              />

              {/* Sin permisos */}
              <Route path="/unauthorized" element={<h1>No tienes permisos</h1>} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
