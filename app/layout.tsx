import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegistrar } from "@/components/shared/ServiceWorkerRegistrar";

export const metadata: Metadata = {
  title: "BirthzMe — Make Their Birthday Unforgettable",
  description:
    "Create a personalized, animated birthday surprise and share it with a private link.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#B8265A",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerRegistrar />

        {children}
        {/* ── Background logo watermark ── */}
        <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none overflow-hidden">
          <div
            style={{
              width: "380px",
              height: "380px",
              opacity: 0.12, // 👈 0.035 වෙනුවට 0.10 - 0.15 අතර අගයක් දාලා බලන්න
              filter: "blur(0.5px)",
              transition: "all 0.9s ease",
            }}
          >
            <img
              src="/images/logo1.png"
              alt="Icon"
              style={{
                width: "380px",
                height: "380px",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      </body>
    </html>
  );
}
