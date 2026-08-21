"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { TemplateProps } from "@/types/birthday";
import { GiftBox } from "@/components/birthday/GiftBox";
import { NameReveal } from "@/components/birthday/NameReveal";
import { PhotoReveal } from "@/components/birthday/PhotoReveal";
import { MemoryGallery } from "@/components/birthday/MemoryGallery";
import { TypewriterMessage } from "@/components/birthday/TypewriterMessage";
import { AgeReveal } from "@/components/birthday/AgeReveal";
import { SurpriseCountdown } from "@/components/birthday/SurpriseCountdown";
import { ConfettiBurst } from "@/components/birthday/ConfettiBurst";
//import { MusicPlayer } from "@/components/birthday/MusicPlayer";
import { HeroCake } from "../marketing/HeroCake";
import { FireworksField } from "../birthday/FireworksField";
import { FireworksNomal } from "../birthday/FireWorksNomal";
import { BalloonField } from "../birthday/BalloonField";
import { useRef } from "react";
import {
  MusicPlayer,
  type MusicPlayerHandle,
} from "@/components/birthday/MusicPlayer";
import { FireworksText } from "../birthday/FireworksText";

// ---- Dreamy Pink token system ----
const TOKENS = {
  bg: "radial-gradient(ellipse at 50% -10%, #FCE4E8 0%, #FDF3EF 55%, #F8E9E2 100%)",
  rose: "#B8265A",
  roseDeep: "#7C1638",
  gold: "#E3B583",
  mauve: "#7A5766",
  yellow: "#FFC93C",
  white: "#FFFBF9",
  confetti: ["#B8265A", "#E3B583", "#F6DDE0", "#7C1638"],
};

type Scene =
  | "intro"
  | "gift"
  | "reveal"
  | "photo"
  | "gallery"
  | "message"
  | "age"
  | "countdown"
  | "final";

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.6 },
};

