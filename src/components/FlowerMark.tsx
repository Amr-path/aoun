// عون — علامة الوردة السباعية الملوّنة (الهبوط والدخول): بتلاتٌ نحيلة بألوان
// العادات السبع، مسطّحة بلا تدرجاتٍ ولا حدودٍ بيضاء — تتفتّح واحدةً تلو الأخرى.
const PETALS = [
  { a: 0, c: "var(--color-sage)" },
  { a: 51.43, c: "var(--color-sky)" },
  { a: 102.86, c: "var(--color-blush)" },
  { a: 154.29, c: "var(--color-amber)" },
  { a: 205.71, c: "var(--color-teal)" },
  { a: 257.14, c: "var(--color-lavender)" },
  { a: 308.57, c: "var(--color-clay)" },
];

/* بتلة نحيلة تبدأ بعيداً عن المركز وتستدق نحو الطرف */
const PETAL_D = "M100 74 C 91 58, 91 34, 100 20 C 109 34, 109 58, 100 74 Z";

export default function FlowerMark({
  size = 82,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={`lp-mark ${className}`} aria-hidden>
      {PETALS.map((p, i) => (
        <g key={i} transform={`rotate(${p.a} 100 100)`}>
          <path
            className="lp-petal"
            style={{ animationDelay: `${(0.15 + i * 0.12).toFixed(2)}s` }}
            d={PETAL_D}
            fill={p.c}
            opacity={0.95}
          />
        </g>
      ))}
      <g className="lp-core">
        <circle cx="100" cy="100" r="11" fill="none" stroke="var(--color-accent)" strokeWidth="3.5" opacity="0.9" />
      </g>
    </svg>
  );
}
