import React, { createContext, useContext, useReducer, useEffect } from "react";
import Swal from "sweetalert2";

const CartCtx = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD": {
      const exists = state.find((i) => i.productId === action.item.productId);
      let updatedCart;

      if (exists) {
        updatedCart = state.map((i) =>
          i.productId === action.item.productId
            ? { ...i, qty: i.qty + (action.item.qty || 1) }
            : i
        );
      } else {
        updatedCart = [...state, { ...action.item, qty: action.item.qty || 1 }];
      }

      // 🔹 Aviso al agregar producto
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Producto agregado al carrito 🛒",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });

      return updatedCart;
    }

    case "REMOVE":
      return state.filter((i) => i.productId !== action.id);

    case "SET_QTY":
      return state.map((i) =>
        i.productId === action.id ? { ...i, qty: action.qty } : i
      );

    case "CLEAR":
      return [];

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(reducer, []);

  // 🔹 Calcular cantidad total
  const getCartCount = () =>
    cart.reduce((sum, item) => sum + (item.qty || 0), 0);

  // 🔹 Mostrar recordatorio cada cierto tiempo mientras haya productos
  useEffect(() => {
    let interval;
    if (cart.length > 0) {
      const showReminder = () => {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "info",
          title: `Tienes ${getCartCount()} producto(s) en tu carrito 🛍️`,
          text: "No olvides revisar tu pedido antes de salir.",
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
        });
      };

      // Mostrar inmediatamente al detectar productos
      showReminder();

      // Luego repetir cada 2 minutos (puedes ajustar el tiempo)
      interval = setInterval(showReminder, 120000);
    }

    // 🔹 Limpiar el intervalo si el carrito se vacía o cambia
    return () => clearInterval(interval);
  }, [cart]);

  return (
    <CartCtx.Provider value={{ cart, dispatch, getCartCount }}>
      {children}
    </CartCtx.Provider>
  );
};

export const useCart = () => useContext(CartCtx);
