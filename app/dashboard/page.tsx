import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { SurpriseCard } from "@/components/dashboard/SurpriseCard";
import { SignOutButton } from "@/components/dashboard/SignOutButton";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?next=/dashboard");

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
      className="min-h-screen px-5 py-10"
      style={{
        background:
          "radial-gradient(ellipse at 50% -10%, #FCE4E8 0%, #FDF3EF 55%, #F8E9E2 100%)",
      }}
    >
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex flex-wrap gap-5 items-center justify-between">
          <h1 className="font-serif text-2xl" style={{ color: "#3A2430" }}>
            My Birthday Surprises
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/create"
              className="rounded-full px-5 py-2.5 text-xs font-medium text-white"
              style={{ background: "linear-gradient(135deg,#B8265A,#7C1638)" }}
            >
              + New Surprise
            </Link>
            <SignOutButton />
          </div>
        </div>

        {!surprises || surprises.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <p style={{ color: "#7A5766" }}>No birthday surprises yet.</p>
            <Link
              href="/create"
              className="rounded-full px-6 py-3 text-sm font-medium text-white"
              style={{ background: "linear-gradient(135deg,#B8265A,#7C1638)" }}
            >
              Create Your First Surprise 🎁
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {surprises.map((s) => (
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
        )}
      </div>
    </main>
  );
}
