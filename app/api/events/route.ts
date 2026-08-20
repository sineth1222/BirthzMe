import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";

const VALID_EVENTS = new Set([
  "opened",
  "music_started",
  "gift_opened",
  "birthday_revealed",
  "gallery_viewed",
  "message_viewed",
  "surprise_completed",
]);

/**
 * Recipients have no account, so this write can't go through a
 * user-scoped RLS session — it uses the service client deliberately,
 * but ONLY to insert an event row and (for "opened"/"surprise_completed")
 * bump a timestamp column. It never returns surprise content, so it can't
 * be used to read someone else's private data.
 */
export async function POST(req: NextRequest) {
  let body: { surpriseId?: string; eventType?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { surpriseId, eventType } = body;

  if (!surpriseId || !eventType || !VALID_EVENTS.has(eventType)) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  const supabase = createServiceSupabase();

  const { error: insertError } = await supabase
    .from("birthday_events")
    .insert({ surprise_id: surpriseId, event_type: eventType });

  if (insertError) {
    return NextResponse.json({ error: "Could not record event" }, { status: 500 });
  }

  if (eventType === "opened") {
    await supabase
      .from("birthday_surprises")
      .update({ status: "opened", opened_at: new Date().toISOString() })
      .eq("id", surpriseId)
      .eq("status", "published"); // don't downgrade an already-celebrated surprise
  }

  if (eventType === "surprise_completed") {
    await supabase
      .from("birthday_surprises")
      .update({ status: "celebrated", completed_at: new Date().toISOString() })
      .eq("id", surpriseId);
  }

  return NextResponse.json({ ok: true });
}
