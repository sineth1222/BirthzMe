import crypto from "node:crypto";

export interface ImageKitAuthParams {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
  urlEndpoint: string;
}

/**
 * Generates a short-lived, single-use auth signature for a direct
 * browser-to-ImageKit upload. This mirrors ImageKit's own SDKs' local
 * auth generation — no ImageKit package needed, and the private key
 * (IMAGEKIT_PRIVATE_KEY) is only ever read here, server-side.
 */
export function getImageKitAuthParams(): ImageKitAuthParams {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!privateKey || !publicKey || !urlEndpoint) {
    throw new Error("ImageKit environment variables are not configured");
  }

  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes

  const signature = crypto
    .createHmac("sha1", privateKey)
    .update(token + expire)
    .digest("hex");

  return { token, expire, signature, publicKey, urlEndpoint };
}
