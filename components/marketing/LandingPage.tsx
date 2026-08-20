"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BalloonField } from "@/components/birthday/BalloonField";
import { InstallAppSection } from "@/components/shared/InstallAppSection";
import { HeroCake } from "@/components/marketing/HeroCake";
import { FireworksField } from "../birthday/FireworksField";
import { FireworksNomal } from "../birthday/FireWorksNomal";

const STEPS = [
  {
    title: "Choose a design",
    desc: "Pick from three completely different birthday experiences.",
  },
  {
    title: "Personalize the surprise",
    desc: "Add their photo, your message, and a song that fits the moment.",
  },
  {
    title: "Share the link",
    desc: "One private link — no app, no account needed on their end.",
  },
  {
    title: "Watch them smile ❤️",
    desc: "They open it whenever they're ready, from any phone.",
  },
];

const TEMPLATE_PREVIEWS = [
  {
    name: "Dreamy Pink",
    desc: "Romantic, soft, pastel — hearts and petals.",
    swatch: "linear-gradient(135deg,#F6DDE0,#B8265A)",
  },
  {
    name: "Cinematic Gold",
    desc: "Luxury, dark, spotlight-and-glitter.",
    swatch: "linear-gradient(135deg,#1B1330,#E3B583)",
  },
  {
    name: "Fun Party",
    desc: "Energetic, colorful, confetti-fueled.",
    swatch: "linear-gradient(135deg,#FF7A59,#2FBFB0)",
  },
];

const WHY = [
  "Personalized to them, not a generic template",
  "Cinematic, interactive animations",
  "Their photo and your voice, front and center",
  "Music that sets the mood",
  "One private link — nothing to install for them",
  "Built mobile-first, looks great on desktop too",
];

