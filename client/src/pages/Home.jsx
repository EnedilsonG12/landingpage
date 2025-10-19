import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useCart } from "../state/CartContext";
import { useAuth } from "../state/AuthContext";
import { MdAddShoppingCart } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit, FaSearch } from "react-icons/fa";
import WelcomeAlert from "../components/WelcomeAlert";
import StarRating from "../components/StarRating";
import SeasonalBackground from "../components/SeasonalBackground"; // 🫧 Fondo animado
import "../styles/home.css";


const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const { dispatch } = useCart();
  const { user, token } = useAuth();
  const API = import.meta.env.VITE_API_URL;

  const api = axios.create({
    baseURL: API,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/products");
      const now = new Date();
      const updatedProducts = res.data.map((p) => ({
        ...p,
        rating: p.rating ? Number(p.rating) : 0,
        discount:
          p.discount_expiration && new Date(p.discount_expiration) <= now
            ? 0
            : p.discount,
      }));
      setProducts(updatedProducts);
      const cats = [
        ...new Set(updatedProducts.map((p) => p.categoria || "Sin categoría")),
      ];
      setCategories(cats);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudieron cargar los productos", "error");
    }
  };

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleAddToCart = (p) => {
    dispatch({
      type: "ADD",
      item: { productId: p.id, name: p.name, image: p.image_url, price: Number(p.price), qty: 1 },
    });
    Swal.fire({
      position: "center",
      icon: "success",
      text: `${p.name} agregado al carrito`,
      showConfirmButton: false,
      timer: 1200,
    });
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "No se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (confirm.isConfirmed) {
      try {
        await api.delete(`/api/products/${id}`);
        Swal.fire("Eliminado", "Producto eliminado correctamente", "success");
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "No se pudo eliminar el producto", "error");
      }
    }
  };

  const handleEdit = async (product) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar producto",
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Nombre" value="${product.name}" />
        <input id="swal-description" class="swal2-input" placeholder="Descripción" value="${product.description}" />
        <input id="swal-price" type="number" class="swal2-input" placeholder="Precio (USD)" value="${Number(product.price).toFixed(2)}" />
        <input id="swal-img" class="swal2-input" placeholder="URL de imagen" value="${product.image_url}" />
        <input id="swal-discount" class="swal2-input" placeholder="% Descuento" value="${product.discount}" />
        <input id="swal-discount-expiration" type="date" class="swal2-input" value="${product.discount_expiration || ""}" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      preConfirm: () => {
        const name = document.getElementById("swal-name").value.trim();
        const description = document
          .getElementById("swal-description")
          .value.trim();
        const price = parseFloat(document.getElementById("swal-price").value);
        const discount = parseFloat(
          document.getElementById("swal-discount").value
        );
        const discount_expiration = document.getElementById(
          "swal-discount-expiration"
        ).value;
        const image_url =
          document.getElementById("swal-img").value.trim() ||
          "https://via.placeholder.com/180";

        if (!name || !description || isNaN(price) || price <= 0 || !image_url) {
          Swal.showValidationMessage(
            "Completa todos los campos correctamente, incluyendo la imagen"
          );
          return false;
        }
        if (isNaN(discount) || discount < 0 || discount > 100) {
          Swal.showValidationMessage(
            "El descuento debe ser un número entre 0 y 100"
          );
          return false;
        }

        const id_categoria = product.id_categoria || 1;

        return {
          name,
          description,
          price,
          image_url,
          discount,
          discount_expiration:
            discount > 0 && discount_expiration ? discount_expiration : null,
          id_categoria,
        };
      },
    });

    if (formValues) {
      try {
        await api.put(`/api/products/${product.id}`, formValues);
        Swal.fire("Actualizado", "Producto actualizado correctamente", "success");
        fetchProducts();
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "No se pudo actualizar el producto", "error");
      }
    }
  };

  const handleRating = async (productId, value) => {
    const comment = prompt("Escribe un comentario (opcional):") || "";
    try {
      const res = await api.post(`/api/products/${productId}/rating`, {
        rating: value,
        comment,
      });
      Swal.fire("Gracias!", "Tu valoración ha sido registrada.", "success");
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, rating: res.data.average } : p
        )
      );
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo registrar la valoración.", "error");
    }
  };

  const showDescription = (product) => {
    Swal.fire({
      title: product.name,
      html: `
        <img src="${product.image_url}" style="width:40%; border-radius:8px; margin-bottom:10px;" />
        <p><b>Categoria:</b> ${product.categoria || "Sin categoría"}</p>
        <p><b>Descripcion:</b> ${product.description || "Sin descripción"}</p>
        <p><b>Precio:</b></p>
        ${
          product.discount > 0
            ? `<p><span style="text-decoration:line-through; color:red;">$${product.price}</span> 
               <b>$${(product.price * (1 - product.discount / 100)).toFixed(2)}</b></p>`
            : `<p><b>$${product.price}</b></p>`
        }
      `,
       background: "#3d373eff",
       icon: "info",
       iconColor: "#6A1B9A", 
       // color de fondo suave
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: "Cerrar",
        confirmButtonColor: "#6A1B9A", // color del botón
    });
  };

  return (
    <div className="layout" style={{ position: "relative", zIndex: 1 }}>
      <WelcomeAlert /> {/* Mensaje de bienvenida */}
      <div className="home-wrapper" style={{ position: "relative" }}>
        <SeasonalBackground /> {/* 🫧 Fondo animado */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className={`search-form ${showSearch ? "expanded" : ""}`}
        >
          <FaSearch
            className="search-icon"
            onClick={() => setShowSearch(!showSearch)}
          />
          {showSearch && (
            <input
              type="text"
              placeholder="Buscar Producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          )}
        </form>

        <main className="home-container">
          {categories.map((cat, idx) => (
            <div key={idx} className="category-section">
              <h3 className="category-title">{cat}</h3>
              <div className="cards-container">
                {products
                  .filter((p) => (p.categoria || "Sin categoría") === cat)
                  .filter(
                    (p) =>
                      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (p.description &&
                        p.description
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()))
                  )
                  .map((p) => (
                    <div key={p.id} className="card">
                      {p.discount > 0 && (
                        <div className="discount-badge">-{p.discount}%</div>
                      )}
                      <img
                        src={p.image_url || "https://via.placeholder.com/180"}
                        alt={p.name}
                      />
                      <h3>{p.name}</h3>
                      <p
                        className="texto description-preview"
                        onClick={() => showDescription(p)}
                        style={{
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        Ver descripción
                      </p>

                      {p.discount > 0 ? (
                        <p>
                          <span className="old-price">
                            ${Number(p.price).toFixed(2)}
                          </span>
                          <span className="new-price">
                            $
                            {(
                              Number(p.price) * (1 - p.discount / 100)
                            ).toFixed(2)}
                          </span>
                        </p>
                      ) : (
                        <p>${Number(p.price).toFixed(2)}</p>
                      )}

                      <StarRating
                        productId={p.id}
                        initialRating={p.rating || 0}
                        onRate={handleRating}
                      />

                      {user?.role === "admin" && (
                        <>
                          <button
                            className="btn btn-warning"
                            onClick={() => handleEdit(p)}
                          >
                            <FaEdit /> Editar
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(p.id)}
                          >
                            <AiFillDelete /> Eliminar
                          </button>
                        </>
                      )}

                      <button
                        className="btn"
                        onClick={() => handleAddToCart(p)}
                      >
                        <MdAddShoppingCart /> Añadir al carrito
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default Home;
