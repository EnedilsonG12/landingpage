import React, { useEffect, useState } from "react";
import "./welcome.css";
import Charizard from "../images/Charizard.png";

const otherMessages = [
  "✨ Hoy tenemos ofertas especiales solo para ti. No te las pierdas! 💖",
  "🌟 ¡Navega por nuestras variedades y encuentra tus favoritos! 🎁",
  "🔥 ¡Bienvenido de nuevo! Echa un vistazo a nuestras novedades. ✨"
];

function WelcomeAlert() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const firstVisit = !localStorage.getItem("welcomeShown");

    if (firstVisit) {
      setMessage("🎉 ¡Bienvenido a nuestra tienda de accesorios y variedades! Explora productos únicos y disfruta de nuestras ofertas especiales. ✨");
      localStorage.setItem("welcomeShown", "true");
    } else {
      const randomIndex = Math.floor(Math.random() * otherMessages.length);
      setMessage(otherMessages[randomIndex]);
    }

    setShow(true);
    const timer = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <>
      {/* Overlay para desenfocar fondo */}
      <div className={`welcome-overlay ${show ? "show" : ""}`}></div>

      {/* Alerta */}
      <div className={`welcome-alert ${show ? "show" : ""}`}>
        <img src={Charizard} alt="Charizard" className="charizard-img" />
        <div className="welcome-text">
          <span>{message}</span>
        </div>
      </div>
    </>
  );
}

export default WelcomeAlert;
