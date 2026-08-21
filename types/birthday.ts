export type BirthdayTemplate = "dreamy-pink" | "cinematic-gold" | "fun-party";

export type AnimationIntensity = "soft" | "magical" | "cinematic" | "explosive";

export interface MemoryPhoto {
  url: string;
  caption?: string;
  order: number;
}

export interface BirthdaySurprise {
  id: string;
  creatorId: string;
  slug: string;
  recipientName: string;
  recipientAge: number;
  relationship?: string;
  nickname?: string;
  senderName: string;
  template: BirthdayTemplate;
  mainPhotoUrl: string | null;
  memoryPhotos: MemoryPhoto[];
  birthdayMessage: string;
  specialMemory?: string;
  insideJoke?: string;
  quote?: string;
  musicUrl: string | null;
  musicType: "builtin" | "custom" | null;
  accentColor?: string;
  animationStyle: AnimationIntensity;
  hasWatermark: boolean;
  status: "draft" | "published" | "opened" | "celebrated";
  openedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type BirthdayEventType =
  | "opened"
  | "music_started"
  | "gift_opened"
  | "birthday_revealed"
  | "gallery_viewed"
  | "message_viewed"
  | "surprise_completed";

// Every template component receives exactly this shape — this is what makes
// adding template #4 later a matter of writing one new component, not a new app.
export interface TemplateProps {
  surprise: BirthdaySurprise;
  onSceneChange?: (scene: string) => void;
  onEvent?: (type: BirthdayEventType) => void;
}
