"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

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
      className="flex items-center gap-1 rounded-full border px-3 py-2 text-xs font-medium transition hover:opacity-80"
      style={{ borderColor: "rgba(184,38,90,0.3)", color: "#B8265A" }}
    >
      <LogOut size={14} /> Sign out
    </button>
  );
}
