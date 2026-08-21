import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import { DreamyPinkTemplate } from "@/components/templates/DreamyPinkTemplate";
import { CinematicGoldTemplate } from "@/components/templates/CinematicGoldTemplate";
import { FunPartyTemplate } from "@/components/templates/FunPartyTemplate";
import { BirthdayEventTracker } from "./event-tracker";
import type { BirthdaySurprise } from "@/types/birthday";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getSurprise(slug: string): Promise<BirthdaySurprise | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("birthday_surprises")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    creatorId: data.creator_id,
    slug: data.slug,
    recipientName: data.recipient_name,
    recipientAge: data.recipient_age,
    relationship: data.relationship ?? undefined,
    nickname: data.nickname ?? undefined,
    senderName: data.sender_name,
    template: data.template,
    mainPhotoUrl: data.main_photo_url,
    memoryPhotos: data.memory_photos ?? [],
    birthdayMessage: data.birthday_message,
    specialMemory: data.special_memory ?? undefined,
    insideJoke: data.inside_joke ?? undefined,
    quote: data.quote ?? undefined,
    musicUrl: data.music_url,
    musicType: data.music_type,
    accentColor: data.accent_color ?? undefined,
    animationStyle: data.animation_style ?? "magical",
    hasWatermark: data.has_watermark ?? true,
    status: data.status,
    openedAt: data.opened_at,
    completedAt: data.completed_at,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const surprise = await getSurprise(slug);
  if (!surprise) {
    return { title: "Surprise not found — BirthzMe" };
  }
  return {
    title: `A Special Birthday Surprise for ${surprise.recipientName} 🎂`,
    description: "Someone created a special birthday surprise just for you.",
    openGraph: {
      title: `A Special Birthday Surprise for ${surprise.recipientName} 🎂`,
      description: "Someone created a special birthday surprise just for you.",
      images: surprise.mainPhotoUrl ? [surprise.mainPhotoUrl] : undefined,
    },
    // Never leak the private message text into shareable metadata.
  };
}

export default async function BirthdayPage({ params }: PageProps) {
  const { slug } = await params;
  const surprise = await getSurprise(slug);

  if (!surprise) notFound();

  return (
    <>
      <BirthdayEventTracker surpriseId={surprise.id} />
      {surprise.template === "dreamy-pink" && (
        <DreamyPinkTemplate surprise={surprise} />
      )}
      {surprise.template === "cinematic-gold" && (
        <CinematicGoldTemplate surprise={surprise} />
      )}
      {surprise.template === "fun-party" && (
        <FunPartyTemplate surprise={surprise} />
      )}
    </>
  );
}
