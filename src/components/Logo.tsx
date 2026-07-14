// عون — الشعار: زهرةٌ من سبع بتلات. سبع عاداتٍ تتفتّح في دائرةٍ واحدة —
// المداومة على مدار العام. استعارةٌ أصيلة من الزخرفة العربية (الرَّوزيت/الوردة)
// والنموّ الطبيعي: كل بتلةٍ عادة، والمركز نواةُ الثبات.

import { LOGO_PETAL as PETAL } from "@/lib/marks";

const ANGLES = Array.from({ length: 7 }, (_, i) => (i * 360) / 7);

interface Props {
  size?: number;
  withWordmark?: boolean;
  /** "badge" = مربّع ساج بزهرةٍ كريمية؛ "mark" = الزهرة وحدها بلون الساج. */
  variant?: "badge" | "mark";
  /** تفتّحٌ متتالٍ للبتلات عند الظهور (للهبوط السينمائي). */
  animated?: boolean;
  className?: string;
}

function Rosette({
  petal,
  eye,
  animated,
}: {
  petal: string;
  eye: string;
  animated?: boolean;
}) {
  return (
    <g>
      {ANGLES.map((a, i) =>
        animated ? (
          <path
            key={i}
            d={PETAL}
            fill={petal}
            style={
              {
                transformOrigin: "24px 24px",
                animation: "petal-in 0.8s var(--ease-spring) both",
                animationDelay: `${i * 90}ms`,
                ["--rot" as string]: `${a.toFixed(2)}deg`,
              } as React.CSSProperties
            }
          />
        ) : (
          <path
            key={i}
            d={PETAL}
            transform={`rotate(${a.toFixed(2)} 24 24)`}
            fill={petal}
            opacity={0.92}
          />
        )
      )}
      <circle cx="24" cy="24" r="3" fill={eye} />
    </g>
  );
}

export default function Logo({
  size = 36,
  withWordmark = false,
  variant = "badge",
  animated = false,
  className,
}: Props) {
  const icon =
    variant === "badge" ? (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
        <rect x="0" y="0" width="48" height="48" rx="14" fill="var(--color-sage)" />
        <Rosette petal="#f7f4ef" eye="#3f6149" animated={animated} />
      </svg>
    ) : (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
        <Rosette petal="var(--color-sage)" eye="#3f6149" animated={animated} />
      </svg>
    );

  if (!withWordmark) return <span className={className}>{icon}</span>;

  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      {icon}
      <span
        className="font-[family-name:var(--font-display)] font-black leading-[1.1] text-[--color-ink]"
        style={{ fontSize: size * 0.82 }}
      >
        عون
      </span>
    </span>
  );
}
