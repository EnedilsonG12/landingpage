import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useCart } from "../state/CartContext";
import { useAuth } from "../state/AuthContext";
import "../styles/checkout.css";
import { FaWhatsapp } from "react-icons/fa";

export default function Checkout() {
  const { cart, dispatch } = useCart();
  const { user } = useAuth();
  const paypalRef = useRef();
  const API = import.meta.env.VITE_API_URL;

  const [customerInfo, setCustomerInfo] = useState({
    name: user?.username || "Cliente",
    email: user?.email || "",
    address_line: "",
    city: "",
    country: "",
  });

  useEffect(() => {
    if (!cart.length) return;

    const renderButtons = () => {
      if (!paypalRef.current || !window.paypal) return;
      paypalRef.current.innerHTML = "";

      window.paypal.Buttons({
        createOrder: async () => {
          // Mapeamos los items para enviarlos correctamente al backend
          const itemsForBackend = cart.map(item => ({
            productId: item.productId, // asegúrate que venga así desde tu carrito
            qty: item.qty,
            price: item.price_cents / 100 || item.price || 0 // convertimos si está en centavos
          }));

          try {
            const res = await axios.post(`${API}/api/create-paypal-order`, { 
              items: itemsForBackend,
              customer_name: customerInfo.name,
              email: customerInfo.email,
              phone: customerInfo.phone || "N/A",
              address_line: customerInfo.address_line,
              city: customerInfo.city,
              country: customerInfo.country,
            });
            return res.data?.orderID;
          } catch (err) {
            console.error("Error creando orden PayPal:", err.response?.data || err.message);
            Swal.fire("Error", "No se pudo crear la orden de PayPal.", "error");
          }
        },
        onApprove: async (data) => {
          try {
            const captureRes = await axios.post(`${API}/api/capture-paypal-order`, { orderID: data.orderID });
            const amountValue = Number(captureRes.data?.data?.purchase_units?.[0]?.amount?.value) || 0;

            Swal.fire({
              icon: "success",
              title: "Pago exitoso ✅",
              html: `<p>Tu pago se realizó correctamente.</p>
                     <p><b>Monto:</b> $${amountValue.toFixed(2)}</p>`,
              confirmButtonColor: "#3085d6",
            });

            dispatch({ type: "CLEAR" });
          } catch (err) {
            console.error("Error capturando pago:", err.response?.data || err.message);
            Swal.fire("Error", "No se pudo capturar el pago.", "error");
          }
        },
        onError: (err) => {
          console.error("PayPal error:", err);
          Swal.fire("Error", "Ocurrió un problema con PayPal.", "error");
        },
      }).render(paypalRef.current);
    };

    if (!document.getElementById("paypal-sdk")) {
      const script = document.createElement("script");
      script.id = "paypal-sdk";
      script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=USD`;
      script.async = true;
      script.onload = renderButtons;
      document.body.appendChild(script);
    } else {
      renderButtons();
    }
  }, [cart, customerInfo, dispatch, user, API]);

  if (!cart.length) {
    return (
      <div className="checkout-container">
        <h2>No tienes productos en el carrito 🛒</h2>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Checkout - Métodos de pago</h2>
      <div className="paypal-buttons" ref={paypalRef} />

      <a
        href="https://wa.me/50377331354"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button"
        title="Contáctanos por WhatsApp"
      >
        <FaWhatsapp size={30} color="#25D366" />
        Más opciones de pago, Contáctanos por WhatsApp
      </a>
    </div>
  );
}
