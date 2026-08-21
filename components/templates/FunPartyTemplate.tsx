"use client";

import { useEffect, useRef, useState } from "react";
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
import { BalloonField } from "@/components/birthday/BalloonField";
import { HeroCake } from "../marketing/HeroCake";
import {
  MusicPlayer,
  type MusicPlayerHandle,
} from "@/components/birthday/MusicPlayer";
import { Watermark } from "../shared/Watermark";

// ---- Fun Party token system ----
const TOKENS = {
  bg: "linear-gradient(160deg, #FFF4E0 0%, #FFE8EE 45%, #E6F7F5 100%)",
  coral: "#FF7A59",
  teal: "#2FBFB0",
  purple: "#7C5CFC",
  yellow: "#FFC93C",
  ink: "#2B2440",
  confetti: ["#FF7A59", "#2FBFB0", "#7C5CFC", "#FFC93C", "#FF5C8A"],
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

const bounceIn = {
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] },
};

// Animation intensity from the Customize step scales how much confetti fires.
const INTENSITY_MULTIPLIER: Record<string, number> = {
  soft: 0.5,
  magical: 1,
  cinematic: 1.3,
  explosive: 2,
};

export function FunPartyTemplate({ surprise, onEvent }: TemplateProps) {
  const [scene, setScene] = useState<Scene>("intro");
  const [burst, setBurst] = useState(0);
  const advance = (next: Scene) => setScene(next);
  const fireConfetti = () => setBurst((b) => b + 1);
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);

  // Personalization from the "Customize" step — falls back to sensible
  // defaults when the sender skipped these optional fields.
  const accent = surprise.accentColor || TOKENS.coral;
  const displayName = surprise.nickname?.trim() || surprise.recipientName;
  const confettiCount = Math.round(
    80 * (INTENSITY_MULTIPLIER[surprise.animationStyle] ?? 1),
  );

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
        color: TOKENS.ink,
        fontFamily: "var(--font-outfit, sans-serif)",
      }}
    >
      {surprise.hasWatermark && <Watermark />}
      <BalloonField
        colors={[TOKENS.coral, TOKENS.teal, TOKENS.purple, TOKENS.yellow]}
        count={7}
      />
      <ConfettiBurst
        trigger={burst}
        colors={TOKENS.confetti}
        count={confettiCount}
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
            {...bounceIn}
            className="relative flex flex-col items-center"
          >
            <p
              className="mb-4 text-xs font-bold uppercase tracking-[0.3em]"
              style={{ color: TOKENS.purple }}
            >
              a surprise for you!
            </p>
            <p className="max-w-xs text-xl font-medium leading-relaxed">
              Someone made something{" "}
              <span style={{ color: TOKENS.coral }}>super fun</span> for you! 🎉
            </p>
            <button
              onClick={() => {
                advance("gift");
                onEvent?.("opened");
                musicPlayerRef.current?.play();
              }}
              className="mt-8 rounded-full px-8 py-4 text-sm font-bold text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${accent}, ${TOKENS.purple})`,
              }}
            >
              Open My Surprise 🎁
            </button>
          </motion.div>
        )}

        {scene === "gift" && (
          <motion.div key="gift" {...bounceIn} className="relative">
            <GiftBox
              boxColor={TOKENS.coral}
              ribbonColor={TOKENS.yellow}
              glowColor={`radial-gradient(circle, ${TOKENS.yellow}aa, transparent 70%)`}
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
            {...bounceIn}
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
              className="mb-3 text-xs font-bold uppercase tracking-[0.3em]"
              style={{ color: TOKENS.purple }}
            >
              happy birthday
            </p>
            <NameReveal
              name={surprise.recipientName}
              className="text-[16vw] font-extrabold leading-none md:text-6xl"
            />
            <p
              className="mt-4 text-lg font-medium"
              style={{ color: TOKENS.coral }}
            >
              {surprise.recipientAge} looks amazing on you! 🥳
            </p>
          </motion.div>
        )}

        {scene === "photo" && surprise.mainPhotoUrl && (
          <motion.div
            key="photo"
            {...bounceIn}
            className="relative flex flex-col items-center"
          >
            <PhotoReveal
              src={surprise.mainPhotoUrl}
              alt={surprise.recipientName}
              caption={`Today is all about you, ${displayName}! 🎈`}
              frameColor="#FFFFFF"
            />
            <button
              onClick={() => advance("gallery")}
              className="mt-8 rounded-full px-5 py-2 text-sm font-medium text-white"
              style={{ background: TOKENS.teal }}
            >
              Continue
            </button>
          </motion.div>
        )}

        {scene === "gallery" && surprise.memoryPhotos.length > 0 && (
          <motion.div
            key="gallery"
            {...bounceIn}
            className="relative flex flex-col items-center"
            onAnimationComplete={() => onEvent?.("gallery_viewed")}
          >
            <p
              className="mb-6 text-xs font-bold uppercase tracking-[0.3em]"
              style={{ color: TOKENS.purple }}
            >
              a few memories
            </p>
            <MemoryGallery photos={surprise.memoryPhotos} />
            <button
              onClick={() => advance("message")}
              className="mt-8 rounded-full px-5 py-2 text-sm font-medium text-white"
              style={{ background: TOKENS.teal }}
            >
              Continue
            </button>
          </motion.div>
        )}

        {scene === "message" && (
          <motion.div
            key="message"
            {...bounceIn}
            className="relative flex flex-col items-center"
          >
            <div
              className="max-w-md rounded-3xl border-4 p-1"
              style={{ borderColor: TOKENS.yellow }}
            >
              <TypewriterMessage
                message={surprise.birthdayMessage}
                senderName={surprise.senderName}
                onComplete={() => onEvent?.("message_viewed")}
              />
            </div>
            {surprise.specialMemory && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4 max-w-xs text-sm font-medium italic"
                style={{ color: TOKENS.purple }}
              >
                &quot;{surprise.specialMemory}&quot;
              </motion.p>
            )}
            <button
              onClick={() => advance("age")}
              className="mt-6 rounded-full px-5 py-2 text-sm font-medium text-white"
              style={{ background: TOKENS.teal }}
            >
              Continue
            </button>
          </motion.div>
        )}

        {scene === "age" && (
          <motion.div
            key="age"
            {...bounceIn}
            className="relative flex flex-col items-center"
          >
            <p
              className="mb-2 text-xs font-bold uppercase tracking-[0.3em]"
              style={{ color: TOKENS.purple }}
            >
              turning
            </p>
            <AgeReveal
              age={surprise.recipientAge}
              caption={`Let's Party Like It's ${surprise.recipientAge}! 🎊`}
              ringColor={TOKENS.coral}
              trackColor="#FFE0D6"
            />
            <button
              onClick={() => advance("countdown")}
              className="mt-8 rounded-full px-8 py-4 text-sm font-bold text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${accent}, ${TOKENS.purple})`,
              }}
            >
              One More Surprise 🎁
            </button>
          </motion.div>
        )}

        {scene === "countdown" && (
          <SurpriseCountdown
            key="countdown"
            bgColor="#2B2440"
            textColor={TOKENS.yellow}
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
            {...bounceIn}
            className="relative flex flex-col items-center"
          >
            <h1
              className="text-4xl font-extrabold"
              style={{ color: TOKENS.coral }}
            >
              Happy Birthday, {surprise.recipientName}! 🎂
            </h1>
            <h3
              className="mt-2 text-2xl font-medium"
              style={{ color: TOKENS.purple }}
            >
              You deserve all the happiness in the world!
            </h3>
            {surprise.quote && (
              <p
                className="mt-4 max-w-xs text-lg font-medium italic"
                style={{ color: TOKENS.coral }}
              >
                {surprise.quote}
              </p>
            )}
            {surprise.insideJoke && (
              <p className="mt-2 text-xs opacity-70">
                ...and yes, we still remember &quot;{surprise.insideJoke}&quot;
                😄
              </p>
            )}
            <p className="mt-6 text-xs opacity-70">
              Made specially for you by {surprise.senderName}
            </p>
            <button
              onClick={() => advance("intro")}
              className="mt-7 rounded-full px-6 py-2.5 text-xs font-medium text-white"
              style={{ background: TOKENS.teal }}
            >
              Replay Surprise 🔄
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/*"use client";

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
import { BalloonField } from "@/components/birthday/BalloonField";
import { HeroCake } from "../marketing/HeroCake";
import { useRef } from "react";
import {
  MusicPlayer,
  type MusicPlayerHandle,
} from "@/components/birthday/MusicPlayer";
import { FireworksText } from "../birthday/FireworksText";

// ---- Fun Party token system ----
const TOKENS = {
  bg: "linear-gradient(160deg, #FFF4E0 0%, #FFE8EE 45%, #E6F7F5 100%)",
  coral: "#FF7A59",
  teal: "#2FBFB0",
  purple: "#7C5CFC",
  yellow: "#FFC93C",
  ink: "#2B2440",
  confetti: ["#FF7A59", "#2FBFB0", "#7C5CFC", "#FFC93C", "#FF5C8A"],
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

const bounceIn = {
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] },
};

export function FunPartyTemplate({ surprise, onEvent }: TemplateProps) {
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
        color: TOKENS.ink,
        fontFamily: "var(--font-outfit, sans-serif)",
      }}
    >
      <BalloonField
        colors={[TOKENS.coral, TOKENS.teal, TOKENS.purple, TOKENS.yellow]}
        count={7}
      />
      {/*<FireworksText
        colors={["#ff6b9d", "#4ecdc4", "#ffe66d", "#a29bfe", "#ff9f43"]}
      />/}
      <ConfettiBurst trigger={burst} colors={TOKENS.confetti} count={80} />
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
            {...bounceIn}
            className="relative flex flex-col items-center"
          >
            <p
              className="mb-4 text-xs font-bold uppercase tracking-[0.3em]"
              style={{ color: TOKENS.purple }}
            >
              a surprise for you!
            </p>
            <p className="max-w-xs text-xl font-medium leading-relaxed">
              Someone made something{" "}
              <span style={{ color: TOKENS.coral }}>super fun</span> for you! 🎉
            </p>
            <button
              onClick={() => {
                advance("gift");
                onEvent?.("opened");
                musicPlayerRef.current?.play();
              }}
              className="mt-8 rounded-full px-8 py-4 text-sm font-bold text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${TOKENS.coral}, ${TOKENS.purple})`,
              }}
            >
              Open My Surprise 🎁
            </button>
          </motion.div>
        )}

        {scene === "gift" && (
          <motion.div key="gift" {...bounceIn} className="relative">
            <GiftBox
              boxColor={TOKENS.coral}
              ribbonColor={TOKENS.yellow}
              glowColor={`radial-gradient(circle, ${TOKENS.yellow}aa, transparent 70%)`}
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
            {...bounceIn}
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
              className="mb-3 text-xs font-bold uppercase tracking-[0.3em]"
              style={{ color: TOKENS.purple }}
            >
              happy birthday
            </p>
            <NameReveal
              name={surprise.recipientName}
              className="text-[16vw] font-extrabold leading-none md:text-6xl"
            />
            <p
              className="mt-4 text-lg font-medium"
              style={{ color: TOKENS.coral }}
            >
              {surprise.recipientAge} looks amazing on you! 🥳
            </p>
          </motion.div>
        )}

        {scene === "photo" && surprise.mainPhotoUrl && (
          <motion.div
            key="photo"
            {...bounceIn}
            className="relative flex flex-col items-center"
          >
            <PhotoReveal
              src={surprise.mainPhotoUrl}
              alt={surprise.recipientName}
              caption={`Today is all about you, ${surprise.recipientName}! 🎈`}
              frameColor="#FFFFFF"
            />
            <button
              onClick={() => advance("gallery")}
              className="mt-8 rounded-full px-5 py-2 text-sm font-medium text-white"
              style={{ background: TOKENS.teal }}
            >
              Continue
            </button>
          </motion.div>
        )}

        {scene === "gallery" && surprise.memoryPhotos.length > 0 && (
          <motion.div
            key="gallery"
            {...bounceIn}
            className="relative flex flex-col items-center"
            onAnimationComplete={() => onEvent?.("gallery_viewed")}
          >
            <p
              className="mb-6 text-xs font-bold uppercase tracking-[0.3em]"
              style={{ color: TOKENS.purple }}
            >
              a few memories
            </p>
            <MemoryGallery photos={surprise.memoryPhotos} />
            <button
              onClick={() => advance("message")}
              className="mt-8 rounded-full px-5 py-2 text-sm font-medium text-white"
              style={{ background: TOKENS.teal }}
            >
              Continue
            </button>
          </motion.div>
        )}

        {scene === "message" && (
          <motion.div
            key="message"
            {...bounceIn}
            className="relative flex flex-col items-center"
          >
            <div
              className="max-w-md rounded-3xl border-4 p-1"
              style={{ borderColor: TOKENS.yellow }}
            >
              <TypewriterMessage
                message={surprise.birthdayMessage}
                senderName={surprise.senderName}
                onComplete={() => onEvent?.("message_viewed")}
              />
            </div>
            <button
              onClick={() => advance("age")}
              className="mt-6 rounded-full px-5 py-2 text-sm font-medium text-white"
              style={{ background: TOKENS.teal }}
            >
              Continue
            </button>
          </motion.div>
        )}

        {scene === "age" && (
          <motion.div
            key="age"
            {...bounceIn}
            className="relative flex flex-col items-center"
          >
            <p
              className="mb-2 text-xs font-bold uppercase tracking-[0.3em]"
              style={{ color: TOKENS.purple }}
            >
              turning
            </p>
            <AgeReveal
              age={surprise.recipientAge}
              caption={`Let's Party Like It's ${surprise.recipientAge}! 🎊`}
              ringColor={TOKENS.coral}
              trackColor="#FFE0D6"
            />
            <button
              onClick={() => advance("countdown")}
              className="mt-8 rounded-full px-8 py-4 text-sm font-bold text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${TOKENS.coral}, ${TOKENS.purple})`,
              }}
            >
              One More Surprise 🎁
            </button>
          </motion.div>
        )}

        {scene === "countdown" && (
          <SurpriseCountdown
            key="countdown"
            bgColor="#2B2440"
            textColor={TOKENS.yellow}
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
            {...bounceIn}
            className="relative flex flex-col items-center"
          >
            <h1
              className="text-4xl font-extrabold"
              style={{ color: TOKENS.coral }}
            >
              Happy Birthday, {surprise.recipientName}! 🎂
            </h1>
            <h3
              className="mt-2 text-2xl font-medium"
              style={{ color: TOKENS.purple }}
            >
              You deserve all the happiness in the world!
            </h3>
            <p className="mt-6 text-xs opacity-70">
              Made specially for you by {surprise.senderName}
            </p>
            <button
              onClick={() => advance("intro")}
              className="mt-7 rounded-full px-6 py-2.5 text-xs font-medium text-white"
              style={{ background: TOKENS.teal }}
            >
              Replay Surprise 🔄
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}*/
