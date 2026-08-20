import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { buildUniqueSlug } from "@/lib/slug";

/**
 * Creates a new birthday_surprises row for the signed-in user. Uses the
 * session-scoped Supabase client (not the service client) so RLS's
 * `creator_id = auth.uid()` check does the authorization work — this
 * route can't be used to write a surprise on someone else's behalf even
 * if the request body lies about creatorId.
 */
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const body = await req.json();

  const recipientName = String(body.recipientName ?? "").trim();
  const recipientAge = Number(body.recipientAge);
  const senderName = String(body.senderName ?? "").trim();
  const birthdayMessage = String(body.birthdayMessage ?? "").trim();
  const template = ["dreamy-pink", "cinematic-gold", "fun-party"].includes(body.template)
    ? body.template
    : null;

  if (!recipientName || recipientName.length > 60) {
    return NextResponse.json({ error: "Recipient name is required (max 60 chars)." }, { status: 400 });
  }
  if (!Number.isInteger(recipientAge) || recipientAge < 1 || recipientAge > 130) {
    return NextResponse.json({ error: "Recipient age must be between 1 and 130." }, { status: 400 });
  }
  if (!senderName || senderName.length > 60) {
    return NextResponse.json({ error: "Your name is required (max 60 chars)." }, { status: 400 });
  }
  if (!birthdayMessage || birthdayMessage.length > 2000) {
    return NextResponse.json({ error: "A birthday message is required (max 2000 chars)." }, { status: 400 });
  }
  if (!template) {
    return NextResponse.json({ error: "Please choose a valid template." }, { status: 400 });
  }

  const slug = await buildUniqueSlug(recipientName, recipientAge, async (candidate) => {
    const { data } = await supabase
      .from("birthday_surprises")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    return !!data;
  });

  const { data, error } = await supabase
    .from("birthday_surprises")
    .insert({
      creator_id: user.id,
      slug,
      recipient_name: recipientName,
      recipient_age: recipientAge,
      relationship: body.relationship || null,
      nickname: body.nickname || null,
      sender_name: senderName,
      template,
      main_photo_url: body.mainPhotoUrl || null,
      memory_photos: body.memoryPhotos ?? [],
      birthday_message: birthdayMessage,
      special_memory: body.specialMemory || null,
      inside_joke: body.insideJoke || null,
      quote: body.quote || null,
      music_url: body.musicUrl || null,
      music_type: body.musicType || null,
      accent_color: body.accentColor || null,
      animation_style: body.animationStyle || "magical",
      status: "published",
    })
    .select("slug")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Could not create the surprise." }, { status: 500 });
  }

  return NextResponse.json({ slug: data.slug });
}
