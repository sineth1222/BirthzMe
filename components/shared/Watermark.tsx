export function Watermark() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
      <div
        style={{
          width: 380,
          height: 380,
          opacity: 0.12,
          filter: "blur(0.5px)",
        }}
      >
        <img
          src="/images/logo1.png"
          alt=""
          style={{ width: 380, height: 380, objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
