"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="rounded-full px-5 py-2.5 text-xs font-medium text-white"
      style={{ background: "linear-gradient(135deg,#B8265A,#7C1638)" }}
    >
      Sign out
    </button>
  );
}
