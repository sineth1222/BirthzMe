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
import { LightRays } from "@/components/birthday/LightRays";
import { FireworksField } from "../birthday/FireworksField";
import { FireworksNomal } from "../birthday/FireWorksNomal";
import { HeroCake } from "../marketing/HeroCake";
import { useRef } from "react";
import {
  MusicPlayer,
  type MusicPlayerHandle,
} from "@/components/birthday/MusicPlayer";

// ---- Cinematic Gold token system ----
const TOKENS = {
  bg: "radial-gradient(ellipse at 50% 0%, #1B1330 0%, #0E0A1A 45%, #06050C 100%)",
  gold: "#E3B583",
  goldDeep: "#B8874A",
  cream: "#F7EEDD",
  purple: "#7C5CFC",
  yellow: "#FFC93C",
  coral: "#FF7A59",
  navy: "#150F26",
  confetti: ["#E3B583", "#F7EEDD", "#B8874A", "#7C1638"],
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
  transition: { duration: 0.7 },
};

export function CinematicGoldTemplate({ surprise, onEvent }: TemplateProps) {
  const [scene, setScene] = useState<Scene>("intro");
  const [burst, setBurst] = useState(0);
  const advance = (next: Scene) => setScene(next);
  const fireConfetti = () => setBurst((b) => b + 1);
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);

  useEffect(() => {
    if (scene === "gallery" && surprise.memoryPhotos.length === 0)
      advance("message");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 py-10 text-center"
      style={{
        background: TOKENS.bg,
        color: TOKENS.cream,
        fontFamily: "var(--font-outfit, sans-serif)",
      }}
    >
      <LightRays color={TOKENS.gold} />
      <ConfettiBurst trigger={burst} colors={TOKENS.confetti} />
      <FireworksField
        colors={[TOKENS.gold, TOKENS.goldDeep, TOKENS.cream, TOKENS.yellow]}
        count={4}
      />
      <FireworksNomal
        colors={["#ff6b6b", "#feca57", "#48dbfb", "#1dd1a1", "#f368e0"]}
        count={2}
      />
      {surprise.musicUrl && (
        <MusicPlayer
          ref={musicPlayerRef}
          src={surprise.musicUrl}
          accentColor={TOKENS.coral}
          onStart={() => onEvent?.("music_started")}
        />
      )}

      <AnimatePresence mode="wait">
        {scene === "intro" && (
          <motion.div
            key="intro"
            {...fade}
            className="relative flex flex-col items-center"
          >
            <p
              className="mb-4 text-xs uppercase tracking-[0.35em]"
              style={{ color: TOKENS.gold }}
            >
              a private premiere
            </p>
            <p className="max-w-xs text-lg leading-relaxed">
              Someone made something{" "}
              <span
                className="font-serif italic"
                style={{ color: TOKENS.gold }}
              >
                extraordinary
              </span>{" "}
              for you...
            </p>
            <button
              onClick={() => {
                advance("gift");
                onEvent?.("opened");
                musicPlayerRef.current?.play();
              }}
              className="mt-8 rounded-full px-8 py-4 text-sm font-medium"
              style={{
                background: `linear-gradient(135deg, ${TOKENS.gold}, ${TOKENS.goldDeep})`,
                color: "#1B1330",
                boxShadow: `0 10px 30px -8px ${TOKENS.gold}77`,
              }}
            >
              Open My Surprise 🎁
            </button>
          </motion.div>
        )}

        {scene === "gift" && (
          <motion.div key="gift" {...fade} className="relative">
            <GiftBox
              boxColor={TOKENS.goldDeep}
              ribbonColor={TOKENS.cream}
              glowColor={`radial-gradient(circle, ${TOKENS.gold}99, transparent 70%)`}
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
            className="relative"
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
            <p
              className="mb-3 text-xs uppercase tracking-[0.35em]"
              style={{ color: TOKENS.gold }}
            >
              happy birthday
            </p>
            <NameReveal
              name={surprise.recipientName}
              className="text-[15vw] font-medium leading-none md:text-6xl"
            />
            <p className="mt-4 text-base" style={{ color: TOKENS.gold }}>
              {surprise.recipientAge} looks incredible on you.
            </p>
          </motion.div>
        )}

        {scene === "photo" && surprise.mainPhotoUrl && (
          <motion.div
            key="photo"
            {...fade}
            className="relative flex flex-col items-center"
          >
            <PhotoReveal
              src={surprise.mainPhotoUrl}
              alt={surprise.recipientName}
              caption={`Today is all about you, ${surprise.recipientName}.`}
              frameColor={TOKENS.gold}
            />
            <button
              onClick={() => advance("gallery")}
              //className="mt-8 text-sm underline underline-offset-4"
              //style={{ color: TOKENS.gold }}
              className="mt-6 rounded-full px-5 py-2 text-sm font-medium text-white "
              style={{ background: TOKENS.gold }}
            >
              Continue
            </button>
          </motion.div>
        )}

        {scene === "gallery" && surprise.memoryPhotos.length > 0 && (
          <motion.div
            key="gallery"
            {...fade}
            className="relative flex flex-col items-center"
            onAnimationComplete={() => onEvent?.("gallery_viewed")}
          >
            <p
              className="mb-6 text-xs uppercase tracking-[0.35em]"
              style={{ color: TOKENS.gold }}
            >
              a few memories
            </p>
            <MemoryGallery photos={surprise.memoryPhotos} />
            <button
              onClick={() => advance("message")}
              //className="mt-8 text-sm underline underline-offset-4"
              //style={{ color: TOKENS.gold }}
              className="mt-6 rounded-full px-5 py-2 text-sm font-medium text-white "
              style={{ background: TOKENS.gold }}
            >
              Continue
            </button>
          </motion.div>
        )}

        {scene === "message" && (
          <motion.div
            key="message"
            {...fade}
            className="relative flex flex-col items-center"
          >
            <div
              className="max-w-md rounded-2xl border p-1"
              style={{ borderColor: `${TOKENS.gold}44` }}
            >
              <TypewriterMessage
                message={surprise.birthdayMessage}
                senderName={surprise.senderName}
                onComplete={() => onEvent?.("message_viewed")}
              />
            </div>
            <button
              onClick={() => advance("age")}
              //className="mt-6 text-sm underline underline-offset-4"
              //style={{ color: TOKENS.gold }}
              className="mt-6 rounded-full px-5 py-2 text-sm font-medium text-white "
              style={{ background: TOKENS.gold }}
            >
              Continue
            </button>
          </motion.div>
        )}

        {scene === "age" && (
          <motion.div
            key="age"
            {...fade}
            className="relative flex flex-col items-center"
          >
            <p
              className="mb-2 text-xs uppercase tracking-[0.35em]"
              style={{ color: TOKENS.gold }}
            >
              turning
            </p>
            <AgeReveal
              age={surprise.recipientAge}
              caption={`A Milestone Worth Celebrating ✨`}
              ringColor={TOKENS.gold}
              trackColor="#2A2140"
            />
            <button
              onClick={() => advance("countdown")}
              className="mt-8 rounded-full px-8 py-4 text-sm font-medium"
              style={{
                background: `linear-gradient(135deg, ${TOKENS.gold}, ${TOKENS.goldDeep})`,
                color: "#1B1330",
              }}
            >
              One More Surprise 🎁
            </button>
          </motion.div>
        )}

        {scene === "countdown" && (
          <SurpriseCountdown
            key="countdown"
            bgColor="#050308"
            textColor={TOKENS.gold}
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
            className="relative flex flex-col items-center"
          >
            <h1 className="font-serif text-4xl" style={{ color: TOKENS.gold }}>
              Happy Birthday, {surprise.recipientName} 🎂
            </h1>
            <h3
              className="mt-2 font-serif text-2xl italic"
              style={{ color: TOKENS.cream }}
            >
              You deserve all the happiness in the world.
            </h3>
            <p className="mt-6 text-xs opacity-70">
              Made specially for you by {surprise.senderName}
            </p>
            <button
              onClick={() => advance("intro")}
              className="mt-7 rounded-full border px-6 py-2.5 text-xs"
              style={{ borderColor: `${TOKENS.gold}66`, color: TOKENS.gold }}
            >
              Replay Surprise 🔄
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
