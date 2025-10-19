import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import "../styles/login.css";
import logueo from "../images/login.png";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // -------------------------
  // Login tradicional
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.token) {
        setError(data?.error || "Credenciales inválidas");
        return;
      }

      const payload = JSON.parse(atob(data.token.split(".")[1]));
      login({ email: payload.email, role: payload.role }, data.token);

      // Navegación según rol
      switch (payload.role) {
        case "admin":
          navigate("/home");
          break;
        case "repartidor":
          navigate("/orders");
          break;
        default:
          navigate("/home");
      }
    } catch (err) {
      console.error("Error en login:", err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Login con Google
  // -------------------------
  const handleGoogleLogin = async (credentialResponse) => {
    setLoading(true);
    setError("");

    if (!credentialResponse?.credential) {
      setError("Token de Google inválido");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.token) {
        setError(data?.error || "Error al iniciar sesión con Google");
        return;
      }

      const payload = JSON.parse(atob(data.token.split(".")[1]));
      login({ email: payload.email, role: payload.role }, data.token);

      // Navegación según rol
      switch (payload.role) {
        case "admin":
          navigate("/home");
          break;
        case "repartidor":
          navigate("/orders");
          break;
        default:
          navigate("/home");
      }
    } catch (err) {
      console.error("Error Google login:", err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div id="login-container">
        <h1>Variedades los Hermanos</h1>
        <h2>Inicio de Sesión</h2>

        <img src={logueo} alt="Login" className="login" />

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="E-mail"
            autoFocus
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>

        <p>
          ¿No tienes cuenta? 👉 <Link to="/register">Regístrate</Link>
        </p>

        <p>O inicia sesión con Google:</p>
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => setError("Error al iniciar sesión con Google")}
        />

        {error && <p className="error">{error}</p>}
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;
