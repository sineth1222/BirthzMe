import { createBrowserClient } from "@supabase/ssr";

// Public anon key only — safe for the browser bundle. Never put the
// service-role key behind NEXT_PUBLIC_*.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
