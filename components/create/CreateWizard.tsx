"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressIndicator } from "@/components/shared/ProgressIndicator";
import { TemplateSelector } from "@/components/create/TemplateSelector";
import { BirthdayPersonForm } from "@/components/create/BirthdayPersonForm";
import { PhotoUploader } from "@/components/create/PhotoUploader";
import { MessageEditor } from "@/components/create/MessageEditor";
import { MusicSelector } from "@/components/create/MusicSelector";
import { CustomizationForm } from "@/components/create/CustomizationForm";
import { DreamyPinkTemplate } from "@/components/templates/DreamyPinkTemplate";
import { CinematicGoldTemplate } from "@/components/templates/CinematicGoldTemplate";
import { FunPartyTemplate } from "@/components/templates/FunPartyTemplate";
import type {
  AnimationIntensity,
  BirthdaySurprise,
  BirthdayTemplate,
  MemoryPhoto,
} from "@/types/birthday";
import { ChevronLeft } from "lucide-react";

const STEP_LABELS = [
  "Template",
  "Person",
  "Photos",
  "Message",
  "Music",
  "Customize",
  "Preview",
];

interface Draft {
  template: BirthdayTemplate;
  recipientName: string;
  recipientAge: number | "";
  relationship: string;
  senderName: string;
  mainPhotoUrl: string | null;
  memoryPhotos: MemoryPhoto[];
  birthdayMessage: string;
  musicUrl: string | null;
  musicType: "builtin" | "custom" | null;
  animationStyle: AnimationIntensity;
  accentColor: string;
  nickname: string;
  specialMemory: string;
  insideJoke: string;
  quote: string;
}

const EMPTY_DRAFT: Draft = {
  template: "dreamy-pink",
  recipientName: "",
  recipientAge: "",
  relationship: "",
  senderName: "",
  mainPhotoUrl: null,
  memoryPhotos: [],
  birthdayMessage: "",
  musicUrl: null,
  musicType: null,
  animationStyle: "magical",
  accentColor: "#B8265A",
  nickname: "",
  specialMemory: "",
  insideJoke: "",
  quote: "",
};

