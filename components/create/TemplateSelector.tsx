import type { BirthdayTemplate } from "@/types/birthday";

const TEMPLATES: {
  id: BirthdayTemplate;
  name: string;
  desc: string;
  ready: boolean;
  swatch: string;
}[] = [
  {
    id: "dreamy-pink",
    name: "Dreamy Pink",
    desc: "Romantic, soft, pastel — hearts, petals, and glowing typography.",
    ready: true,
    swatch: "linear-gradient(135deg,#F6DDE0,#B8265A)",
  },
  {
    id: "cinematic-gold",
    name: "Cinematic Gold",
    desc: "Luxury, dark, spotlight-and-glitter birthday movie.",
    ready: true,
    swatch: "linear-gradient(135deg,#1B1330,#E3B583)",
  },
  {
    id: "fun-party",
    name: "Fun Party",
    desc: "Energetic, colorful, balloons and confetti explosions.",
    ready: true,
    swatch: "linear-gradient(135deg,#FF7A59,#2FBFB0)",
  },
];

interface TemplateSelectorProps {
  value: BirthdayTemplate;
  onChange: (t: BirthdayTemplate) => void;
}

export function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          type="button"
          disabled={!t.ready}
          onClick={() => onChange(t.id)}
          className="flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition"
          style={{
            borderColor: value === t.id ? "#B8265A" : "rgba(122,87,102,0.2)",
            borderWidth: value === t.id ? 2 : 1,
            opacity: t.ready ? 1 : 0.5,
            cursor: t.ready ? "pointer" : "not-allowed",
          }}
        >
          <div
            className="h-16 w-full rounded-lg"
            style={{ background: t.swatch }}
          />
          <div>
            <p
              className="text-sm font-display font-medium"
              style={{ color: "#3A2430" }}
            >
              {t.name}{" "}
              {!t.ready && (
                <span className="text-xs font-normal opacity-60">
                  (coming soon)
                </span>
              )}
            </p>
            <p
              className="mt-1 font-scriptnew text-xs"
              style={{ color: "#7A5766" }}
            >
              {t.desc}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
