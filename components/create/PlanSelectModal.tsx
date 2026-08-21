"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { SiteWatermark } from "../shared/SiteWatermark";

declare global {
  interface Window {
    payhere?: {
      startPayment: (payment: Record<string, unknown>) => void;
      onCompleted?: (orderId: string) => void;
      onDismissed?: () => void;
      onError?: (error: string) => void;
    };
  }
}

interface PlanSelectModalProps {
  surpriseId: string;
  recipientName: string;
  senderEmail: string;
  onFree: () => void;
  onPaidSuccess: () => void;
  onClose: () => void;
}

const FEATURES = [
  { label: "Animated birthday experience", free: true, paid: true },
  { label: "Photo, message & music", free: true, paid: true },
  { label: "Private shareable link", free: true, paid: true },
  { label: "BirthzMe watermark shown", free: true, paid: false },
];

export function PlanSelectModal({
  surpriseId,
  recipientName,
  senderEmail,
  onFree,
  onPaidSuccess,
  onClose,
}: PlanSelectModalProps) {
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.payhere) return;
    window.payhere.onCompleted = () => {
      setPaying(false);
      onPaidSuccess();
    };
    window.payhere.onDismissed = () => setPaying(false);
    window.payhere.onError = (msg) => {
      setPaying(false);
      setError(msg || "Payment failed. Try again.");
    };
  }, [onPaidSuccess]);

  const startPayment = async () => {
    setError(null);
    setPaying(true);
    try {
      const res = await fetch("/api/payment/payhere/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surpriseId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not start payment.");

      window.payhere?.startPayment({
        sandbox: true, // set to false once you have live PayHere credentials
        merchant_id: data.merchantId,
        return_url: data.returnUrl,
        cancel_url: data.cancelUrl,
        notify_url: data.notifyUrl,
        order_id: data.orderId,
        items: `Remove watermark — ${recipientName}'s birthday surprise`,
        amount: data.amount.toFixed(2),
        currency: data.currency,
        hash: data.hash,
        first_name: "BirthzMe",
        last_name: "Customer",
        email: senderEmail || "customer@example.com",
        phone: "0000000000",
        address: "N/A",
        city: "Colombo",
        country: "Sri Lanka",
      });
    } catch (e) {
      setPaying(false);
      setError(e instanceof Error ? e.message : "Could not start payment.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <Script
        src="https://www.payhere.lk/lib/payhere.js"
        strategy="afterInteractive"
      />
      <SiteWatermark />
      <div className="w-full max-w-md rounded-2xl bg-white p-6">
        <h2
          className="text-center font-serif text-xl"
          style={{ color: "#3A2430" }}
        >
          Choose how to share this surprise
        </h2>
        <p className="mt-1 text-center text-xs" style={{ color: "#7A5766" }}>
          For {recipientName}
        </p>

        <div
          className="mt-5 overflow-hidden rounded-xl border"
          style={{ borderColor: "rgba(122,87,102,0.2)" }}
        >
          <div
            className="grid grid-cols-3 gap-2 border-b bg-gray-50 px-3 py-2 text-[11px] font-medium"
            style={{ borderColor: "rgba(122,87,102,0.15)" }}
          >
            <span></span>
            <span className="text-center">Free</span>
            <span className="text-center">Paid</span>
          </div>
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="grid grid-cols-3 gap-2 border-b px-3 py-2 text-xs last:border-b-0"
              style={{ borderColor: "rgba(122,87,102,0.1)" }}
            >
              <span style={{ color: "#3A2430" }}>{f.label}</span>
              <span className="text-center">{f.free ? "✓" : "—"}</span>
              <span className="text-center">{f.paid ? "✓" : "—"}</span>
            </div>
          ))}
        </div>

        {error && (
          <p className="mt-3 text-center text-xs" style={{ color: "#B8265A" }}>
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-col gap-2.5">
          <button
            onClick={onFree}
            disabled={paying}
            className="rounded-full border px-5 py-3 text-sm font-medium"
            style={{ borderColor: "rgba(122,87,102,0.3)", color: "#3A2430" }}
          >
            Continue Free (with watermark)
          </button>
          <button
            onClick={startPayment}
            disabled={paying}
            className="rounded-full px-5 py-3 text-sm font-medium text-white"
            style={{ background: "linear-gradient(135deg,#B8265A,#7C1638)" }}
          >
            {paying ? "Opening payment..." : "Remove Watermark — Rs. 300 🔓"}
          </button>
          <button onClick={onClose} className="text-xs opacity-60">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
