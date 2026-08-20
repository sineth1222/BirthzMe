import type { AnimationIntensity } from "@/types/birthday";

const INTENSITIES: { id: AnimationIntensity; label: string }[] = [
  { id: "soft", label: "Soft" },
  { id: "magical", label: "Magical" },
  { id: "cinematic", label: "Cinematic" },
  { id: "explosive", label: "Explosive" },
];

const ACCENTS = ["#B8265A", "#7C1638", "#E3B583", "#8A5A6B"];

interface CustomizationFormProps {
  animationStyle: AnimationIntensity;
  accentColor: string;
  nickname: string;
  specialMemory: string;
  insideJoke: string;
  quote: string;
  onChange: (
    field:
      | "animationStyle"
      | "accentColor"
      | "nickname"
      | "specialMemory"
      | "insideJoke"
      | "quote",
    value: string,
  ) => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid rgba(122,87,102,0.25)",
  fontSize: 13,
  outline: "none",
};

export function CustomizationForm({
  animationStyle,
  accentColor,
  nickname,
  specialMemory,
  insideJoke,
  quote,
  onChange,
}: CustomizationFormProps) {
  return (
    <div className="flex flex-col font-display gap-7">
      <div>
        <p className="mb-2 text-sm font-medium" style={{ color: "#3A2430" }}>
          Animation intensity
        </p>
        <div className="flex gap-2">
          {INTENSITIES.map((i) => (
            <button
              key={i.id}
              type="button"
              onClick={() => onChange("animationStyle", i.id)}
              className="rounded-full border px-4 py-1.5 text-xs"
              style={{
                background: animationStyle === i.id ? "#B8265A" : "transparent",
                color: animationStyle === i.id ? "#fff" : "#7A5766",
                borderColor: "rgba(184,38,90,0.3)",
              }}
            >
              {i.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium" style={{ color: "#3A2430" }}>
          Accent color
        </p>
        <div className="flex gap-2">
          {ACCENTS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onChange("accentColor", c)}
              className="h-8 w-8 rounded-full"
              style={{
                background: c,
                outline: accentColor === c ? "2px solid #3A2430" : "none",
                outlineOffset: 2,
              }}
              aria-label={c}
            />
          ))}
        </div>
      </div>

      <p className="text-xs font-medium uppercase tracking-wide opacity-50">
        Optional personal touches
      </p>

      {[
        {
          field: "nickname" as const,
          label: "Nickname",
          value: nickname,
          placeholder: "Sar",
        },
        {
          field: "specialMemory" as const,
          label: "Favorite memory",
          value: specialMemory,
          placeholder: "That road trip in 2022...",
        },
        {
          field: "insideJoke" as const,
          label: "Inside joke",
          value: insideJoke,
          placeholder: "The pineapple incident",
        },
        {
          field: "quote" as const,
          label: "Special quote",
          value: quote,
          placeholder: '"Life is short, eat the cake first."',
        },
      ].map((f) => (
        <div key={f.field}>
          <label
            className="mb-1.5 block text-xs font-medium"
            style={{ color: "#3A2430" }}
          >
            {f.label}
          </label>
          <input
            style={inputStyle}
            value={f.value}
            placeholder={f.placeholder}
            onChange={(e) => onChange(f.field, e.target.value)}
            maxLength={200}
          />
        </div>
      ))}
    </div>
  );
}
