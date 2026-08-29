"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Copy, Clock, Send, MailOpen, Cake, Trash2 } from "lucide-react";

interface SurpriseCardProps {
  id: string;
  slug: string;
  recipientName: string;
  recipientAge: number;
  template: string;
  status: string;
  createdAt: string;
}

const STATUS_BADGE: Record<string, { label: string; icon: React.ReactNode }> = {
  draft: { label: "Draft", icon: <Clock size={12} /> },
  published: { label: "Sent", icon: <Send size={12} /> },
  opened: { label: "Opened", icon: <MailOpen size={12} /> },
  celebrated: { label: "Celebrated", icon: <Cake size={12} /> },
};

const STATUS_STYLE: Record<string, React.CSSProperties> = {
  draft: { background: "#EDEDED", color: "#6B6B6B" },
  published: { background: "#FCE4E8", color: "#B8265A" },
  opened: { background: "rgba(184,38,90,0.18)", color: "#7C1638" },
  celebrated: { background: "#B8265A", color: "#fff" },
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

  const badge = STATUS_BADGE[status] ?? STATUS_BADGE.draft;
  const badgeStyle = STATUS_STYLE[status] ?? STATUS_STYLE.draft;

  const copy = async () => {
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
    if (res.ok) router.refresh();
    else {
      setDeleting(false);
      alert("Could not delete. Try again.");
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl border p-5 transition hover:shadow-md"
      style={{
        borderColor: "rgba(184,38,90,0.15)",
        background: "rgba(255,255,255,0.6)",
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className="font-serif text-lg font-semibold"
            style={{ color: "#3A2430" }}
          >
            {recipientName}, {recipientAge}
          </p>
          <p
            className="text-xs capitalize"
            style={{ color: "#7A5766", opacity: 0.7 }}
          >
            {template.replace("-", " ")} ·{" "}
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>

        <span
          className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
          style={badgeStyle}
        >
          {badge.icon} {badge.label}
        </span>
      </div>

      <div
        className="mt-4 flex items-center gap-2 rounded-xl border px-3 py-2"
        style={{ borderColor: "rgba(184,38,90,0.2)", background: "#FDF3EF" }}
      >
        <span
          className="flex-1 truncate text-xs"
          style={{ color: "#3A2430", opacity: 0.7 }}
        >
          {link}
        </span>
        <button
          onClick={copy}
          aria-label="Copy link"
          style={{ color: "#B8265A" }}
        >
          <Copy size={14} />
        </button>
      </div>
      {copied && (
        <p className="mt-1 text-xs" style={{ color: "#B8265A" }}>
          Copied!
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <Link
          href={`/birthday/${slug}`}
          className="rounded-full border px-3 py-1.5"
          style={{ borderColor: "rgba(184,38,90,0.25)", color: "#3A2430" }}
        >
          Preview
        </Link>
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
          className="flex items-center gap-1 rounded-full border px-3 py-1.5"
          style={{ borderColor: "rgba(184,38,90,0.3)", color: "#B8265A" }}
        >
          <Trash2 size={12} /> {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
