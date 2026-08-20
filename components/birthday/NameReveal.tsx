"use client";

import { motion } from "framer-motion";

interface NameRevealProps {
  name: string;
  className?: string;
}

/** Letter-by-letter blur-to-sharp reveal, shared across templates. */
export function NameReveal({ name, className }: NameRevealProps) {
  return (
    <h1 className={className} aria-label={name}>
      {name.split("").map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className="inline-block"
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: i * 0.09, duration: 0.6, ease: [0.2, 0.8, 0.3, 1.2] }}
          aria-hidden="true"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </h1>
  );
}
