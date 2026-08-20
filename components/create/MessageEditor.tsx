"use client";

import { useState } from "react";
import {
  MESSAGE_STYLES,
  suggestMessage,
  type MessageStyle,
} from "@/lib/message-presets";

interface MessageEditorProps {
  message: string;
  onChange: (message: string) => void;
  recipientName: string;
  recipientAge: number | "";
  relationship: string;
}

export function MessageEditor({
  message,
  onChange,
  recipientName,
  recipientAge,
  relationship,
}: MessageEditorProps) {
  const [mode, setMode] = useState<"write" | "suggest">("write");

  const applyStyle = (style: MessageStyle) => {
    onChange(
      suggestMessage(
        style,
        recipientName || "them",
        Number(recipientAge) || 0,
        relationship,
      ),
    );
  };

  return (
    <div>
      <div className="mb-4 font-display flex gap-2">
        <button
          type="button"
          onClick={() => setMode("write")}
          className="rounded-full px-4 py-1.5 text-xs font-medium"
          style={{
            background: mode === "write" ? "#B8265A" : "transparent",
            color: mode === "write" ? "#fff" : "#7A5766",
            border: "1px solid rgba(184,38,90,0.3)",
          }}
        >
          Write your own
        </button>
        <button
          type="button"
          onClick={() => setMode("suggest")}
          className="rounded-full px-4 py-1.5 text-xs font-medium"
          style={{
            background: mode === "suggest" ? "#B8265A" : "transparent",
            color: mode === "suggest" ? "#fff" : "#7A5766",
            border: "1px solid rgba(184,38,90,0.3)",
          }}
        >
          Help me write one
        </button>
      </div>

      {mode === "suggest" && (
        <div className="mb-4 flex flex-wrap gap-2">
          {MESSAGE_STYLES.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => applyStyle(style)}
              className="rounded-full border px-3 py-1 text-xs"
              style={{ borderColor: "rgba(122,87,102,0.3)", color: "#7A5766" }}
            >
              {style}
            </button>
          ))}
        </div>
      )}

      <textarea
        value={message}
        onChange={(e) => onChange(e.target.value)}
        maxLength={2000}
        rows={8}
        placeholder={`Dear ${recipientName || "..."}, ...`}
        className="w-full rounded-xl border p-4 text-sm leading-relaxed outline-none"
        style={{ borderColor: "rgba(122,87,102,0.25)" }}
      />
      <p className="mt-1.5 text-right text-[11px] opacity-50">
        {message.length}/2000
      </p>
      <p className="text-[11px] opacity-60">
        A suggested message is always editable — nothing sends until you review
        it.
      </p>
    </div>
  );
}