export function CreateWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canAdvance = () => {
    switch (step) {
      case 0:
        return !!draft.template;
      case 1:
        return (
          draft.recipientName.trim() &&
          draft.recipientAge &&
          draft.senderName.trim()
        );
      case 3:
        return draft.birthdayMessage.trim().length > 0;
      default:
        return true;
    }
  };

  const next = () =>
    canAdvance() && setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleCreate = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/birthday", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          recipientAge: Number(draft.recipientAge),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      router.push(`/create/success?slug=${data.slug}`);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  // Build a preview object matching TemplateProps even before the row exists.
  const previewSurprise: BirthdaySurprise = {
    id: "preview",
    creatorId: "preview",
    slug: "preview",
    recipientName: draft.recipientName || "Someone",
    recipientAge: Number(draft.recipientAge) || 0,
    relationship: draft.relationship || undefined,
    nickname: draft.nickname || undefined,
    senderName: draft.senderName || "Someone",
    template: draft.template,
    mainPhotoUrl: draft.mainPhotoUrl,
    memoryPhotos: draft.memoryPhotos,
    birthdayMessage: draft.birthdayMessage || "Your message will appear here.",
    specialMemory: draft.specialMemory || undefined,
    insideJoke: draft.insideJoke || undefined,
    quote: draft.quote || undefined,
    musicUrl: draft.musicUrl,
    musicType: draft.musicType,
    accentColor: draft.accentColor,
    animationStyle: draft.animationStyle,
    status: "draft",
    createdAt: "",
    updatedAt: "",
  };

  const update = <K extends keyof Draft>(field: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [field]: value }));

  if (step === 6) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto font-display bg-white">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/90 px-5 py-3 backdrop-blur">
          <button
            onClick={back}
            className="text-sm flex items-center gap-1 hover:bg-gray-100 rounded-lg"
            style={{ color: "#7A5766" }}
          >
            <ChevronLeft size={24} className="text-gray-700" /> Edit
          </button>
          <p className="text-sm font-medium" style={{ color: "#3A2430" }}>
            Live Preview
          </p>
          <button
            onClick={handleCreate}
            disabled={submitting}
            className="rounded-full px-5 py-2 text-xs font-medium text-white"
            style={{ background: "linear-gradient(135deg,#B8265A,#7C1638)" }}
          >
            {submitting ? "Creating..." : "Create Birthday Surprise 🎁"}
          </button>
        </div>
        {submitError && (
          <p
            className="px-5 py-2 text-center text-xs"
            style={{ color: "#B8265A" }}
          >
            {submitError}
          </p>
        )}
        {draft.template === "dreamy-pink" && (
          <DreamyPinkTemplate surprise={previewSurprise} />
        )}
        {draft.template === "cinematic-gold" && (
          <CinematicGoldTemplate surprise={previewSurprise} />
        )}
        {draft.template === "fun-party" && (
          <FunPartyTemplate surprise={previewSurprise} />
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto font-display min-h-screen max-w-xl px-5 py-10">
      <h1
        className="mb-1 text-center font-serif text-2xl"
        style={{ color: "#3A2430" }}
      >
        Create a Birthday Surprise 🎁
      </h1>
      <p className="mb-8 text-center text-sm" style={{ color: "#7A5766" }}>
        Step {step + 1} of {STEP_LABELS.length}
      </p>
      <ProgressIndicator steps={STEP_LABELS} currentIndex={step} />

      <div className="mt-6">
        {step === 0 && (
          <TemplateSelector
            value={draft.template}
            onChange={(t) => update("template", t)}
          />
        )}

        {step === 1 && (
          <BirthdayPersonForm
            recipientName={draft.recipientName}
            recipientAge={draft.recipientAge}
            relationship={draft.relationship}
            senderName={draft.senderName}
            onChange={(field, value) =>
              update(
                field,
                field === "recipientAge"
                  ? value === ""
                    ? ""
                    : Number(value)
                  : value,
              )
            }
          />
        )}

        {step === 2 && (
          <PhotoUploader
            mainPhotoUrl={draft.mainPhotoUrl}
            memoryPhotos={draft.memoryPhotos}
            onMainPhotoChange={(url) => update("mainPhotoUrl", url)}
            onMemoryPhotosChange={(photos) => update("memoryPhotos", photos)}
          />
        )}

        {step === 3 && (
          <MessageEditor
            message={draft.birthdayMessage}
            onChange={(m) => update("birthdayMessage", m)}
            recipientName={draft.recipientName}
            recipientAge={draft.recipientAge}
            relationship={draft.relationship}
          />
        )}

        {step === 4 && (
          <MusicSelector
            musicUrl={draft.musicUrl}
            musicType={draft.musicType}
            onChange={(url, type) => {
              update("musicUrl", url);
              update("musicType", type);
            }}
          />
        )}

        {step === 5 && (
          <CustomizationForm
            animationStyle={draft.animationStyle}
            accentColor={draft.accentColor}
            nickname={draft.nickname}
            specialMemory={draft.specialMemory}
            insideJoke={draft.insideJoke}
            quote={draft.quote}
            onChange={(field, value) => update(field, value as never)}
          />
        )}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <button
          onClick={back}
          disabled={step === 0}
          className="text-sm disabled:opacity-30"
          style={{ color: "#7A5766" }}
        >
          Back
        </button>
        <button
          onClick={next}
          disabled={!canAdvance()}
          className="rounded-full px-6 py-2.5 text-sm font-medium text-white transition hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
          style={{ background: "linear-gradient(135deg,#B8265A,#7C1638)" }}
        >
          {step === 5 ? "Preview Birthday Surprise" : "Continue"}
        </button>
      </div>
    </div>
  );
}
