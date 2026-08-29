import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { SurpriseCard } from "@/components/dashboard/SurpriseCard";
import { SignOutButton } from "@/components/dashboard/SignOutButton";
import { Plus } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .single();

  // RLS's "creators can select own surprises" policy is what actually
  // scopes this — the .eq below is belt-and-suspenders.
  const { data: surprises } = await supabase
    .from("birthday_surprises")
    .select(
      "id, slug, recipient_name, recipient_age, template, status, created_at",
    )
    .eq("creator_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main
      className="relative min-h-screen px-4 py-10"
      style={{
        background:
          "radial-gradient(ellipse at 50% -10%, #FCE4E8 0%, #FDF3EF 55%, #F8E9E2 100%)",
      }}
    >
      {/* background logo watermark */}
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
        <img
          src="/images/logo1.png"
          alt=""
          style={{
            width: 380,
            height: 380,
            opacity: 0.1,
            filter: "blur(0.5px)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-xs uppercase tracking-widest"
              style={{ color: "#7A5766", opacity: 0.7 }}
            >
              Dashboard
            </p>
            <h1
              className="font-serif text-3xl font-bold"
              style={{ color: "#3A2430" }}
            >
              Hi {profile?.name || "there"} 👋
            </h1>
          </div>
          <SignOutButton />
        </div>

        <Link
          href="/create"
          className="mt-6 flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg,#B8265A,#7C1638)" }}
        >
          <Plus size={18} /> Create a new surprise
        </Link>

        <div className="mt-8 space-y-4">
          {(!surprises || surprises.length === 0) && (
            <p
              className="rounded-2xl border border-dashed p-8 text-center text-sm"
              style={{ borderColor: "rgba(184,38,90,0.3)", color: "#7A5766" }}
            >
              No birthday surprises yet. Create your first one above 🎁
            </p>
          )}
          {surprises?.map((s) => (
            <SurpriseCard
              key={s.id}
              id={s.id}
              slug={s.slug}
              recipientName={s.recipient_name}
              recipientAge={s.recipient_age}
              template={s.template}
              status={s.status}
              createdAt={s.created_at}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
