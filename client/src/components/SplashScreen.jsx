import React from "react";
import "../styles/splash.css";
import logo from "../images/Variedades.png"; // 👈 tu logo

function SplashScreen() {
  return (
    <div className="splash-container">
      <img src={logo} alt="Logo" className="splash-logo" />
      <h1 className="splash-title">Tienda Online</h1>
    </div>
  );
}

export default SplashScreen;
