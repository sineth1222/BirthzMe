"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  spin: number;
  life: number;
}

interface ConfettiBurstProps {
  /** Bump this number to trigger a new burst (e.g. on gift-open, on final scene). */
  trigger: number;
  colors: string[];
  count?: number;
  originY?: number; // 0-1, fraction of viewport height
  respectReducedMotion?: boolean;
}

/**
 * Lightweight canvas particle burst — deliberately not a full physics engine
 * so it stays smooth on mid-range phones. Shared by all three templates;
 * only the `colors` prop changes per theme.
 */
export function ConfettiBurst({
  trigger,
  colors,
  count = 60,
  originY = 0.35,
  respectReducedMotion = true,
}: ConfettiBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (trigger === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced =
      respectReducedMotion &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const effectiveCount = reduced ? Math.round(count / 4) : count;

    for (let i = 0; i < effectiveCount; i++) {
      particlesRef.current.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 140,
        y: canvas.height * originY,
        vx: (Math.random() - 0.5) * 9,
        vy: Math.random() * -7 - 2,
        size: 4 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.3,
        life: 90 + Math.random() * 50,
      });
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const next: Particle[] = [];
      for (const p of particlesRef.current) {
        p.vy += 0.25;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.spin;
        p.life -= 1;
        if (p.life > 0 && p.y < canvas.height + 40) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = Math.max(p.life / 140, 0);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
          next.push(p);
        }
      }
      particlesRef.current = next;
      if (next.length > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-30"
      aria-hidden="true"
    />
  );
}
