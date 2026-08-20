import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getImageKitAuthParams } from "@/lib/imagekit";

/**
 * Must be signed in to request an upload signature — this is the one gate
 * that stops an anonymous visitor from using our ImageKit account as free
 * file storage. The signature itself is single-use and expires in 10 min.
 */
export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    const auth = getImageKitAuthParams();
    return NextResponse.json(auth);
  } catch {
    return NextResponse.json({ error: "Upload is not configured" }, { status: 500 });
  }
}
