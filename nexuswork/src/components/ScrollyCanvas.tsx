"use client";

import { useEffect, useRef } from "react";

interface Orb {
  x: number;
  y: number;
  r: number;
  c1: string;
  c2: string;
}

interface Star {
  x: number;
  y: number;
  r: number;
  b: number;
}

export function ScrollyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const tRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let hw = 0;
    let hh = 0;

    const orbs: Orb[] = [
      { x: 0.5, y: 0.45, r: 220, c1: "#1a3a6e", c2: "#0d1f3c" },
      { x: 0.2, y: 0.7, r: 100, c1: "#2d1a6e", c2: "#180d3c" },
      { x: 0.8, y: 0.3, r: 80, c1: "#0a4a3a", c2: "#052a22" },
    ];

    const stars: Star[] = Array.from({ length: 80 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.2 + 0.3,
      b: Math.random() * Math.PI * 2,
    }));

    function resize() {
      if (!canvas) return;
      hw = canvas.width = canvas.offsetWidth;
      hh = canvas.height = canvas.offsetHeight;
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function draw() {
      if (!ctx) return;
      tRef.current += 0.005;
      const t = tRef.current;

      ctx.fillStyle = "#080c14";
      ctx.fillRect(0, 0, hw, hh);

      orbs.forEach((o, i) => {
        const ox = hw * (o.x + Math.sin(t * 0.3 + i) * 0.04);
        const oy = hh * (o.y + Math.cos(t * 0.25 + i * 1.3) * 0.03);
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, o.r);
        g.addColorStop(0, o.c1 + "cc");
        g.addColorStop(1, o.c2 + "00");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(ox, oy, o.r, 0, Math.PI * 2);
        ctx.fill();
      });

      stars.forEach((s) => {
        const blink = Math.sin(t * 2 + s.b) * 0.5 + 0.5;
        ctx.globalAlpha = 0.1 + blink * 0.25;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(s.x * hw, s.y * hh, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      frameRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      ro.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}
