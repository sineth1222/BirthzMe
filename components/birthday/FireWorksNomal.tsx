"use client";

interface FireworksFieldProps {
  colors: string[];
  count?: number;
}

/** Ambient fireworks launching from the bottom and bursting mid-air — CSS-only, no JS animation loop. */
export function FireworksNomal({ colors, count = 6 }: FireworksFieldProps) {
  const fireworks = Array.from({ length: count }, (_, i) => {
    const particleCount = 10 + Math.floor(Math.random() * 6);
    const particles = Array.from({ length: particleCount }, (_, j) => {
      const angle = (360 / particleCount) * j + Math.random() * 10;
      const spread = 45 + Math.random() * 35;
      return {
        x: Math.cos((angle * Math.PI) / 180) * spread,
        y: Math.sin((angle * Math.PI) / 180) * spread,
      };
    });

    return {
      left: i * (100 / count) + Math.random() * 6 + "%",
      delay: i * 1.1 + Math.random() + "s",
      duration: 2.6 + Math.random() * 1.2 + "s",
      color: colors[i % colors.length],
      burstHeight: 35 + Math.random() * 30,
      particles,
    };
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {fireworks.map((f, i) => (
        <div
          key={i}
          className="absolute bottom-0"
          style={{
            left: f.left,
            ["--burst-h" as any]: `-${f.burstHeight}vh`,
            animation: `firework-launch ${f.duration} ease-out ${f.delay} infinite`,
          }}
        >
          {/* rising trail */}
          <div
            className="absolute bottom-0 left-1/2 w-1 -translate-x-1/2 rounded-full"
            style={{
              background: f.color,
              animation: `firework-trail ${f.duration} ease-out ${f.delay} infinite`,
            }}
          />

          {/* burst particles */}
          {f.particles.map((p, j) => (
            <div
              key={j}
              className="absolute h-1.5 w-1.5 rounded-full"
              style={{
                background: f.color,
                boxShadow: `0 0 6px 1px ${f.color}`,
                left: "50%",
                top: 0,
                ["--burst-x" as any]: `${p.x}px`,
                ["--burst-y" as any]: `${p.y}px`,
                animation: `firework-burst ${f.duration} ease-out ${f.delay} infinite`,
              }}
            />
          ))}
        </div>
      ))}

      <style>{`
        @keyframes firework-launch {
          0% { transform: translateY(0); }
          45%, 100% { transform: translateY(var(--burst-h)); }
        }
        @keyframes firework-trail {
          0% { opacity: 1; height: 8px; }
          44% { opacity: 1; height: 8px; }
          45%, 100% { opacity: 0; height: 0; }
        }
        @keyframes firework-burst {
          0%, 44% { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
          46% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          75% { opacity: 1; transform: translate(calc(-50% + var(--burst-x)), calc(-50% + var(--burst-y))) scale(1); }
          100% { opacity: 0; transform: translate(calc(-50% + var(--burst-x) * 1.4), calc(-50% + var(--burst-y) * 1.4 + 20px)) scale(0.4); }
        }
      `}</style>
    </div>
  );
}
