"use client";

interface BalloonFieldProps {
  colors: string[];
  count?: number;
}

/** Ambient floating balloons rising from the bottom — CSS-only, no JS animation loop. */
export function BalloonField({ colors, count = 8 }: BalloonFieldProps) {
  const balloons = Array.from({ length: count }, (_, i) => ({
    left: (i * (100 / count) + Math.random() * 6) + "%",
    delay: (i * 0.6 + Math.random()) + "s",
    duration: (9 + Math.random() * 5) + "s",
    color: colors[i % colors.length],
    size: 34 + Math.random() * 20,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {balloons.map((b, i) => (
        <div
          key={i}
          className="absolute bottom-[-120px] rounded-full"
          style={{
            left: b.left,
            width: b.size,
            height: b.size * 1.2,
            background: `radial-gradient(circle at 35% 30%, ${b.color}dd, ${b.color})`,
            animation: `balloon-rise ${b.duration} ease-in ${b.delay} infinite`,
          }}
        >
          <div
            className="absolute left-1/2 top-full h-10 w-px -translate-x-1/2"
            style={{ background: `${b.color}88` }}
          />
        </div>
      ))}
      <style>{`
        @keyframes balloon-rise {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          8% { opacity: 0.9; }
          100% { transform: translateY(-115vh) translateX(20px) rotate(8deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
