import React, { useEffect, useRef } from "react";

const FallingStars = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const numStars = 100;
    const stars = [];

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 1,
        speed: Math.random() * 4 + 1
      });
    }

    function draw() {
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "white";
      ctx.beginPath();
      for (let s of stars) {
        ctx.moveTo(s.x, s.y);
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      }
      ctx.fill();
      update();
    }

    function update() {
      for (let s of stars) {
        s.y += s.speed;
        if (s.y > height) {
          s.x = Math.random() * width;
          s.y = -5;
          s.r = Math.random() * 2 + 1;
          s.speed = Math.random() * 4 + 1;
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

export default FallingStars;
