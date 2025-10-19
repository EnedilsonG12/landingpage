import React, { useEffect, useRef } from "react";

const ChristmasBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Nieve
    const numSnow = 200;
    const snowflakes = [];
    for (let i = 0; i < numSnow; i++) {
      snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 4 + 1,
        d: Math.random() * numSnow
      });
    }

    // Luces navideñas
    const numLights = 30;
    const lights = [];
    for (let i = 0; i < numLights; i++) {
      lights.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 6 + 4,
        color: `hsl(${Math.random() * 360}, 80%, 60%)`,
        blinkSpeed: Math.random() * 0.05 + 0.02,
        opacity: Math.random()
      });
    }

    let angle = 0;

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Nieve
      ctx.fillStyle = "white";
      ctx.beginPath();
      for (let f of snowflakes) {
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      }
      ctx.fill();

      // Luces parpadeantes
      for (let l of lights) {
        ctx.beginPath();
        ctx.globalAlpha = l.opacity;
        ctx.fillStyle = l.color;
        ctx.arc(l.x, l.y, l.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        l.opacity += l.blinkSpeed;
        if (l.opacity > 1) l.opacity = 0;
      }

      update();
    }

    function update() {
      angle += 0.01;
      for (let f of snowflakes) {
        f.y += Math.cos(angle + f.d) + 1 + f.r / 2;
        f.x += Math.sin(angle) * 2;
        if (f.x > width + 5 || f.x < -5 || f.y > height) {
          f.x = Math.random() * width;
          f.y = -10;
        }
      }
    }

    const interval = setInterval(draw, 33);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: 0 }} />;
};

export default ChristmasBackground;
