"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface PhotoRevealProps {
  src: string;
  alt: string;
  caption?: string;
  frameColor?: string;
}

export function PhotoReveal({ src, alt, caption, frameColor = "#FFFBF9" }: PhotoRevealProps) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="relative h-72 w-56 overflow-hidden rounded-2xl shadow-2xl"
        style={{ border: `6px solid ${frameColor}` }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <Image src={src} alt={alt} fill sizes="224px" className="object-cover" priority />
        <motion.div
          className="absolute inset-y-0 -left-1/2 w-2/5 bg-gradient-to-r from-transparent via-white/60 to-transparent"
          initial={{ left: "-60%" }}
          animate={{ left: "130%" }}
          transition={{ delay: 1.1, duration: 1.8, ease: "easeInOut" }}
        />
      </motion.div>
      {caption && (
        <motion.p
          className="mt-5 max-w-xs text-center font-serif text-lg italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6, duration: 0.8 }}
        >
          {caption}
        </motion.p>
      )}
    </div>
  );
}
