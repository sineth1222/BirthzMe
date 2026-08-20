"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface MusicPlayerProps {
  src: string | null;
  onStart?: () => void;
  accentColor: string;
}

/**
 * Floating music control. Never calls .play() until the user has tapped
 * somewhere on the page — browsers block unattended autoplay with audio,
 * and a failed silent autoplay attempt is worse than just asking.
 */
export function MusicPlayer({ src, onStart, accentColor }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [needsTap, setNeedsTap] = useState(true);

  useEffect(() => {
    if (!src) return;
    audioRef.current = new Audio(src);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.6;
    return () => {
      audioRef.current?.pause();
    };
  }, [src]);

  const toggle = async () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }
    try {
      await audioRef.current.play();
      setPlaying(true);
      setNeedsTap(false);
      onStart?.();
    } catch {
      // Still blocked (e.g. iOS Safari on first render) — leave the prompt visible.
      setNeedsTap(true);
    }
  };

  if (!src) return null;

  return (
    <div className="fixed right-4 top-4 z-30 flex items-center gap-2">
      {needsTap && !playing && (
        <motion.span
          className="rounded-full bg-white/90 px-3 py-1.5 text-xs shadow-md"
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Tap to play music 🎵
        </motion.span>
      )}
      <motion.button
        aria-label={playing ? "Pause music" : "Play music"}
        onClick={toggle}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md"
        style={{ color: accentColor }}
        animate={playing ? { rotate: 360 } : { rotate: 0 }}
        transition={playing ? { duration: 4, repeat: Infinity, ease: "linear" } : {}}
      >
        🎵
      </motion.button>
    </div>
  );
}
