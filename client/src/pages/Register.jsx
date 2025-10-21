import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/register.css";
import registerImg from "../images/registro.png";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user", // 🔹 coincide con el backend
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No se pudo registrar el usuario");
        return;
      }

      setSuccess("Usuario registrado correctamente ✅");
      setForm({ username: "", email: "", password: "", role: "user" });

      // Redirigir al login después de 1.5s
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Error en registro:", err);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div id="register-container">
      <h2>Registro de Usuario</h2>
      <img src={registerImg} alt="Registro" className="logo" />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Nombre"
          autoFocus
          autoComplete="username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Registrarse</button>

        <p>
          ¿Ya tienes una cuenta? 👉 <Link to="/login">Iniciar Sesión</Link>
        </p>
      </form>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
}

export default Register;
