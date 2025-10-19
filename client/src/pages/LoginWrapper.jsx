import React, { useState, useEffect } from "react";
import SplashScreen from "../components/SplashScreen";
import Login from "./Login";

function LoginWrapper() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000); // ⏳ 3 seg
    return () => clearTimeout(timer);
  }, []);

  return showSplash ? <SplashScreen /> : <Login />;
}

export default LoginWrapper;
