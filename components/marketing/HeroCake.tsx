"use client";

import { motion } from "framer-motion";

const SPARKLES = [
  { top: "8%", left: "12%", size: 14, delay: 0 },
  { top: "18%", left: "82%", size: 10, delay: 0.6 },
  { top: "62%", left: "88%", size: 12, delay: 1.1 },
  { top: "78%", left: "6%", size: 9, delay: 1.6 },
  { top: "4%", left: "55%", size: 8, delay: 2.1 },
];

/**
 * The hero's visual centerpiece — a glowing, gently floating birthday cake
 * built entirely from CSS/SVG shapes (no external image asset required).
 * Plays the same role DatezMe's HeroHeart plays: the first thing the eye
 * lands on, tying the whole page back to "this is about a birthday".
 */
export function HeroCake() {
  return (
    <div className="relative flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72">
      {/* ambient glow behind the cake */}
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          background: "radial-gradient(circle, #E3B58366, transparent 70%)",
        }}
        animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* sparkles orbiting the scene */}
      {SPARKLES.map((s, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{
            top: s.top,
            left: s.left,
            fontSize: s.size,
            color: "#E3B583",
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.6, 1, 0.6],
            rotate: [0, 90],
          }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut",
          }}
        >
          ✦
        </motion.span>
      ))}

      {/* the cake itself, floating gently */}
      <motion.div
        className="relative"
        animate={{ y: [0, -12, 0], rotate: [-1.5, 1.5, -1.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
          {/* plate shadow */}
          <ellipse
            cx="90"
            cy="156"
            rx="62"
            ry="10"
            fill="#B8265A"
            opacity="0.12"
          />

          {/* bottom tier */}
          <rect x="34" y="112" width="112" height="40" rx="10" fill="#B8265A" />
          <rect x="34" y="112" width="112" height="10" rx="5" fill="#D65A83" />

          {/* top tier */}
          <rect x="54" y="80" width="72" height="38" rx="9" fill="#7C1638" />
          <rect x="54" y="80" width="72" height="9" rx="4.5" fill="#9A2C50" />

          {/* drips */}
          <path d="M40 112 Q46 122 40 132 Q34 122 40 112Z" fill="#E3B583" />
          <path d="M90 112 Q96 124 90 136 Q84 124 90 112Z" fill="#E3B583" />
          <path
            d="M140 112 Q146 122 140 132 Q134 122 140 112Z"
            fill="#E3B583"
          />

          {/* candles */}
          {[70, 90, 110].map((x, i) => (
            <g key={x}>
              <rect
                x={x - 2.5}
                y="58"
                width="5"
                height="24"
                rx="2.5"
                fill="#F6DDE0"
              />
              <motion.ellipse
                cx={x}
                cy="52"
                rx="5"
                ry="7"
                fill="#E3B583"
                animate={{ ry: [6, 8, 6], opacity: [0.85, 1, 0.85] }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
              <ellipse cx={x} cy="53" rx="2" ry="3" fill="#FFF8F5" />
            </g>
          ))}
        </svg>
      </motion.div>
    </div>
  );
}
