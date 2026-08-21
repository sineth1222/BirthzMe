"use client";

import { usePathname } from "next/navigation";

/**
 * Site-wide branding watermark — shown on every page EXCEPT the actual
 * `/birthday/[slug]` recipient pages, where watermark visibility is
 * instead controlled per-surprise via the free/paid flow (see
 * `hasWatermark` on the surprise, and each template's own <Watermark />).
 * Keeping it out of the birthday route is what makes "pay to remove the
 * watermark" mean something — if it showed everywhere unconditionally,
 * paying would never actually remove it from the link recipients see.
 */
export function SiteWatermark() {
  const pathname = usePathname();
  if (pathname?.startsWith("/birthday/")) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] flex items-center justify-center overflow-hidden">
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
