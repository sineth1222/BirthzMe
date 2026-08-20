export function LightRays({ color = "#E3B583" }: { color?: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
      <div
        className="absolute left-1/2 top-0 h-[140%] w-[200%] -translate-x-1/2"
        style={{
          background: `conic-gradient(from 200deg at 50% 0%, transparent 0deg, ${color}22 8deg, transparent 16deg, transparent 40deg, ${color}18 48deg, transparent 56deg, transparent 100deg, ${color}22 108deg, transparent 116deg)`,
        }}
      />
    </div>
  );
}
