import React, { useEffect, useState } from "react";
import "../styles/orders.css";

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [modalItems, setModalItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/api/ventas")
      .then(res => res.json())
      .then(data => setVentas(data))
      .catch(err => console.error("Error cargando ventas:", err));
  }, []);

  const abrirModal = (itemsJson) => {
    setModalItems(JSON.parse(itemsJson));
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setModalItems([]);
  };

  const calcularTotal = (itemsJson) => {
    const items = JSON.parse(itemsJson);
    return items
      .reduce((sum, item) => sum + Number(item.price) * Number(item.qty), 0) // 🔹 usar price en dólares
      .toFixed(2);
  };

  return (
    <div className="orders-container">
      <h2>📦 Detalle de Ventas</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Orden</th>
            <th>Productos</th>
            <th>Total</th>
            <th>Status</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.id}>
              <td>{venta.id}</td>
              <td>{venta.orderID}</td>
              <td>
                <button onClick={() => abrirModal(venta.items)}>
                  {JSON.parse(venta.items).length} Productos
                </button>
              </td>
              <td>${calcularTotal(venta.items)}</td> {/* 🔹 total en dólares */}
              <td>{venta.status}</td>
              <td>{new Date(venta.fecha).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Detalles de Productos</h3>
            <ul>
              {modalItems.map((item, index) => (
                <li key={index}>
                  Producto ID: {item.productId} | Cantidad: {item.qty} | Precio: ${item.price} {/* 🔹 price en dólares */}
                </li>
              ))}
            </ul>
            <button onClick={cerrarModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ventas;
