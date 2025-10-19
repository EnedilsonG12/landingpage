import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/register.css";
import register from "../images/registro.png";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "usuario", // por defecto usuario
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
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No se pudo registrar el usuario");
        setSuccess("");
        return;
      }
      setSuccess("Usuario registrado correctamente ✅");
      setError("");
      setForm({ username: "", email: "", password: "", role: "user" });
      
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError("Error del servidor");
      setSuccess("");
    }
  };

  return (
    <div id="register-container">
      <h2>Registro de Usuario</h2>
      <img src={register} alt="Registro" className="logo" />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Nombre"
          autoFocus
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electronico"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Registrarse</button>
        <p>
        ¿Ya tienes una cuenta? 👉 <Link to="/">Iniciar Sesion</Link>
      </p>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}

export default Register;