export default function LandingPage() {
  return (
    <main
      style={{ fontFamily: "var(--font-outfit, sans-serif)", color: "#3A2430" }}
    >
      {/* HERO */}
      <section
        className="relative overflow-hidden px-4 py-16 sm:py-20 md:py-28"
        style={{
          background:
            "radial-gradient(ellipse at 50% -10%, #FCE4E8 0%, #FDF3EF 55%, #F8E9E2 100%)",
        }}
      >
        <FireworksField
          colors={["#ff6b6b", "#feca57", "#48dbfb", "#1dd1a1", "#f368e0"]}
          count={4}
        />
        <FireworksNomal
          colors={["#ff6b6b", "#feca57", "#48dbfb", "#1dd1a1", "#f368e0"]}
          count={2}
        />
        <BalloonField colors={["#B8265A", "#E3B583", "#F6DDE0"]} count={5} />

        {/* soft watermark cake behind the copy, echoes the hero centerpiece at low opacity */}
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
          <span style={{ fontSize: 420, opacity: 0.05, filter: "blur(1px)" }}>
            🎂
          </span>
        </div>

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-5 text-center md:flex-row md:gap-14 md:text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <HeroCake />
          </motion.div>

          <div className="flex-1 px-2 md:px-0">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4 inline-block font-script rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-widest"
              style={{
                borderColor: "rgba(184,38,90,0.3)",
                background: "rgba(255,255,255,0.6)",
                color: "#7C1638",
              }}
            >
              Made for someone special
            </motion.p>

            {/* ── Background logo watermark ── /}
            <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none overflow-hidden">
              <div
                style={{
                  width: "380px",
                  height: "380px",
                  opacity: 0.12, // 👈 0.035 වෙනුවට 0.10 - 0.15 අතර අගයක් දාලා බලන්න
                  filter: "blur(0.5px)",
                  transition: "all 0.9s ease",
                }}
              >
                <img
                  src="/images/logo1.png"
                  alt="Icon"
                  style={{
                    width: "380px",
                    height: "380px",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>*/}

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="font-display text-4xl font-extrabold leading-tight text-wine sm:text-5xl"
            >
              BirthzMe.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-1 font-scriptnew text-2xl italic"
              style={{ color: "#B8265A" }}
            >
              Make Their Birthday Unforgettable.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mx-auto font-scriptnew mt-4 max-w-md text-base leading-relaxed md:mx-0"
              style={{ color: "#7A5766" }}
            >
              Design a cinematic, animated birthday surprise complete with their
              photo, your voice, and a song that fits the moment — then send it
              straight to their phone with one private link.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start"
            >
              <Link
                href="/create"
                className="w-full rounded-full font-display px-8 py-4 text-sm font-semibold text-white shadow-lg transition hover:scale-105 sm:w-auto"
                style={{
                  background: "linear-gradient(135deg,#B8265A,#7C1638)",
                }}
              >
                Create a Birthday Surprise 🎁
              </Link>
              <a
                href="#how-it-works"
                className="w-full rounded-full font-display border px-8 py-4 text-sm transition hover:scale-105 sm:w-auto"
                style={{
                  borderColor: "rgba(122,87,102,0.3)",
                  color: "#7A5766",
                }}
              >
                See How It Works
              </a>
            </motion.div>
            <p
              className="mt-3 text-xs font-display"
              style={{ color: "rgba(122,87,102,0.7)" }}
            >
              One click to sign in just your email, no password to remember.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="mx-auto max-w-3xl px-6 py-20">
        <p
          className="mb-3 text-center font-display text-xs font-semibold uppercase tracking-widest"
          style={{ color: "#B8265A" }}
        >
          Simple by design
        </p>
        <h2 className="mb-10 text-center font-serif text-3xl">How It Works</h2>
        <div className="grid gap-6 sm:grid-cols-2 ">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="flex gap-4 rounded-2xl border p-5 transition hover:shadow-md"
              style={{ borderColor: "rgba(122,87,102,0.15)" }}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-serif text-sm text-white"
                style={{
                  background: "linear-gradient(135deg,#B8265A,#7C1638)",
                }}
              >
                {i + 1}
              </div>
              <div>
                <p className="font-medium font-display">{s.title}</p>
                <p
                  className="mt-1 text-sm font-scriptnew"
                  style={{ color: "#7A5766" }}
                >
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TEMPLATES */}
      <section className="px-6 py-20" style={{ background: "#FBF6F2" }}>
        <div className="mx-auto max-w-4xl">
          <p
            className="mb-3 text-center text-xs font-semibold uppercase tracking-widest"
            style={{ color: "#B8265A" }}
          >
            Three moods, one moment
          </p>
          <h2 className="mb-10 text-center font-serif text-3xl">
            Birthday Templates
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {TEMPLATE_PREVIEWS.map((t) => (
              <div
                key={t.name}
                className="overflow-hidden font-display rounded-2xl border transition hover:-translate-y-1 hover:shadow-lg"
                style={{ borderColor: "rgba(122,87,102,0.15)" }}
              >
                <div className="h-32" style={{ background: t.swatch }} />
                <div className="p-4">
                  <p className="font-medium">{t.name}</p>
                  <p
                    className="mt-1 text-xs font-scriptnew"
                    style={{ color: "#7A5766" }}
                  >
                    {t.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <p
          className="mb-3 text-center text-xs font-semibold uppercase tracking-widest"
          style={{ color: "#B8265A" }}
        >
          The little things
        </p>
        <h2 className="mb-10 text-center font-serif text-3xl">Why BirthzMe?</h2>
        <div className="grid gap-3 font-scriptnew sm:grid-cols-2">
          {WHY.map((w) => (
            <div
              key={w}
              className="flex items-center gap-2.5 text-sm"
              style={{ color: "#3A2430" }}
            >
              <span style={{ color: "#B8265A" }}>✦</span> {w}
            </div>
          ))}
        </div>
      </section>

      {/* INSTALL */}
      <section className="px-6 pb-6">
        <InstallAppSection />
      </section>

      {/* FINAL CTA */}
      <section
        className="flex flex-col items-center justify-center px-6 py-24 text-center"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, #FCE4E8 0%, #FDF3EF 60%, #F8E9E2 100%)",
        }}
      >
        <h2 className="font-serif text-3xl">
          Make someone&apos;s birthday unforgettable.
        </h2>
        <Link
          href="/create"
          className="mt-7 rounded-full px-8 py-4 text-sm font-display font-medium text-white shadow-lg transition hover:scale-105"
          style={{ background: "linear-gradient(135deg,#B8265A,#7C1638)" }}
        >
          Create Their Surprise 🎂
        </Link>
        <Link
          href="/dashboard"
          className="mt-5 text-xs font-display"
          style={{ color: "#7A5766" }}
        >
          Already have surprises? Go to your dashboard
        </Link>
      </section>

      <footer
        className="px-4 py-10 text-center text-xs"
        style={{ color: "rgba(122,87,102,0.5)" }}
      >
        BirthzMe · Make their day unforgettable 🎂
      </footer>
    </main>
  );
}
