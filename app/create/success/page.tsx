import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { ShareButtons } from "@/components/shared/ShareButtons";
import { ChevronLeft } from "lucide-react";

interface SuccessPageProps {
  searchParams: Promise<{ slug?: string }>;
}

export default async function CreateSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { slug } = await searchParams;
  if (!slug) notFound();

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: surprise } = await supabase
    .from("birthday_surprises")
    .select("recipient_name, creator_id")
    .eq("slug", slug)
    .single();

  // Only the creator gets to see their own success/share screen.
  if (!surprise || !user || surprise.creator_id !== user.id) notFound();

  const link =
    (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000") +
    `/birthday/${slug}`;

  return (
    <main
      className="flex font-display min-h-screen flex-col items-center justify-center px-6 py-12 text-center"
      style={{
        background:
          "radial-gradient(ellipse at 50% -10%, #FCE4E8 0%, #FDF3EF 55%, #F8E9E2 100%)",
      }}
    >
      <h1 className="font-serif text-3xl" style={{ color: "#3A2430" }}>
        Your Birthday Surprise Is Ready! 🎉
      </h1>
      <p className="mt-2 mb-8 text-sm" style={{ color: "#7A5766" }}>
        For {surprise.recipient_name} — share this link whenever you&apos;re
        ready.
      </p>

      <ShareButtons link={link} recipientName={surprise.recipient_name} />

      <div className="mt-10 flex gap-4 text-xs">
        <Link
          href={`/birthday/${slug}`}
          className="flex items-center gap-1 hover:bg-gray-100 rounded-lg"
          style={{ color: "#7C1638" }}
        >
          <ChevronLeft size={16} /> Open Preview
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center gap-1 hover:bg-gray-100 rounded-lg"
          style={{ color: "#7A5766" }}
        >
          <ChevronLeft size={16} /> Go to Dashboard
        </Link>
      </div>
    </main>
  );
}
