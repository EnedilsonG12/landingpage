import React from "react";
import SnowBackground from "./ChristmasBackground";      // Invierno / Navidad
import BirdsBackground from "./BirdsBackground";         // Primavera
import FallingStars from "./FallingStars";     // Verano / Año Nuevo
import BubblesBackground from "./BubblesBackground";     // Otoño / Halloween
import NewYearBackground from "./NewYearBackground";     // Año Nuevo
import HalloweenBackground from "./HalloweenBackground"; // Halloween

const SeasonalBackground = () => {
  const today = new Date();
  const month = today.getMonth() + 1; // Enero = 1
  const date = today.getDate();

  // 🎄 Fechas especiales
  const isChristmas = month === 12 && date >= 20 && date <= 31;
  const isHalloween = month === 10 && date >= 25 && date <= 31;
  const isNewYear = month === 12 && date === 31;

  // 🌸 Estaciones
  const isWinter = month === 12 || month === 1 || month === 2;
  const isSpring = month >= 3 && month <= 5;
  const isSummer = month >= 6 && month <= 8;
  const isAutumn = month >= 9 && month <= 11;

  // 🔹 Selección de fondo
  if (isNewYear) return <NewYearBackground />;
  if (isChristmas) return <SnowBackground />;
  if (isHalloween) return <HalloweenBackground />;
  if (isWinter) return <SnowBackground />;
  if (isSpring) return <BirdsBackground />;
  if (isSummer) return <FallingStars />;
  if (isAutumn) return <BubblesBackground />;

  // Fallback: estrellas estáticas
  return <FallingStars />;
};

export default SeasonalBackground;
