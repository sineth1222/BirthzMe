"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface ShareButtonsProps {
  link: string;
  recipientName: string;
}

export function ShareButtons({ link, recipientName }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [shareText, setShareText] = useState(
    `🎁 I made something special for your birthday...\n\nOpen this surprise:\n${link}\n\nHappy Birthday! ❤️`,
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, link, {
        width: 168,
        margin: 1,
        color: { dark: "#7C1638" },
      });
    }
  }, [link]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nativeShare = async () => {
    if (navigator.share) {
      await navigator
        .share({
          title: `A surprise for ${recipientName}`,
          text: shareText,
          url: link,
        })
        .catch(() => {});
    }
  };

  const downloadQR = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `birthzme-${recipientName.toLowerCase()}-qr.png`;
    a.click();
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <canvas ref={canvasRef} className="rounded-xl border p-2" />

      <textarea
        value={shareText}
        onChange={(e) => setShareText(e.target.value)}
        rows={4}
        className="w-full max-w-sm rounded-xl border p-3 text-xs leading-relaxed"
        style={{ borderColor: "rgba(122,87,102,0.25)" }}
      />

      <div className="flex flex-wrap justify-center gap-2.5">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full px-5 py-2.5 text-xs font-medium text-white transition hover:scale-105"
          style={{ background: "#25D366" }}
        >
          Send via WhatsApp 💚
        </a>
        <button
          onClick={copyLink}
          className="rounded-full border px-5 py-2.5 text-xs font-medium"
          style={{ borderColor: "rgba(122,87,102,0.3)", color: "#3A2430" }}
        >
          {copied ? "Copied ✓" : "Copy Link"}
        </button>
        {typeof navigator !== "undefined" && "share" in navigator && (
          <button
            onClick={nativeShare}
            className="rounded-full border px-5 py-2.5 text-xs font-medium"
            style={{ borderColor: "rgba(122,87,102,0.3)", color: "#3A2430" }}
          >
            Share...
          </button>
        )}
        <button
          onClick={downloadQR}
          className="rounded-full border px-5 py-2.5 text-xs font-medium"
          style={{ borderColor: "rgba(122,87,102,0.3)", color: "#3A2430" }}
        >
          Download QR
        </button>
      </div>
    </div>
  );
}
