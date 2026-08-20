"use client";

import { motion } from "framer-motion";

interface AgeRevealProps {
  age: number;
  caption: string;
  ringColor: string;
  trackColor: string;
}

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function AgeReveal({ age, caption, ringColor, trackColor }: AgeRevealProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-52 w-52">
        <svg viewBox="0 0 200 200" className="absolute inset-0 -rotate-90">
          <circle cx="100" cy="100" r={RADIUS} fill="none" stroke={trackColor} strokeWidth="3" />
          <motion.circle
            cx="100"
            cy="100"
            r={RADIUS}
            fill="none"
            stroke={ringColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: CIRCUMFERENCE * 0.16 }}
            transition={{ delay: 0.2, duration: 1.6, ease: [0.2, 0.8, 0.2, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-serif text-7xl" style={{ color: ringColor }}>
          {age}
        </div>
      </div>
      <motion.p
        className="mt-5 font-serif text-2xl italic"
        style={{ color: ringColor }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.7 }}
      >
        {caption}
      </motion.p>
    </div>
  );
}
