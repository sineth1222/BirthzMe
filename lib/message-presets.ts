export interface MusicTrack {
  id: string;
  label: string;
  category: "Emotional" | "Happy" | "Romantic" | "Party" | "Cinematic" | "Piano" | "Acoustic";
  url: string;
}

// Replace these placeholder URLs with your own royalty-safe hosted tracks
// (e.g. uploaded to ImageKit under /birthzme/builtin-music/) before launch.
export const BUILT_IN_TRACKS: MusicTrack[] = [
  { id: "warm-piano", label: "Warm Piano", category: "Piano", url: "/audio/warm-piano.mp3" },
  { id: "soft-strings", label: "Soft Strings", category: "Emotional", url: "/audio/soft-strings.mp3" },
  { id: "sunny-day", label: "Sunny Day", category: "Happy", url: "/audio/sunny-day.mp3" },
  { id: "candlelight", label: "Candlelight", category: "Romantic", url: "/audio/candlelight.mp3" },
  { id: "confetti-pop", label: "Confetti Pop", category: "Party", url: "/audio/confetti-pop.mp3" },
  { id: "golden-hour", label: "Golden Hour", category: "Cinematic", url: "/audio/golden-hour.mp3" },
  { id: "gentle-guitar", label: "Gentle Guitar", category: "Acoustic", url: "/audio/gentle-guitar.mp3" },
];

export type MessageStyle =
  | "Sweet"
  | "Emotional"
  | "Funny"
  | "Romantic"
  | "Best Friend"
  | "Family"
  | "Short & Cute"
  | "Deep & Meaningful";

export const MESSAGE_STYLES: MessageStyle[] = [
  "Sweet",
  "Emotional",
  "Funny",
  "Romantic",
  "Best Friend",
  "Family",
  "Short & Cute",
  "Deep & Meaningful",
];

/**
 * Local, deterministic message suggestions — no external AI call needed.
 * The sender can (and should) edit the result; this is a starting point,
 * not a final draft.
 */
export function suggestMessage(
  style: MessageStyle,
  recipientName: string,
  age: number,
  relationship?: string
): string {
  const who = relationship ? relationship.toLowerCase() : "person";

  const openers: Record<MessageStyle, string> = {
    Sweet: `Dear ${recipientName}, wishing you the happiest of birthdays.`,
    Emotional: `Dear ${recipientName}, I don't say this enough, but you mean more to me than words can hold.`,
    Funny: `Dear ${recipientName}, congratulations on surviving another lap around the sun!`,
    Romantic: `Dear ${recipientName}, every year with you feels like a gift I don't deserve.`,
    "Best Friend": `Dear ${recipientName}, my favorite ${who}, happy birthday!`,
    Family: `Dear ${recipientName}, watching you grow has been one of life's quiet joys.`,
    "Short & Cute": `Happy birthday, ${recipientName}! 🎂`,
    "Deep & Meaningful": `Dear ${recipientName}, turning ${age} is a chance to pause and celebrate everything you've become.`,
  };

  const closers: Record<MessageStyle, string> = {
    Sweet: "Hope your day is as wonderful as you are.",
    Emotional: "Thank you for being exactly who you are. I'm lucky to know you.",
    Funny: "May your cake be big and your responsibilities small today.",
    Romantic: "Here's to another year of us. I love you.",
    "Best Friend": "Here's to more chaos, more laughs, and more memories together.",
    Family: "I'm so proud of you. Always.",
    "Short & Cute": "Have the best day ever.",
    "Deep & Meaningful": "May this year bring you closer to everything you're hoping for.",
  };

  return `${openers[style]}\n\n${closers[style]}`;
}
