import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const EDITABLE_FIELDS = [
  "recipient_name",
  "recipient_age",
  "relationship",
  "nickname",
  "sender_name",
  "main_photo_url",
  "memory_photos",
  "birthday_message",
  "special_memory",
  "inside_joke",
  "quote",
  "music_url",
  "music_type",
  "accent_color",
  "animation_style",
  "has_watermark",
] as const;

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const body = await req.json();
  const updates: Record<string, unknown> = {};
  for (const key of EDITABLE_FIELDS) {
    const camel = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    if (camel in body) updates[key] = body[camel];
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No editable fields provided." },
      { status: 400 },
    );
  }

  // RLS (`creator_id = auth.uid()`) is the real authorization boundary here —
  // this .eq("creator_id", user.id) is defense in depth, not the only check.
  const { error } = await supabase
    .from("birthday_surprises")
    .update(updates)
    .eq("id", id)
    .eq("creator_id", user.id);

  if (error) {
    return NextResponse.json(
      { error: "Could not update the surprise." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { error } = await supabase
    .from("birthday_surprises")
    .delete()
    .eq("id", id)
    .eq("creator_id", user.id);

  if (error) {
    return NextResponse.json(
      { error: "Could not delete the surprise." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
