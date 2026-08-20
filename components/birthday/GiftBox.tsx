"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface GiftBoxProps {
  onOpened: () => void;
  boxColor: string;
  ribbonColor: string;
  glowColor: string;
}

/**
 * Tap-to-open gift box. Sequence: shake -> lid launches off -> glow burst.
 * The parent scene is responsible for triggering confetti + advancing to
 * the reveal scene once `onOpened` fires (kept decoupled so each template
 * can time its own transition).
 */
export function GiftBox({ onOpened, boxColor, ribbonColor, glowColor }: GiftBoxProps) {
  const [phase, setPhase] = useState<"idle" | "shaking" | "open">("idle");

  const handleTap = () => {
    if (phase !== "idle") return;
    setPhase("shaking");
    setTimeout(() => {
      setPhase("open");
      onOpened();
    }, 500);
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        role="button"
        tabIndex={0}
        aria-label="Open your birthday gift"
        onClick={handleTap}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleTap()}
        className="relative h-44 w-44 cursor-pointer"
        animate={
          phase === "shaking"
            ? { rotate: [0, -4, 4, -4, 4, 0] }
            : { rotate: 0 }
        }
        transition={{ duration: 0.5 }}
      >
        {/* glow */}
        <motion.div
          className="absolute -inset-10 rounded-full blur-xl"
          style={{ background: glowColor }}
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "open" ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        />

        {/* box body */}
        <div
          className="absolute bottom-0 left-1.5 h-32 w-40 rounded-lg"
          style={{ background: boxColor }}
        />
        <div
          className="absolute left-1/2 top-0 h-44 w-5 -translate-x-1/2"
          style={{ background: ribbonColor }}
        />
        <div
          className="absolute left-0 top-14 h-5 w-44"
          style={{ background: ribbonColor }}
        />

        {/* lid — animates open */}
        <motion.div
          className="absolute -left-2 top-0 h-11 w-48 rounded-lg"
          style={{ background: boxColor, transformOrigin: "10% 100%" }}
          animate={
            phase === "open"
              ? { y: -100, rotate: -50, opacity: 0 }
              : { y: 0, rotate: 0, opacity: 1 }
          }
          transition={{ duration: 0.7, ease: [0.2, 0.9, 0.3, 1.3] }}
        />
      </motion.div>

      {phase === "idle" && (
        <motion.p
          className="mt-6 text-sm tracking-wide opacity-70"
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          tap to unwrap ✦
        </motion.p>
      )}
    </div>
  );
}
