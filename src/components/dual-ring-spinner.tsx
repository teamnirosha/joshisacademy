/**
 * DualRingSpinner
 *
 * Premium concentric dual-ring SVG spinner.
 *
 * Outer ring  — sky blue  (#3FA9F5), clockwise,         1.0s linear infinite
 * Inner ring  — deep blue (#0B3D91), counter-clockwise, 0.7s linear infinite
 * Track rings — #DCEEFB (light bg) / #16294F (dark bg)
 *
 * Both rings have rounded stroke caps and a partial-arc so the rotation
 * is visually obvious against the faded track ring behind it.
 *
 * Pure CSS animation via .ring-outer / .ring-inner classes defined in
 * styles.css — zero JS library dependency.
 */

interface DualRingSpinnerProps {
  /** px size for the SVG. Defaults to 60 on desktop; CSS can scale it. */
  size?: number;
  /** Show "Loading" label below the spinner */
  label?: boolean;
  /** Use dark-background colour variant */
  dark?: boolean;
  className?: string;
}

export function DualRingSpinner({
  size = 60,
  label = true,
  dark = false,
  className = "",
}: DualRingSpinnerProps) {
  // Geometry
  const cx = size / 2;
  const cy = size / 2;
  const sw = (3 / 60) * size; // stroke-width scales with size

  const outerR = size * (25 / 60); // ≈25px at 60px size
  const innerR = size * (15 / 60); // ≈15px at 60px size — 10px gap

  // Partial arc lengths (dasharray) — outer 75%, inner 60%
  const outerCirc = 2 * Math.PI * outerR;
  const innerCirc = 2 * Math.PI * innerR;
  const outerDash = `${(outerCirc * 0.75).toFixed(2)} ${(outerCirc * 0.25).toFixed(2)}`;
  const innerDash = `${(innerCirc * 0.6).toFixed(2)} ${(innerCirc * 0.4).toFixed(2)}`;

  // Colours
  const outerTrack = dark ? "#16294F" : "#DCEEFB";
  const outerStroke = "#3FA9F5";
  const innerTrack = dark ? "#16294F" : "#DCEEFB";
  const innerStroke = dark ? "#7FCFFF" : "#0B3D91";
  const labelColor = dark ? "#7FCFFF" : "#0B3D91";

  return (
    <div
      className={`flex flex-col items-center gap-3 ${className}`}
      role="status"
      aria-label="Loading"
    >
      {/* Responsive wrapper — 60px desktop, 48px mobile */}
      <div className="size-[48px] sm:size-[60px]">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${size} ${size}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* ── Outer track (full circle, faded) ── */}
          <circle cx={cx} cy={cy} r={outerR} stroke={outerTrack} strokeWidth={sw} />

          {/* ── Outer animated arc (clockwise, 1s) ── */}
          <circle
            cx={cx}
            cy={cy}
            r={outerR}
            stroke={outerStroke}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeDasharray={outerDash}
            className="ring-outer"
          />

          {/* ── Inner track (full circle, faded) ── */}
          <circle cx={cx} cy={cy} r={innerR} stroke={innerTrack} strokeWidth={sw} />

          {/* ── Inner animated arc (counter-clockwise, 0.7s) ── */}
          <circle
            cx={cx}
            cy={cy}
            r={innerR}
            stroke={innerStroke}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeDasharray={innerDash}
            className="ring-inner"
          />
        </svg>
      </div>

      {label && (
        <span
          className="text-[10px] font-bold uppercase tracking-[0.22em]"
          style={{ color: labelColor }}
        >
          Loading
        </span>
      )}
    </div>
  );
}
