export interface UploadResult {
  url: string;
  fileId: string;
}

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB
const MAX_AUDIO_BYTES = 15 * 1024 * 1024; // 15MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];
const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/wav", "audio/mp4", "audio/x-m4a"];

export function validateFile(file: File, kind: "image" | "audio"): string | null {
  const maxBytes = kind === "image" ? MAX_IMAGE_BYTES : MAX_AUDIO_BYTES;
  const allowedTypes = kind === "image" ? ALLOWED_IMAGE_TYPES : ALLOWED_AUDIO_TYPES;

  if (file.size > maxBytes) {
    return `File is too large (max ${Math.round(maxBytes / (1024 * 1024))}MB).`;
  }
  if (!allowedTypes.includes(file.type)) {
    return "That file type isn't supported.";
  }
  return null;
}

/**
 * Fetches a fresh, single-use auth signature and uploads directly to
 * ImageKit from the browser — the file itself never passes through our
 * server, keeping upload bandwidth off our API.
 */
export async function uploadToImageKit(
  file: File,
  folder: "photos" | "music"
): Promise<UploadResult> {
  const authRes = await fetch("/api/upload");
  if (!authRes.ok) {
    throw new Error("Could not start upload. Please sign in and try again.");
  }
  const auth = await authRes.json();

  const form = new FormData();
  form.append("file", file);
  form.append("fileName", `${Date.now()}-${file.name}`);
  form.append("folder", `/birthzme/${folder}`);
  form.append("publicKey", auth.publicKey);
  form.append("signature", auth.signature);
  form.append("token", auth.token);
  form.append("expire", String(auth.expire));

  const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    body: form,
  });

  if (!uploadRes.ok) {
    throw new Error("That upload failed. Try another file.");
  }

  const data = await uploadRes.json();
  return { url: data.url, fileId: data.fileId };
}
