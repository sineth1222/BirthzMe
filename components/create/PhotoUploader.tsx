"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { uploadToImageKit, validateFile } from "@/lib/upload";
import type { MemoryPhoto } from "@/types/birthday";

interface PhotoUploaderProps {
  mainPhotoUrl: string | null;
  memoryPhotos: MemoryPhoto[];
  onMainPhotoChange: (url: string | null) => void;
  onMemoryPhotosChange: (photos: MemoryPhoto[]) => void;
  onUploadingChange?: (isUploading: boolean) => void;
}

export function PhotoUploader({
  mainPhotoUrl,
  memoryPhotos,
  onMainPhotoChange,
  onMemoryPhotosChange,
  onUploadingChange,
}: PhotoUploaderProps) {
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingMemory, setUploadingMemory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onUploadingChange?.(uploadingMain || uploadingMemory);
  }, [uploadingMain, uploadingMemory, onUploadingChange]);

  const handleMainUpload = async (file: File) => {
    setError(null);
    const invalid = validateFile(file, "image");
    if (invalid) return setError(invalid);

    setUploadingMain(true);
    try {
      const result = await uploadToImageKit(file, "photos");
      onMainPhotoChange(result.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploadingMain(false);
    }
  };

  const handleMemoryUpload = async (files: FileList) => {
    setError(null);
    if (memoryPhotos.length + files.length > 10) {
      return setError("You can add up to 10 memory photos.");
    }

    setUploadingMemory(true);
    try {
      const uploaded: MemoryPhoto[] = [];
      for (const file of Array.from(files)) {
        const invalid = validateFile(file, "image");
        if (invalid) {
          setError(invalid);
          continue;
        }
        const result = await uploadToImageKit(file, "photos");
        uploaded.push({
          url: result.url,
          order: memoryPhotos.length + uploaded.length,
        });
      }
      onMemoryPhotosChange([...memoryPhotos, ...uploaded]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploadingMemory(false);
    }
  };

  const removeMemory = (url: string) => {
    onMemoryPhotosChange(memoryPhotos.filter((p) => p.url !== url));
  };

  const updateCaption = (url: string, caption: string) => {
    onMemoryPhotosChange(
      memoryPhotos.map((p) => (p.url === url ? { ...p, caption } : p)),
    );
  };

  return (
    <div className="flex flex-col font-display gap-8">
      <div>
        <p className="mb-2 text-sm font-medium" style={{ color: "#3A2430" }}>
          Main birthday photo
        </p>
        {mainPhotoUrl ? (
          <div className="relative h-40 w-32 overflow-hidden rounded-xl border">
            <Image
              src={mainPhotoUrl}
              alt="Main"
              fill
              className="object-cover"
              sizes="128px"
            />
            <button
              type="button"
              onClick={() => onMainPhotoChange(null)}
              className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white"
            >
              ✕
            </button>
          </div>
        ) : (
          <label
            className="flex h-40 w-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed text-xs"
            style={{ borderColor: "rgba(122,87,102,0.4)", color: "#7A5766" }}
          >
            {uploadingMain ? "Uploading..." : "+ Add photo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploadingMain}
              onChange={(e) =>
                e.target.files?.[0] && handleMainUpload(e.target.files[0])
              }
            />
          </label>
        )}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium" style={{ color: "#3A2430" }}>
          Memory photos{" "}
          <span className="font-normal opacity-60">(up to 5, optional)</span>
        </p>
        <div className="flex flex-wrap gap-3">
          {memoryPhotos.map((p) => (
            <div key={p.url} className="w-24">
              <div className="relative h-24 w-24 overflow-hidden rounded-lg border">
                <Image
                  src={p.url}
                  alt="Memory"
                  fill
                  className="object-cover"
                  sizes="96px"
                />
                <button
                  type="button"
                  onClick={() => removeMemory(p.url)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 text-xs text-white"
                >
                  ✕
                </button>
              </div>
              <input
                placeholder="caption"
                value={p.caption ?? ""}
                onChange={(e) => updateCaption(p.url, e.target.value)}
                className="mt-1 w-full rounded border px-1.5 py-1 text-[11px]"
              />
            </div>
          ))}
          {memoryPhotos.length < 5 && (
            <label
              className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed text-xs"
              style={{ borderColor: "rgba(122,87,102,0.4)", color: "#7A5766" }}
            >
              {uploadingMemory ? "..." : "+ Add"}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={uploadingMemory}
                onChange={(e) =>
                  e.target.files && handleMemoryUpload(e.target.files)
                }
              />
            </label>
          )}
        </div>
      </div>

      {error && (
        <p className="text-xs" style={{ color: "#B8265A" }}>
          {error}
        </p>
      )}
    </div>
  );
}
