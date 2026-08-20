"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface SurpriseCountdownProps {
  onComplete: () => void;
  bgColor?: string;
  textColor?: string;
}

export function SurpriseCountdown({
  onComplete,
  bgColor = "#241017",
  textColor = "#F6DDE0",
}: SurpriseCountdownProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      const t = setTimeout(onComplete, 250);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCount((c) => c - 1), 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center"
      style={{ background: bgColor }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <AnimatePresence mode="wait">
        {count > 0 && (
          <motion.span
            key={count}
            className="font-serif text-8xl"
            style={{ color: textColor }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.4 }}
            transition={{ duration: 0.35 }}
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
