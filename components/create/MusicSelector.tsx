"use client";

import { useRef, useState } from "react";
import { BUILT_IN_TRACKS } from "@/lib/message-presets";
import { uploadToImageKit, validateFile } from "@/lib/upload";

interface MusicSelectorProps {
  musicUrl: string | null;
  musicType: "builtin" | "custom" | null;
  onChange: (url: string | null, type: "builtin" | "custom" | null) => void;
}

export function MusicSelector({
  musicUrl,
  musicType,
  onChange,
}: MusicSelectorProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);
  const [previewingId, setPreviewingId] = useState<string | null>(null);

  const playPreview = (id: string, url: string) => {
    audioPreviewRef.current?.pause();
    if (previewingId === id) {
      setPreviewingId(null);
      return;
    }
    const audio = new Audio(url);
    audio.play().catch(() => {});
    audioPreviewRef.current = audio;
    setPreviewingId(id);
  };

  const handleCustomUpload = async (file: File) => {
    setError(null);
    const invalid = validateFile(file, "audio");
    if (invalid) return setError(invalid);

    setUploading(true);
    try {
      const result = await uploadToImageKit(file, "music");
      onChange(result.url, "custom");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex font-display flex-col gap-6">
      <div>
        <p className="mb-3 text-sm font-medium" style={{ color: "#3A2430" }}>
          Birthday music
        </p>
        <div className="flex flex-col gap-2">
          {BUILT_IN_TRACKS.map((track) => (
            <div
              key={track.id}
              className="flex items-center justify-between rounded-xl border px-4 py-2.5"
              style={{
                borderColor:
                  musicUrl === track.url ? "#B8265A" : "rgba(122,87,102,0.2)",
                borderWidth: musicUrl === track.url ? 2 : 1,
              }}
            >
              <button
                type="button"
                onClick={() => onChange(track.url, "builtin")}
                className="flex-1 text-left text-sm"
                style={{ color: "#3A2430" }}
              >
                {track.label}{" "}
                <span className="text-xs opacity-50">· {track.category}</span>
              </button>
              <button
                type="button"
                onClick={() => playPreview(track.id, track.url)}
                className="ml-3 text-xs opacity-70"
              >
                {previewingId === track.id ? "⏸" : "▶"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium" style={{ color: "#3A2430" }}>
          Or upload your own
        </p>
        {musicType === "custom" && musicUrl ? (
          <div className="flex items-center gap-2 text-xs">
            <span style={{ color: "#7C1638" }}>Custom track uploaded ✓</span>
            <button
              type="button"
              onClick={() => onChange(null, null)}
              className="underline"
            >
              remove
            </button>
          </div>
        ) : (
          <label
            className="inline-block cursor-pointer rounded-full border px-4 py-2 text-xs"
            style={{ borderColor: "rgba(122,87,102,0.3)", color: "#7A5766" }}
          >
            {uploading ? "Uploading..." : "Choose MP3 / WAV / M4A"}
            <input
              type="file"
              accept="audio/mpeg,audio/wav,audio/mp4,audio/x-m4a"
              className="hidden"
              disabled={uploading}
              onChange={(e) =>
                e.target.files?.[0] && handleCustomUpload(e.target.files[0])
              }
            />
          </label>
        )}
      </div>

      {error && (
        <p className="text-xs" style={{ color: "#B8265A" }}>
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={() => onChange(null, null)}
        className="self-start text-xs opacity-60"
      >
        Skip music for this surprise
      </button>
    </div>
  );
}
