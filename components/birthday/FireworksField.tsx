"use client";

interface FireworksFieldProps {
  colors: string[];
  count?: number;
}

/** Ambient fireworks launching from the bottom and bursting mid-air — CSS-only, no JS animation loop. */
export function FireworksField({ colors, count = 6 }: FireworksFieldProps) {
  const fireworks = Array.from({ length: count }, (_, i) => {
    const streakCount = 16 + Math.floor(Math.random() * 10);
    const streaks = Array.from({ length: streakCount }, (_, j) => {
      const angle = (360 / streakCount) * j + Math.random() * 8;
      const spread = 70 + Math.random() * 60;
      const rad = (angle * Math.PI) / 180;
      return {
        x: Math.cos(rad) * spread,
        y: Math.sin(rad) * spread,
        rot: angle + 90,
        len: 12 + Math.random() * 12,
        flicker: 0.5 + Math.random() * 0.5,
      };
    });

    const sparkCount = 10 + Math.floor(Math.random() * 6);
    const sparks = Array.from({ length: sparkCount }, () => {
      const angle = Math.random() * 360;
      const spread = 40 + Math.random() * 70;
      const rad = (angle * Math.PI) / 180;
      return {
        x: Math.cos(rad) * spread,
        y: Math.sin(rad) * spread,
      };
    });

    return {
      left: i * (100 / count) + Math.random() * 6 + "%",
      delay: i * 1.4 + Math.random() * 1.2 + "s",
      duration: 3.2 + Math.random() * 1.4 + "s",
      color: colors[i % colors.length],
      burstHeight: 60 + Math.random() * 28,
      streaks,
      sparks,
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
            animation: `firework-launch ${f.duration} cubic-bezier(0.15, 0.6, 0.35, 1) ${f.delay} infinite`,
          }}
        >
          {/* glowing tail — trails BELOW the rising rocket, anchored at the rocket point and growing downward */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2"
            style={{
              width: "3px",
              height: "60px",
              background: `linear-gradient(to bottom, ${f.color}, #fff0)`,
              filter: `blur(0.5px) drop-shadow(0 0 4px ${f.color})`,
              transformOrigin: "top center",
              animation: `firework-trail ${f.duration} cubic-bezier(0.15, 0.6, 0.35, 1) ${f.delay} infinite`,
            }}
          />

          {/* rocket head glow while rising */}
          <div
            className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: "#fff",
              boxShadow: `0 0 6px 2px ${f.color}`,
              animation: `firework-head ${f.duration} cubic-bezier(0.15, 0.6, 0.35, 1) ${f.delay} infinite`,
            }}
          />

          {/* bright core flash at burst */}
          <div
            className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: "#fff",
              boxShadow: `0 0 20px 8px ${f.color}, 0 0 40px 16px ${f.color}88`,
              animation: `firework-flash ${f.duration} ease-out ${f.delay} infinite`,
            }}
          />

          {/* radial spark streaks with gravity fall */}
          {f.streaks.map((s, j) => (
            <div
              key={j}
              className="absolute origin-bottom rounded-full"
              style={{
                width: "2px",
                height: s.len,
                background: `linear-gradient(to top, ${f.color}, #fff8)`,
                boxShadow: `0 0 3px ${f.color}`,
                left: "50%",
                top: 0,
                opacity: s.flicker,
                ["--streak-x" as any]: `${s.x}px`,
                ["--streak-y" as any]: `${s.y}px`,
                ["--streak-fall" as any]: `${s.y * 0.35 + 30}px`,
                ["--streak-rot" as any]: `${s.rot}deg`,
                animation: `firework-streak ${f.duration} ${f.delay} infinite`,
              }}
            />
          ))}

          {/* secondary shimmering micro-sparks */}
          {f.sparks.map((sp, j) => (
            <div
              key={`s-${j}`}
              className="absolute h-[3px] w-[3px] rounded-full"
              style={{
                background: "#fff",
                boxShadow: `0 0 4px 1px ${f.color}`,
                left: "50%",
                top: 0,
                ["--spark-x" as any]: `${sp.x}px`,
                ["--spark-y" as any]: `${sp.y}px`,
                ["--spark-fall" as any]: `${sp.y * 0.4 + 45}px`,
                animation: `firework-spark ${f.duration} ${f.delay} infinite`,
              }}
            />
          ))}
        </div>
      ))}

      <style>{`
        @keyframes firework-launch {
          0% { transform: translateY(0); }
          44%, 100% { transform: translateY(var(--burst-h)); }
        }
        @keyframes firework-trail {
          0% { opacity: 0.9; height: 60px; transform: translateX(-50%) scaleY(1); }
          40% { opacity: 0.7; height: 60px; transform: translateX(-50%) scaleY(1); }
          44% { opacity: 0; height: 0; transform: translateX(-50%) scaleY(0); }
          100% { opacity: 0; height: 0; }
        }
        @keyframes firework-head {
          0% { opacity: 1; }
          43% { opacity: 1; }
          44%, 100% { opacity: 0; }
        }
        @keyframes firework-flash {
          0%, 43% { opacity: 0; transform: translate(-50%, -50%) scale(0.1); }
          45% { opacity: 1; transform: translate(-50%, -50%) scale(2); }
          55% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.1); }
          65%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.6); }
        }
        @keyframes firework-streak {
          0%, 44% {
            opacity: 0;
            transform: translate(-50%, 0) rotate(var(--streak-rot)) scaleY(0.2);
          }
          48% {
            opacity: 1;
            transform: translate(-50%, 0) rotate(var(--streak-rot)) scaleY(1);
          }
          62% {
            opacity: 1;
            transform: translate(calc(-50% + var(--streak-x)), var(--streak-y)) rotate(var(--streak-rot)) scaleY(0.85);
          }
          80% {
            opacity: 0.7;
          }
          100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--streak-x) * 1.08), calc(var(--streak-y) + var(--streak-fall))) rotate(var(--streak-rot)) scaleY(0.4);
          }
        }
        @keyframes firework-spark {
          0%, 46% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          65% {
            opacity: 1;
            transform: translate(calc(-50% + var(--spark-x) * 0.7), calc(-50% + var(--spark-y) * 0.7)) scale(0.9);
          }
          85% { opacity: 0.5; }
          100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--spark-x)), calc(-50% + var(--spark-y) + var(--spark-fall))) scale(0.3);
          }
        }
      `}</style>
    </div>
  );
}

