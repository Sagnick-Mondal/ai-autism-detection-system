"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

type Star = {
  x: number;
  y: number;
  r: number;
  twinkle: number;
};

type Meteor = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
};

export default function ShootingStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || resolvedTheme !== "dark") return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    /* ---------- Stars ---------- */
    const stars: Star[] = Array.from({ length: 180 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.2 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
    }));

    /* ---------- Meteors ---------- */
    const meteors: Meteor[] = [];
    let meteorCooldown = 0;

    const spawnMeteor = () => {
      meteors.push({
        x: Math.random() * width * 0.5,
        y: Math.random() * height * 0.3,
        vx: 14 + Math.random() * 6,
        vy: 6 + Math.random() * 3,
        life: 0,
      });
    };

    let frameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      /* Draw stars */
      ctx.fillStyle = "white";
      for (const s of stars) {
        s.twinkle += 0.01;
        const alpha = 0.3 + Math.sin(s.twinkle) * 0.2;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      /* Spawn meteor occasionally */
      meteorCooldown++;
      if (meteorCooldown > 100 + Math.random() * 100) {
        spawnMeteor();
        meteorCooldown = 0;
      }

      /* Draw meteors */
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.8)";
      ctx.lineWidth = 2;

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.life++;

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx * 2, m.y - m.vy * 2);
        ctx.stroke();

        m.x += m.vx;
        m.y += m.vy;

        if (m.x > width || m.y > height || m.life > 40) {
          meteors.splice(i, 1);
        }
      }

      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, [mounted, resolvedTheme]);

  if (!mounted || resolvedTheme !== "dark") return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
