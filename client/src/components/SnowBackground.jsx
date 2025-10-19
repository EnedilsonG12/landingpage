import React, { useEffect, useRef } from "react";

const SnowBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const numFlakes = 200;
    const flakes = [];

    for (let i = 0; i < numFlakes; i++) {
      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 4 + 1,
        d: Math.random() * numFlakes
      });
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "white";
      ctx.beginPath();
      for (let i = 0; i < numFlakes; i++) {
        const f = flakes[i];
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
      }
      ctx.fill();
      update();
    }

    let angle = 0;
    function update() {
      angle += 0.01;
      for (let i = 0; i < numFlakes; i++) {
        const f = flakes[i];
        f.y += Math.cos(angle + f.d) + 1 + f.r / 2;
        f.x += Math.sin(angle) * 2;

        if (f.x > width + 5 || f.x < -5 || f.y > height) {
          flakes[i] = { x: Math.random() * width, y: -10, r: f.r, d: f.d };
        }
      }
    }

    let animation = setInterval(draw, 33);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(animation);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: 0 }} />;
};

export default SnowBackground;
