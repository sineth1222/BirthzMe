interface ProgressIndicatorProps {
  steps: string[];
  currentIndex: number;
}

export function ProgressIndicator({ steps, currentIndex }: ProgressIndicatorProps) {
  return (
    <div className="mx-auto mb-8 flex w-full max-w-md items-center justify-center gap-1.5">
      {steps.map((label, i) => (
        <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
          <div
            className="h-1.5 w-full rounded-full transition-colors"
            style={{ background: i <= currentIndex ? "#B8265A" : "#F0D6DC" }}
          />
          <span
            className="hidden text-[10px] uppercase tracking-wide sm:block"
            style={{ color: i <= currentIndex ? "#7C1638" : "#B79AA5" }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
