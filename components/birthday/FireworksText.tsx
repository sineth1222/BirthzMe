"use client";

// 5x7 dot-matrix font — only the letters needed for "HAPPY" / "BIRTHDAY"
const FONT: Record<string, string[]> = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
};

const LETTER_COLS = 5;
const LETTER_ROWS = 7;
const LETTER_GAP = 1;
const LINE_GAP = 2;

interface TextPoint {
  col: number;
  row: number;
  letterIndex: number;
}

function buildTextPoints(lines: string[]) {
  const lineColsArr = lines.map(
    (line) => line.length * LETTER_COLS + (line.length - 1) * LETTER_GAP,
  );
  const totalCols = Math.max(...lineColsArr);
  const totalRows = lines.length * LETTER_ROWS + (lines.length - 1) * LINE_GAP;

  const points: TextPoint[] = [];
  let letterIndex = 0;
  let rowOffset = 0;

  lines.forEach((line, li) => {
    const startCol = Math.floor((totalCols - lineColsArr[li]) / 2);
    for (let ci = 0; ci < line.length; ci++) {
      const glyph = FONT[line[ci].toUpperCase()] ?? FONT[" "];
      const colBase = startCol + ci * (LETTER_COLS + LETTER_GAP);
      for (let r = 0; r < LETTER_ROWS; r++) {
        for (let c = 0; c < LETTER_COLS; c++) {
          if (glyph[r][c] === "1") {
            points.push({ col: colBase + c, row: rowOffset + r, letterIndex });
          }
        }
      }
      letterIndex++;
    }
    rowOffset += LETTER_ROWS + LINE_GAP;
  });

  return { points, totalCols, totalRows, letterCount: letterIndex };
}

interface FireworksTextProps {
  colors: string[];
  line1?: string;
  line2?: string;
  cellSize?: number; // in vmin
  top?: string; // vertical anchor of the text block, e.g. "34vh"
}

/** Fireworks that pop into place and assemble into readable birthday text, hold, then fade and loop — CSS-only. */
export function FireworksText({
  colors,
  line1 = "HAPPY",
  line2 = "BIRTHDAY",
  cellSize = 1,
  top = "15vh",
}: FireworksTextProps) {
  const { points, totalCols, totalRows, letterCount } = buildTextPoints([
    line1,
    line2,
  ]);

  const cycle = 6; // seconds per loop
  const maxDelay = 1.6; // seconds — sweep time to fully assemble

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute"
        style={{
          left: "50%",
          top,
          width: `${totalCols * cellSize}vmin`,
          height: `${totalRows * cellSize}vmin`,
          transform: "translate(-50%, -50%)",
        }}
      >
        {points.map((p, i) => {
          const color = colors[p.letterIndex % colors.length];
          const delay = (p.col / totalCols) * maxDelay + Math.random() * 0.15;
          const dot = cellSize * 0.85;

          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${p.col * cellSize}vmin`,
                top: `${p.row * cellSize}vmin`,
                width: `${dot}vmin`,
                height: `${dot}vmin`,
                background: "#fff",
                boxShadow: `0 0 ${cellSize * 1.6}vmin ${cellSize * 0.5}vmin ${color}`,
                animation: `text-spark ${cycle}s ${delay}s infinite`,
              }}
            >
              {/* tiny pop streaks — brief flash of sparks when this pixel "explodes" into place */}
              {[45, 135, 225, 315].map((angle) => (
                <div
                  key={angle}
                  className="absolute left-1/2 top-1/2 origin-left rounded-full"
                  style={{
                    width: `${cellSize * 1.4}vmin`,
                    height: "1.5px",
                    background: `linear-gradient(to right, ${color}, transparent)`,
                    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                    animation: `text-spark-streak ${cycle}s ${delay}s infinite`,
                  }}
                />
              ))}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes text-spark {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.15); }
          4% { opacity: 1; transform: translate(-50%, -50%) scale(2.8); }
          10% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          70% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          85% { opacity: 0; transform: translate(-50%, -50%) scale(0.4); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.15); }
        }
        @keyframes text-spark-streak {
          0% { opacity: 0; transform: translate(-50%, -50%) rotate(var(--r, 0deg)) scaleX(0); }
          3% { opacity: 1; transform: translate(-50%, -50%) rotate(var(--r, 0deg)) scaleX(1); }
          9% { opacity: 0; transform: translate(-50%, -50%) rotate(var(--r, 0deg)) scaleX(1.4); }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
