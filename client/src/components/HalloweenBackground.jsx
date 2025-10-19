import React, { useEffect, useRef } from "react";

const HalloweenBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const numParticles = 60;
    const particles = [];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 15 + 5,
        speedY: Math.random() * 1.5 + 0.5,
        speedX: Math.random() * 1 - 0.5,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 2 - 1,
        color: `hsl(${Math.random() * 30 + 20}, 80%, 20%)` // tonos oscuros naranja/marrón
      });
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (let p of particles) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 10) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x > width + 10) p.x = -10;
        if (p.x < -10) p.x = width + 10;
      }
    }

    const interval = setInterval(draw, 30);

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

export default HalloweenBackground;
