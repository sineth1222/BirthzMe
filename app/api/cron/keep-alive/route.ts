import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";

/**
 * Pings the database with a trivial query so Supabase's free-tier
 * auto-pause (triggered after 7 days with zero API requests) never
 * kicks in. Called on a schedule by Vercel Cron (see vercel.json) — not
 * meant to be hit manually or by the public.
 */
export async function GET(req: NextRequest) {
  // Vercel signs cron requests with this header when CRON_SECRET is set
  // in your project's env vars — this stops randoms from hitting the
  // route and stops it from doing anything if called without the secret.
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceSupabase();

  const { error } = await supabase
    .from("birthday_surprises")
    .select("id", { count: "exact", head: true })
    .limit(1);

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, pinged_at: new Date().toISOString() });
}
