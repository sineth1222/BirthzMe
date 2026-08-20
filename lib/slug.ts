import { customAlphabet } from "nanoid";

// Lowercase alphanumerics only, no ambiguous characters (0/O, 1/l/I removed).
const nanoid = customAlphabet("23456789abcdefghjkmnpqrstuvwxyz", 6);

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 24);
}

/**
 * Builds a friendly, non-guessable slug like "sarah-25-x7k9k2".
 * The random suffix is what actually prevents enumeration/collisions —
 * the name+age prefix is purely cosmetic for the shared link.
 */
export function buildSlug(recipientName: string, recipientAge: number): string {
  const base = slugify(recipientName) || "surprise";
  return `${base}-${recipientAge}-${nanoid()}`;
}

/**
 * Call this against the database in a loop (with a sane retry cap) when
 * inserting a new surprise, since the collision odds are non-zero even
 * with a random suffix.
 */
export async function buildUniqueSlug(
  recipientName: string,
  recipientAge: number,
  exists: (slug: string) => Promise<boolean>,
  maxAttempts = 5
): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    const candidate = buildSlug(recipientName, recipientAge);
    if (!(await exists(candidate))) return candidate;
  }
  throw new Error("Could not generate a unique slug after several attempts");
}
