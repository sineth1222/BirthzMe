import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";

/**
 * Pings the database with a trivial query so Supabase's free-tier
 * auto-pause (triggered after 7 days with zero API requests) never
 * kicks in. Accepts the secret either as a header (the method Vercel's
 * own Cron Jobs use automatically) or as a query param (what external
 * services like GitHub Actions / cron-job.org can actually set) — both
 * are checked against the same CRON_SECRET env var.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const querySecret = req.nextUrl.searchParams.get("secret");

  const validHeader = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  const validQuery =
    !!process.env.CRON_SECRET && querySecret === process.env.CRON_SECRET;

  // TEMPORARY — remove after debugging. Never returns the actual secret,
  // only its length and first/last 2 chars, so you can compare against
  // what you're testing with without exposing the real value.
  if (req.nextUrl.searchParams.get("debug") === "1") {
    const s = process.env.CRON_SECRET ?? "";
    return NextResponse.json({
      serverSecretLength: s.length,
      serverSecretPreview:
        s.length > 4 ? `${s.slice(0, 2)}...${s.slice(-2)}` : null,
      querySecretLength: (querySecret ?? "").length,
      querySecretPreview:
        querySecret && querySecret.length > 4
          ? `${querySecret.slice(0, 2)}...${querySecret.slice(-2)}`
          : null,
    });
  }

  if (!validHeader && !validQuery) {
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
