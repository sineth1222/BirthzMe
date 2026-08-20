"use client";

import { useEffect, useState } from "react";

type Platform = "android" | "ios" | "desktop" | "unknown";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  return "desktop";
}

const DISMISS_KEY = "birthzme_install_dismissed";

/**
 * Android: listens for the native beforeinstallprompt event and shows a
 * real install button. iOS: Safari never fires that event, so we show
 * manual "Tap Share → Add to Home Screen" instructions instead — we never
 * claim iOS behaves like Android. Dismissal is remembered so this doesn't
 * nag on every visit.
 */
export function InstallAppSection() {
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [dismissed, setDismissed] = useState(true);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1");

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;
    setInstalled(standalone);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    // @ts-expect-error - BeforeInstallPromptEvent isn't in lib.dom yet
    deferredPrompt.prompt();
    setDeferredPrompt(null);
    dismiss();
  };

  if (installed || dismissed) return null;
  if (platform === "android" && !deferredPrompt) return null; // wait for the real browser prompt

  return (
    <div
      className="mx-auto my-10 flex max-w-md flex-col items-center gap-3 rounded-2xl border p-5 text-center"
      style={{ borderColor: "rgba(122,87,102,0.2)" }}
    >
      <p className="font-serif text-lg" style={{ color: "#3A2430" }}>
        Install BirthzMe 📱
      </p>

      {platform === "android" && (
        <>
          <p className="text-xs font-display" style={{ color: "#7A5766" }}>
            Add BirthzMe to your home screen.
          </p>
          <button
            onClick={install}
            className="rounded-full px-5 py-2 text-xs font-display font-medium text-white"
            style={{ background: "linear-gradient(135deg,#B8265A,#7C1638)" }}
          >
            Install
          </button>
        </>
      )}

      {platform === "ios" && (
        <p className="text-xs font-display" style={{ color: "#7A5766" }}>
          Tap the Share icon, then <strong>Add to Home Screen</strong>.
        </p>
      )}

      {platform === "desktop" && (
        <p className="text-xs font-display" style={{ color: "#7A5766" }}>
          Look for the install icon in your browser&apos;s address bar.
        </p>
      )}

      <button onClick={dismiss} className="text-[11px] opacity-50">
        Not now
      </button>
    </div>
  );
}
