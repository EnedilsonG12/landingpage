import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import "../styles/products.css";

function AdminModal({ isOpen, onClose, onProductAdded }) {
  const [name, setNombre] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrecio] = useState("");
  const [image_url, setImagen] = useState("");
  const [stock, setStock] = useState("");
  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState("");

  // 🔹 Resetear modal
  const resetModal = () => {
    setNombre("");
    setDescription("");
    setPrecio("");
    setImagen("");
    setStock("");
    setCategoria("");
    setShowNewCategory(false);
    setNuevaCategoria("");
  };

  // 🔹 Traer categorías al abrir modal
  useEffect(() => {
    if (!isOpen) return;
    const fetchCategorias = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categorias`);
        const data = await res.json();
        setCategorias(data);
      } catch (err) {
        console.error("Error al obtener categorías:", err);
      }
    };
    fetchCategorias();
    resetModal();
  }, [isOpen]);

  // 🔹 Cerrar modal con Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => e.key === "Escape" && handleClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  const handleClose = () => {
    resetModal();
    onClose();
  };

  // 🔹 Agregar nueva categoría
  const handleAddCategory = async () => {
    if (!nuevaCategoria.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categorias`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre_categoria: nuevaCategoria.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setCategorias((prev) => [...prev, data]);
        setCategoria(data.id);
        setNuevaCategoria("");
        setShowNewCategory(false);
        Swal.fire({
          icon: "success",
          title: "Categoría agregada ✅",
          showConfirmButton: false,
          timer: 1500,
          background: "#1e1e1e",
          color: "#0cff7c",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "No se pudo agregar la categoría ❌",
          background: "#1e1e1e",
          color: "#ff4d4d",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error conectando con el servidor ❌",
        background: "#1e1e1e",
        color: "#ff4d4d",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoria || !name || !description || !price || !stock) {
      Swal.fire({
        icon: "warning",
        title: "Atención",
        text: "Todos los campos son requeridos ⚠️",
        background: "#1e1e1e",
        color: "#ffcc00",
      });
      return;
    }

    if (Number(price) < 0 || Number(stock) < 0) {
      Swal.fire({
        icon: "warning",
        title: "Atención",
        text: "Precio y stock deben ser positivos ⚠️",
        background: "#1e1e1e",
        color: "#ffcc00",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          stock: Number(stock),
          image_url,
          id_categoria: categoria,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Producto agregado correctamente ✅",
          showConfirmButton: false,
          timer: 2000,
          background: "#1e1e1e",
          color: "#0cff7c",
        });

        resetModal();
        onClose();
        if (onProductAdded) onProductAdded();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error || "Error al guardar producto ❌",
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
    <div className="modal-overlay" onMouseDown={handleClose}>
      <div className="modal-box" onMouseDown={(e) => e.stopPropagation()}>
        <button className="btn-close" onClick={handleClose}>X</button>
        <h2>Agregar producto</h2>

        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Nombre" value={name} onChange={(e) => setNombre(e.target.value)} autoFocus />
          <input type="text" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input type="number" placeholder="Precio (USD)" value={price} onChange={(e) => setPrecio(e.target.value)} />
          <input type="text" placeholder="URL de la imagen" value={image_url} onChange={(e) => setImagen(e.target.value)} />
          <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />

          <select value={categoria} onChange={(e) => {
            if (e.target.value === "nueva") {
              setShowNewCategory(true);
              setCategoria("");
            } else {
              setCategoria(e.target.value);
              setShowNewCategory(false);
            }
          }}>
            <option value="">Selecciona categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id_categoria} value={cat.id_categoria}>
                {cat.nombre_categoria}
              </option>
            ))}
            <option value="nueva">+ Agregar nueva categoría</option>
          </select>

          {showNewCategory && (
            <div style={{ marginTop: "8px" }}>
              <input
                type="text"
                placeholder="Nombre de la nueva categoría"
                value={nuevaCategoria}
                onChange={(e) => setNuevaCategoria(e.target.value)}
              />
              <button type="button" onClick={handleAddCategory} disabled={!nuevaCategoria.trim()}>
                Agregar categoría
              </button>
            </div>
          )}

          <button type="submit" style={{ marginTop: "10px" }}>Guardar</button>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default AdminModal;
