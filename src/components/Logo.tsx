// عون — الشعار: وردةٌ سباعية رشيقة (روزيت هندسي) — سبعُ بتلاتٍ نحيلة تلتف
// حول حلقةِ ثبات. كل بتلةٍ عادة، والفراغ بينها تنفّس؛ هندسةٌ هادئة بلا زخرفة زائدة.

const ANGLES = Array.from({ length: 7 }, (_, i) => (i * 360) / 7);

/* بتلة نحيلة: تبدأ بعيداً عن المركز (فجوة تنفّس) وتستدق نحو الأطراف */
const PETAL = "M24 17.5 C21.7 13.5 21.7 8 24 4.5 C26.3 8 26.3 13.5 24 17.5 Z";

interface Props {
  size?: number;
  withWordmark?: boolean;
  /** "badge" = قرصٌ ساج بوردةٍ كريمية؛ "mark" = الوردة وحدها بلون الساج. */
  variant?: "badge" | "mark";
  /** تفتّحٌ متتالٍ للبتلات عند الظهور (للهبوط السينمائي). */
  animated?: boolean;
  className?: string;
}

function Rosette({
  petal,
  ring,
  animated,
}: {
  petal: string;
  ring: string;
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
            opacity={0.95}
          />
        )
      )}
      <circle cx="24" cy="24" r="3.4" fill="none" stroke={ring} strokeWidth="1.7" />
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
        <circle cx="24" cy="24" r="24" fill="var(--color-sage)" />
        <Rosette petal="#fbf7ee" ring="#fbf7ee" animated={animated} />
      </svg>
    ) : (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
        <Rosette petal="var(--color-sage)" ring="var(--color-sage-ink)" animated={animated} />
      </svg>
    );

  if (!withWordmark) return <span className={className}>{icon}</span>;

  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      {icon}
      <span
        className="font-[family-name:var(--font-display)] font-bold leading-[1.1] text-[--color-ink]"
        style={{ fontSize: size * 0.78 }}
      >
        عون
      </span>
    </span>
  );
}
