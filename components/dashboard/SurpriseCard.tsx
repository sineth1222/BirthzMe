"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SurpriseCardProps {
  id: string;
  slug: string;
  recipientName: string;
  recipientAge: number;
  template: string;
  status: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  draft: "#B79AA5",
  published: "#7A5766",
  opened: "#E3B583",
  celebrated: "#B8265A",
};

export function SurpriseCard({
  id,
  slug,
  recipientName,
  recipientAge,
  template,
  status,
  createdAt,
}: SurpriseCardProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const link = `${typeof window !== "undefined" ? window.location.origin : ""}/birthday/${slug}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDelete = async () => {
    if (
      !confirm(
        `Delete the surprise for ${recipientName}? This can't be undone.`,
      )
    )
      return;
    setDeleting(true);
    const res = await fetch(`/api/birthday/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      setDeleting(false);
      alert("Could not delete the surprise. Try again.");
    }
  };

  return (
    <div
      className="flex flex-col gap-3 rounded-2xl border p-4 transition hover:shadow-md"
      style={{ borderColor: "rgba(122,87,102,0.15)" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-serif text-lg" style={{ color: "#3A2430" }}>
            {recipientName}, {recipientAge}
          </p>
          <p className="text-xs opacity-60">
            {template} · {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-[10px] font-medium uppercase text-white"
          style={{ background: STATUS_COLORS[status] ?? "#7A5766" }}
        >
          {status}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <Link
          href={`/birthday/${slug}`}
          className="rounded-full border px-3 py-1.5"
          style={{ borderColor: "rgba(122,87,102,0.25)", color: "#3A2430" }}
        >
          Preview
        </Link>
        <button
          onClick={copyLink}
          className="rounded-full border px-3 py-1.5"
          style={{ borderColor: "rgba(122,87,102,0.25)", color: "#3A2430" }}
        >
          {copied ? "Copied ✓" : "Copy Link"}
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`🎁 A birthday surprise for you: ${link}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full px-3 py-1.5 text-white"
          style={{ background: "#25D366" }}
        >
          Share
        </a>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-full border px-3 py-1.5"
          style={{ borderColor: "rgba(184,38,90,0.3)", color: "#B8265A" }}
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