/*"use client";

interface FireworksFieldProps {
  colors: string[];
  count?: number;
}

** Ambient fireworks bursting from the bottom — CSS-only, no JS animation loop. /
export function FireworksField({ colors, count = 6 }: FireworksFieldProps) {
  const sparksPerBurst = 14;

  const fireworks = Array.from({ length: count }, (_, i) => {
    const riseHeight = 45 + Math.random() * 35; // vh — how high the rocket climbs

    return {
      left: i * (100 / count) + Math.random() * 6 + "%",
      delay: i * 1.3 + Math.random() + "s",
      duration: 2.4 + Math.random() * 1.4 + "s",
      color: colors[i % colors.length],
      riseHeight: riseHeight + "vh",
      sparks: Array.from({ length: sparksPerBurst }, (_, j) => {
        const angle = (j / sparksPerBurst) * 360 + Math.random() * 12;
        const distance = 35 + Math.random() * 45;
        const rad = (angle * Math.PI) / 180;
        return {
          x: Math.cos(rad) * distance,
          y: Math.sin(rad) * distance,
        };
      }),
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
            animation: `firework-rise ${f.duration} ease-out ${f.delay} infinite`,
            ["--rise-height" as any]: `-${f.riseHeight}`,
          }}
        >
          {/* rocket trail climbing up /}
          <div
            className="absolute rounded-full"
            style={{
              width: 4,
              height: 4,
              background: f.color,
              boxShadow: `0 0 6px 2px ${f.color}aa`,
              animation: `rocket-fade ${f.duration} ease-out ${f.delay} infinite`,
            }}
          />

          {/* burst sparks radiating outward /}
          <div className="absolute">
            {f.sparks.map((s, j) => (
              <div
                key={j}
                className="absolute rounded-full"
                style={{
                  width: 5,
                  height: 5,
                  left: 0,
                  top: 0,
                  background: f.color,
                  boxShadow: `0 0 4px 1px ${f.color}aa`,
                  ["--spark-x" as any]: `${s.x}px`,
                  ["--spark-y" as any]: `${s.y}px`,
                  animation: `spark-explode ${f.duration} ease-out ${f.delay} infinite`,
                }}
              />
            ))}
          </div>
        </div>
      ))}
      <style>{`
        @keyframes firework-rise {
          0% { transform: translateY(0); }
          55% { transform: translateY(var(--rise-height)); }
          100% { transform: translateY(var(--rise-height)); }
        }
        @keyframes rocket-fade {
          0% { opacity: 1; }
          52% { opacity: 1; }
          56% { opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes spark-explode {
          0%, 54% { transform: translate(0, 0) scale(1); opacity: 0; }
          55% { transform: translate(0, 0) scale(1); opacity: 1; }
          80% { transform: translate(var(--spark-x), var(--spark-y)) scale(0.6); opacity: 1; }
          100% { transform: translate(calc(var(--spark-x) * 1.3), calc(var(--spark-y) * 1.3 + 25px)) scale(0.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}*/
