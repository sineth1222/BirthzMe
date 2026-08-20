"use client";

import { useEffect, useState } from "react";

interface TypewriterMessageProps {
  message: string;
  senderName: string;
  onComplete?: () => void;
  charsPerTick?: number;
  speedMs?: number;
}

export function TypewriterMessage({
  message,
  senderName,
  onComplete,
  charsPerTick = 1,
  speedMs = 16,
}: TypewriterMessageProps) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShown(message);
      setDone(true);
      onComplete?.();
      return;
    }

    let i = 0;
    const id = setInterval(() => {
      i += charsPerTick;
      setShown(message.slice(0, i));
      if (i >= message.length) {
        clearInterval(id);
        setDone(true);
        onComplete?.();
      }
    }, speedMs);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-current/10 bg-white/70 p-7 text-left backdrop-blur-sm">
      <p className="whitespace-pre-line text-base leading-relaxed">
        {shown}
        {!done && <span className="inline-block w-0.5 animate-pulse bg-current align-middle" />}
      </p>
      {done && (
        <p className="mt-4 text-right font-serif text-xl italic opacity-90">
          — {senderName} ❤️
        </p>
      )}
    </div>
  );
}
