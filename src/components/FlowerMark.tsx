// عون — شعار الزهرة السباعية الملوّنة التي تتفتّح بتلةً بعد أخرى (مشترك بين الهبوط والدخول).
const PETALS = [
  { a: 0, c: ["#8fc49a", "#5c9a64"] },
  { a: 51.43, c: ["#84b8de", "#4e93c4"] },
  { a: 102.86, c: ["#dcb0c9", "#d07ea0"] },
  { a: 154.29, c: ["#eec173", "#d9a23c"] },
  { a: 205.71, c: ["#8fcabf", "#3e9088"] },
  { a: 257.14, c: ["#b7b4e2", "#7c7fd0"] },
  { a: 308.57, c: ["#e2ac86", "#ce7f52"] },
];
const PETAL_D = "M 100 86 C 80 66.2, 80 38.5, 100 20 C 120 38.5, 120 66.2, 100 86 Z";

export default function FlowerMark({
  size = 82,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const uid = `fm${size}`;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={`lp-mark ${className}`} aria-hidden>
      <defs>
        {PETALS.map((p, i) => (
          <radialGradient key={i} id={`${uid}-${i}`} cx="0.5" cy="0.3" r="0.7">
            <stop offset="0" stopColor={p.c[0]} />
            <stop offset="1" stopColor={p.c[1]} />
          </radialGradient>
        ))}
      </defs>
      {PETALS.map((p, i) => (
        <g key={i} transform={`rotate(${p.a} 100 100)`}>
          <path
            className="lp-petal"
            style={{ animationDelay: `${(0.15 + i * 0.15).toFixed(2)}s` }}
            d={PETAL_D}
            fill={`url(#${uid}-${i})`}
            stroke="#fff"
            strokeWidth={1}
          />
        </g>
      ))}
      <g className="lp-core">
        <circle cx="100" cy="100" r="15" fill="#fffdfa" />
        <circle cx="100" cy="100" r="9" fill="#e0913a" />
      </g>
    </svg>
  );
}
