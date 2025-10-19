import React, { useEffect, useRef } from "react";

const BubblesBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const numBubbles = 50;
    const bubbles = [];

    for (let i = 0; i < numBubbles; i++) {
      bubbles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 20 + 10,
        speed: Math.random() * 2 + 1
      });
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255,165,0,0.5)"; // tonos otoño
      ctx.beginPath();
      for (let b of bubbles) {
        ctx.moveTo(b.x, b.y);
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      }
      ctx.fill();
      update();
    }

    function update() {
      for (let b of bubbles) {
        b.y += b.speed;
        if (b.y > height) {
          b.y = -b.r;
          b.x = Math.random() * width;
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

export default BubblesBackground;
