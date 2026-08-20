import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegistrar } from "@/components/shared/ServiceWorkerRegistrar";

export const metadata: Metadata = {
  title: "BirthzMe — Make Their Birthday Unforgettable",
  description: "Create a personalized, animated birthday surprise and share it with a private link.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#B8265A",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerRegistrar />
        {children}
      </body>
    </html>
  );
}
