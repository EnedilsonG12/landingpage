import React, { useEffect, useState } from "react";
import "../styles/orders.css";
import { useAuth } from "../state/AuthContext";

function Orders() {
  const { user, token } = useAuth(); // ahora asumimos que token está en el contexto
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;

    const url =
      user.role === "admin" || user.role === "repartidor"
        ? "http://localhost:4000/api/orders"
        : `http://localhost:4000/api/my_orders/${user.email}`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`, // enviar token si backend lo requiere
      },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Error cargando órdenes:", err));
  }, [user, token]);

  // ✅ Marcar como "completed" o "pending" con actualización en BD
  const handleStatusChange = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "completed" ? "pending" : "completed";

      const res = await fetch(`http://localhost:4000/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // enviar token
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error actualizando estado");

      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (!user) return <p>Cargando usuario...</p>;

  return (
    <div className="orders-container">
      <h2>📦 Órdenes</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Ciudad</th>
            <th>Total</th>
            <th>Status</th>
            {(user.role === "admin" || user.role === "repartidor") && <th>Validación</th>}
            <th>Progreso</th>
            <th>Fecha Entrega</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.name}</td>
              <td>{order.email}</td>
              <td>{order.address_line}</td>
              <td>{order.city}</td>
              <td>${Number(order.total).toFixed(2)}</td>
              <td>{order.status}</td>
              {(user.role === "admin" || user.role === "repartidor") && (
                <td>
                  <input
                    type="checkbox"
                    checked={order.status === "completed"}
                    onChange={() => handleStatusChange(order.id, order.status)}
                    disabled={user.role === "repartidor" && order.status === "completed"} // ✅ solo admin puede desmarcar
                  />
                </td>
              )}
              <td>
                {order.status === "pending" && <span className="anim-preparacion">🛠️ En preparación...</span>}
                {order.status === "en_camino" && <span className="anim-camino">🚚 En camino...</span>}
                {order.status === "completed" && <span className="anim-destino">📍 En destino ✅</span>}
              </td>
              <td>{order.order_date ? new Date(order.order_date).toLocaleDateString() : "-"}</td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Orders;
