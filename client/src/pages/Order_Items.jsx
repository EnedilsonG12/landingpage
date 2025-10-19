import React, { useEffect, useState, useRef } from "react";
import Variedades from "../images/Variedades.png";
import "../styles/order_items.css";

function OrderItems() {
  const [items, setItems] = useState([]);
  const tableRef = useRef();

  useEffect(() => {
    fetch("http://localhost:4000/api/order_items")
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error("Error cargando items:", err));
  }, []);

  // Imprimir reporte general
  const imprimirReporte = () => {
    const content = tableRef.current.innerHTML;
    const win = window.open("", "", "height=600,width=900");
    win.document.write("<html><head><title>Reporte General de Ordenes</title>");
    win.document.write(`
      <style>
        body {
          font-family: 'Time New Roman', sans-serif;
          background-color: #f8f8f8;
          color: #333;
          margin: 0;
          padding: 20px;
        }
        h2 {
          text-align: center;
          color: #2c3e50;
          font-weight: 600;
          margin-bottom: 25px;
          font-size: 24px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          background-color: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        th, td {
          border-bottom: 1px solid #e0e0e0;
          padding: 12px 15px;
          text-align: left;
          font-size: 14px;
        }
        th {
          background-color: #ecf0f1;
          color: #34495e;
          font-weight: 600;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        tr:hover {
          background-color: #f1f1f1;
        }
        @media print {
          body {
            background-color: #fff;
            padding: 0;
          }
          table {
            box-shadow: none;
          }
        }
      </style>
    `);
    win.document.write("</head><body>");
    win.document.write("<h2>Reporte General de Items de Órdenes</h2>");
    win.document.write(`<img src="${Variedades}" alt="Logo" style="width:200px; display:block; margin:0 auto 20px;">`);
    win.document.write(content);
    win.document.write("</body></html>");
    win.document.close();
    win.print();
  };

  // Imprimir por ID con QR
  const imprimirPorId = (order_id) => {
    const item = items.find(item => item.order_id === order_id);
    if (!item) return alert("Item no encontrado");

    // URL accesible del QR
    const orderUrl = `http://localhost:4000/api/order_items/${item.order_id}`;
    const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=${encodeURIComponent(orderUrl)}&chld=L|1`;

    const content = `
      <div class="ticket">
        <h2>💳 Ticket de Compra</h2>
        <p><b>N. de Orden:</b> ${item.order_id}</p>
        <p><b>Orden PayPal:</b> ${item.orden_payment_intent}</p>
        <p><b>Cliente:</b> ${item.customer_name}</p>
        <p><b>Email:</b> ${item.customer_email}</p>
        <p><b>Teléfono:</b> ${item.customer_phone}</p>
        <p><b>Dirección:</b> ${item.customer_address}</p>
        <p><b>Ciudad:</b> ${item.customer_city}</p>
        <hr>
        <p><b>Producto:</b> ${item.product_name}</p>
        <p><b>Cantidad:</b> ${item.quantity}</p>
        <p><b>Precio unitario:</b> $${Number(item.unit_price).toFixed(2)}</p>
        <p><b>Total:</b> $${Number(item.line_total).toFixed(2)}</p>
        <hr>
        <p><b>Fecha:</b> ${new Date(item.created_date).toLocaleString()}</p>
        <div style="text-align:center; margin-top:10px;">
          <p>Escanea para ver la orden online</p>
          <img src="${qrUrl}" alt="QR Orden" style="width:120px; height:120px; margin-top:8px;">
        </div>
        <p style="text-align:center;">¡Gracias por su compra! 🎉</p>
      </div>
    `;

    const win = window.open("", "", "height=600,width=400");
    win.document.write("<html><head><title>Ticket de Compra</title>");
    win.document.write(`
      <style>
        body {
          font-family: 'Courier New', monospace;
          margin: 0;
          padding: 10px;
          background-color: #fff;
        }
        .ticket {
          max-width: 300px;
          margin: 0 auto;
          padding: 10px;
          border: 1px dashed #333;
        }
        h2 {
          text-align: center;
          font-size: 18px;
          margin-bottom: 10px;
        }
        p {
          font-size: 14px;
          margin: 4px 0;
        }
        hr {
          border: none;
          border-top: 1px dashed #333;
          margin: 10px 0;
        }
        img {
          display: block;
          margin: 0 auto 10px;
        }
        @media print {
          body {
            padding: 0;
          }
          .ticket {
            border: none;
          }
        }
      </style>
    `);
    win.document.write("</head><body>");
    win.document.write(`<img src="${Variedades}" alt="Logo" style="width:100px; display:block; margin:0 auto 10px;">`);
     win.document.write("<h2>Variedades los Hermanos</h2>");
    win.document.write(content);
    win.document.write("</body></html>");
    win.document.close();
    win.print();
  };

  return (
    <div className="order-items-container">
      <h2>🛒 Detalles de Pedidos</h2>
      <button
        onClick={imprimirReporte}
        style={{ marginBottom: 10, width: 80, padding: "5px 10px", cursor: "pointer" }}
      >
        🖨️
      </button>

      <div ref={tableRef}>
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>N. de Orden</th>
              <th>Cliente</th>
              <th>Dirección</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Total</th>
              <th>Creacion</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.order_id}</td>
                <td>{item.customer_name}</td>
                <td>{item.customer_address}</td>
                <td>{item.product_name}</td>
                <td>{item.quantity}</td>
                <td>${Number(item.line_total).toFixed(2)}</td>
                <td>{new Date(item.created_date).toLocaleString()}</td>
                <td>
                  <button onClick={() => imprimirPorId(item.order_id)}>🖨️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderItems;
