const RELATIONSHIPS = [
  "Best Friend",
  "Girlfriend",
  "Boyfriend",
  "Sister",
  "Brother",
  "Mother",
  "Father",
  "Wife",
  "Husband",
  "Cousin",
  "Friend",
  "Other",
];

interface BirthdayPersonFormProps {
  recipientName: string;
  recipientAge: number | "";
  relationship: string;
  senderName: string;
  onChange: (
    field: "recipientName" | "recipientAge" | "relationship" | "senderName",
    value: string,
  ) => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid rgba(122,87,102,0.25)",
  fontSize: 14,
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: "#3A2430",
  marginBottom: 6,
};

export function BirthdayPersonForm({
  recipientName,
  recipientAge,
  relationship,
  senderName,
  onChange,
}: BirthdayPersonFormProps) {
  return (
    <div className="flex font-display flex-col gap-5">
      <div>
        <label style={labelStyle}>What&apos;s their name?</label>
        <input
          style={inputStyle}
          value={recipientName}
          onChange={(e) => onChange("recipientName", e.target.value)}
          placeholder="Sarah"
          maxLength={60}
        />
      </div>

      <div>
        <label style={labelStyle}>How old are they turning?</label>
        <input
          style={inputStyle}
          type="number"
          min={1}
          max={130}
          value={recipientAge}
          onChange={(e) => onChange("recipientAge", e.target.value)}
          placeholder="25"
        />
      </div>

      <div>
        <label style={labelStyle}>Who are they to you? (optional)</label>
        <select
          style={inputStyle}
          value={relationship}
          onChange={(e) => onChange("relationship", e.target.value)}
        >
          <option value="">Select...</option>
          {RELATIONSHIPS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelStyle}>Your name (shown as the sender)</label>
        <input
          style={inputStyle}
          value={senderName}
          onChange={(e) => onChange("senderName", e.target.value)}
          placeholder="Alex"
          maxLength={60}
        />
      </div>
    </div>
  );
}