export function DreamyPinkTemplate({ surprise, onEvent }: TemplateProps) {
  const [scene, setScene] = useState<Scene>("intro");
  const [burst, setBurst] = useState(0);

  const advance = (next: Scene) => setScene(next);
  const fireConfetti = () => setBurst((b) => b + 1);
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);

  // Skip straight past the gallery scene if there are no memory photos —
  // done as an effect, not during render, to avoid a setState-in-render loop.
  useEffect(() => {
    if (scene === "gallery" && surprise.memoryPhotos.length === 0) {
      advance("message");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  return (
    <div
      className="relative font-display flex min-h-screen w-full items-center justify-center overflow-hidden px-6 py-10 text-center"
      style={{
        background: TOKENS.bg,
        color: "#3A2430",
        fontFamily: "var(--font-outfit, sans-serif)",
      }}
    >
      <ConfettiBurst trigger={burst} colors={TOKENS.confetti} />
      <FireworksField
        colors={[TOKENS.gold, TOKENS.rose, TOKENS.roseDeep, TOKENS.yellow]}
        count={4}
      />
      <FireworksNomal
        colors={["#ff6b6b", "#feca57", "#48dbfb", "#1dd1a1", "#f368e0"]}
        count={2}
      />
      {/* <FireworksText
        colors={["#ff6b9d", "#4ecdc4", "#ffe66d", "#a29bfe", "#ff9f43"]}
      />*/}

      <BalloonField
        colors={[TOKENS.rose, TOKENS.gold, TOKENS.mauve, TOKENS.yellow]}
        count={4}
      />
      {surprise.musicUrl && (
        <MusicPlayer
          ref={musicPlayerRef}
          src={surprise.musicUrl}
          accentColor={TOKENS.rose}
          onStart={() => onEvent?.("music_started")}
        />
      )}

      <AnimatePresence mode="wait">
        {scene === "intro" && (
          <motion.div
            key="intro"
            {...fade}
            className="flex flex-col items-center"
          >
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-current/60">
              a private surprise
            </p>
            <p className="max-w-xs text-lg leading-relaxed">
              Someone made something{" "}
              <span
                className="font-serif italic"
                style={{ color: TOKENS.rose }}
              >
                special
              </span>{" "}
              for you...
            </p>
            <button
              onClick={() => {
                advance("gift");
                onEvent?.("opened");
                musicPlayerRef.current?.play();
              }}
              className="mt-8 rounded-full px-8 py-4 text-sm font-medium text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${TOKENS.rose}, ${TOKENS.roseDeep})`,
              }}
            >
              Open My Surprise 🎁
            </button>
          </motion.div>
        )}

        {scene === "gift" && (
          <motion.div key="gift" {...fade}>
            <GiftBox
              boxColor={TOKENS.rose}
              ribbonColor={TOKENS.gold}
              glowColor={`radial-gradient(circle, ${TOKENS.gold}88, transparent 70%)`}
              onOpened={() => {
                fireConfetti();
                onEvent?.("gift_opened");
                setTimeout(() => advance("reveal"), 700);
              }}
            />
          </motion.div>
        )}

        {scene === "reveal" && (
          <motion.div
            key="reveal"
            {...fade}
            onAnimationComplete={() => {
              fireConfetti();
              onEvent?.("birthday_revealed");
              setTimeout(
                () => advance("photo"),
                surprise.recipientName.length * 90 + 2200,
              );
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <HeroCake />
            </motion.div>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-current/60">
              happy birthday
            </p>
            <NameReveal
              name={surprise.recipientName}
              className="bg-clip-text text-[15vw] font-medium leading-none text-bg md:text-6xl"
            />
            <p className="mt-4 text-base" style={{ color: TOKENS.mauve }}>
              {surprise.recipientAge} looks amazing on you!
            </p>
          </motion.div>
        )}

        {scene === "photo" && surprise.mainPhotoUrl && (
          <motion.div
            key="photo"
            {...fade}
            className="flex flex-col items-center"
          >
            <PhotoReveal
              src={surprise.mainPhotoUrl}
              alt={surprise.recipientName}
              caption={`Today is all about you, ${surprise.recipientName}.`}
              frameColor={TOKENS.white}
            />
            <button
              onClick={() => advance("gallery")}
              className="mt-8 rounded-full px-5 py-2 text-sm font-medium text-white "
              style={{ background: TOKENS.rose }}
            >
              Continue
            </button>
          </motion.div>
        )}

        {scene === "gallery" && surprise.memoryPhotos.length > 0 && (
          <motion.div
            key="gallery"
            {...fade}
            className="flex flex-col items-center"
            onAnimationComplete={() => onEvent?.("gallery_viewed")}
          >
            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-current/60">
              a few memories
            </p>
            <MemoryGallery photos={surprise.memoryPhotos} />
            <button
              onClick={() => advance("message")}
              className="mt-6 rounded-full px-5 py-2 text-sm font-medium text-white "
              style={{ background: TOKENS.rose }}
            >
              Continue
            </button>
          </motion.div>
        )}

        {scene === "message" && (
          <motion.div
            key="message"
            {...fade}
            className="flex flex-col items-center"
          >
            <TypewriterMessage
              message={surprise.birthdayMessage}
              senderName={surprise.senderName}
              onComplete={() => onEvent?.("message_viewed")}
            />
            <button
              onClick={() => advance("age")}
              //className="mt-6 text-sm underline underline-offset-4"
              className="mt-6 rounded-full px-5 py-2 text-sm font-medium text-white "
              style={{ background: TOKENS.rose }}
            >
              Continue
            </button>
          </motion.div>
        )}

        {scene === "age" && (
          <motion.div
            key="age"
            {...fade}
            className="flex flex-col items-center"
          >
            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-current/60">
              turning
            </p>
            <AgeReveal
              age={surprise.recipientAge}
              caption={`${numberToWords(surprise.recipientAge)} Years of Being Amazing ✨`}
              ringColor={TOKENS.rose}
              trackColor="#F0D6DC"
            />
            <button
              onClick={() => advance("countdown")}
              className="mt-8 rounded-full px-8 py-4 text-sm font-medium text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${TOKENS.rose}, ${TOKENS.roseDeep})`,
              }}
            >
              One More Surprise 🎁
            </button>
          </motion.div>
        )}

        {scene === "countdown" && (
          <SurpriseCountdown
            key="countdown"
            bgColor="#2A1420"
            textColor="#F6DDE0"
            onComplete={() => {
              fireConfetti();
              advance("final");
              onEvent?.("surprise_completed");
            }}
          />
        )}

        {scene === "final" && (
          <motion.div
            key="final"
            {...fade}
            className="flex flex-col items-center"
          >
            <h1
              className="font-serif text-4xl"
              style={{ color: TOKENS.roseDeep }}
            >
              Happy Birthday, {surprise.recipientName} 🎂
            </h1>
            <h3
              className="mt-2 font-serif text-2xl italic"
              style={{ color: TOKENS.rose }}
            >
              You deserve all the happiness in the world.
            </h3>
            <p className="mt-6 text-xs" style={{ color: TOKENS.mauve }}>
              Made specially for you by {surprise.senderName}
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => advance("intro")}
                className="rounded-full border border-current/20 px-6 py-2.5 text-xs"
                style={{ color: TOKENS.mauve }}
              >
                Replay Surprise 🔄
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function numberToWords(n: number): string {
  const ones = [
    "Zero",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  if (n < 10) return ones[n];
  if (n < 20) return teens[n - 10];
  if (n < 100)
    return `${tens[Math.floor(n / 10)]}${n % 10 ? "-" + ones[n % 10] : ""}`;
  return String(n);
}
