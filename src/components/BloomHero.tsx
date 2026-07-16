"use client";
// عون — «تلّة الواحة»: لوحةٌ حيّة تتبدّل سماؤها وأرضُها مع وقتك.
// الأسلوب: أرضٌ وأوراقٌ ظلّية هادئة بألوانٍ تخصّ كلَّ وقت (لا أخضر فاقعاً تحت سماء ليل)،
// والأزهار وحدها تحمل ألوان العادات — برعمٌ مقفَل قبل الإنجاز، وتفتُّحٌ ناعم بعده،
// وفي الليل تتوهّج الأزهار المكتملة كقناديل.
import { ar } from "@/lib/numerals";
import { accentOf } from "@/lib/colors";
import Icon from "./ui/Icon";

export type Daypart = "fajr" | "morning" | "noon" | "sunset" | "night";

interface HabitLite {
  id: string;
  colorKey: string;
  completedToday: boolean;
}

interface Props {
  habits: HabitLite[];
  streak: number;
  level: number;
  daypart: Daypart;
}

/* مواضع النبتات على قوس التلّة الأمامية + طول الساق (أطول في الوسط) */
const SPOTS: { x: number; y: number; h: number }[] = [
  { x: 36, y: 108, h: 20 },
  { x: 64, y: 103, h: 26 },
  { x: 90, y: 100, h: 31 },
  { x: 112, y: 99, h: 34 },
  { x: 136, y: 100, h: 31 },
  { x: 162, y: 103, h: 26 },
  { x: 188, y: 107, h: 20 },
];

/* نجوم الليل والفجر — مواضع ثابتة، وميضٌ على بعضها فقط (رفقاً بالأداء) */
const STARS: { x: number; y: number; r: number; d: number; still?: boolean }[] = [
  { x: 24, y: 26, r: 2.4, d: 0 },
  { x: 56, y: 14, r: 1.6, d: 1.4, still: true },
  { x: 92, y: 30, r: 1.9, d: 2.1 },
  { x: 132, y: 14, r: 1.6, d: 0.8, still: true },
  { x: 164, y: 34, r: 2.1, d: 1.7 },
  { x: 205, y: 44, r: 1.5, d: 2.6, still: true },
];

function sparkle(x: number, y: number, r: number): string {
  const w = r * 0.3;
  return `M${x} ${y - r} L${x + w} ${y - w} L${x + r} ${y} L${x + w} ${y + w} L${x} ${y + r} L${x - w} ${y + w} L${x - r} ${y} L${x - w} ${y - w} Z`;
}

function statusText(done: number, due: number, daypart: Daypart) {
  if (due === 0) return { title: "لا عادات اليوم", sub: "استرِح — وغداً نبدأ برفق." };
  if (done >= due)
    return {
      title: "اكتملت حديقتُك",
      sub:
        daypart === "night"
          ? "أزهارُك تضيء تحت القمر. نَم قريرَ العين."
          : "يومٌ مكتمل — أزهارُك السبع في أبهى حالها.",
    };
  const left = due - done;
  const leftText = left === 1 ? "برعمٌ واحد" : left === 2 ? "برعمان" : `${ar(left)} براعم`;
  return {
    title: done === 0 ? "حديقتُك بانتظارك" : "الحديقة تتفتّح",
    sub: `بقي ${leftText} حتى يكتمل اليوم.`,
  };
}

/* السماء: شمسٌ بهالتين نهاراً، هلالٌ بهالةٍ ونجومٌ ليلاً */
function OasisSky({ daypart }: { daypart: Daypart }) {
  const starry = daypart === "night" || daypart === "fajr";
  const sunX = daypart === "morning" ? 46 : daypart === "sunset" ? 172 : 110;
  const sunY = daypart === "noon" ? 24 : daypart === "morning" ? 34 : 46;
  return (
    <g aria-hidden>
      {starry &&
        STARS.map((s, i) => (
          <path
            key={i}
            className={s.still ? undefined : "tw"}
            style={s.still ? undefined : { animationDelay: `${s.d}s` }}
            d={sparkle(s.x, s.y, s.r)}
            fill="currentColor"
            opacity={daypart === "fajr" ? 0.32 : s.still ? 0.5 : 0.85}
          />
        ))}
      {daypart === "night" ? (
        <g>
          <circle cx="189" cy="24" r="22" fill="#f2e9cf" opacity="0.05" />
          <circle cx="189" cy="24" r="14" fill="#f2e9cf" opacity="0.09" />
          <path
            d="M195.5 14.5 A10 10 0 1 0 195.5 33.5 A13 13 0 0 1 195.5 14.5 Z"
            fill="#f2e9cf"
            opacity="0.96"
          />
        </g>
      ) : (
        <g>
          <circle cx={sunX} cy={sunY} r="20" fill="#f6c559" opacity="0.14" />
          <circle cx={sunX} cy={sunY} r="13" fill="#f6c559" opacity="0.22" />
          <circle cx={sunX} cy={sunY} r="9" fill={daypart === "sunset" ? "#f0a058" : "#f4bd4e"} />
          <circle cx={sunX - 2.5} cy={sunY - 2.5} r="3.4" fill="#fbe3a4" opacity="0.85" />
        </g>
      )}
    </g>
  );
}

/* نبتة عادة: ساقٌ وأوراقٌ ظلّية بلون الوقت، وزهرةٌ بلون العادة */
function Plant({
  habit,
  x,
  y,
  h,
  variant,
  lean,
  delay,
  night,
}: {
  habit: HabitLite;
  x: number;
  y: number;
  h: number;
  variant: number;
  lean: number;
  delay: number;
  night: boolean;
}) {
  const accent = accentOf(habit.colorKey);
  const dn = habit.completedToday;
  const tipX = lean * 1.6;

  return (
    <g transform={`translate(${x} ${y})`}>
      {/* الساق */}
      <path
        d={`M0 0 C ${lean * 2.6} ${-h * 0.35}, ${lean * 3.2} ${-h * 0.7}, ${tipX} ${-h}`}
        stroke="var(--stem)"
        strokeWidth="1.9"
        strokeLinecap="round"
        fill="none"
      />
      {/* ورقتان ظلّيتان متقابلتان */}
      <path
        d={`M${lean * 1.3} ${-h * 0.4} C ${lean * 1.3 - 7} ${-h * 0.4 - 2.5}, ${lean * 1.3 - 9.5} ${-h * 0.4 - 8}, ${lean * 1.3 - 7.5} ${-h * 0.4 - 11.5} C ${lean * 1.3 - 3} ${-h * 0.4 - 8.5}, ${lean * 1.3 - 1} ${-h * 0.4 - 4}, ${lean * 1.3} ${-h * 0.4} Z`}
        fill="var(--stem)"
        opacity="0.92"
      />
      <path
        d={`M${lean * 2.2} ${-h * 0.62} C ${lean * 2.2 + 7} ${-h * 0.62 - 2.5}, ${lean * 2.2 + 9.5} ${-h * 0.62 - 8}, ${lean * 2.2 + 7.5} ${-h * 0.62 - 11.5} C ${lean * 2.2 + 3} ${-h * 0.62 - 8.5}, ${lean * 2.2 + 1} ${-h * 0.62 - 4}, ${lean * 2.2} ${-h * 0.62} Z`}
        fill="var(--stem)"
        opacity="0.78"
      />

      {dn ? (
        <g
          className="animate-sprout"
          style={{ animationDelay: `${delay}ms`, transformBox: "fill-box", transformOrigin: "center bottom" }}
        >
          {/* قنديل الليل: هالةٌ خفيفة خلف الزهرة المكتملة */}
          {night && <circle cx={tipX} cy={-h - 2} r="12" fill={accent} opacity="0.2" />}
          {variant === 0 && (
            /* زهرةٌ خماسية البتلات */
            <g transform={`translate(${tipX} ${-h})`}>
              {[0, 72, 144, 216, 288].map((rot) => (
                <ellipse
                  key={rot}
                  cx="0"
                  cy="-6.2"
                  rx="4.1"
                  ry="6.8"
                  fill={accent}
                  transform={`rotate(${rot})`}
                />
              ))}
              <circle r="3.2" fill="#f4bd4e" />
              <circle r="3.2" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="0.8" />
            </g>
          )}
          {variant === 1 && (
            /* كأسُ توليب */
            <g transform={`translate(${tipX} ${-h})`}>
              <path
                d="M-5.4 0 C -5.4 -8.6, -2.8 -12, 0 -12.6 C 2.8 -12, 5.4 -8.6, 5.4 0 C 3.4 2.5, -3.4 2.5, -5.4 0 Z"
                fill={accent}
              />
              <path
                d="M0 -12.2 C 1.9 -8.6, 1.9 -3.4, 0 0.9"
                stroke="rgba(0,0,0,0.16)"
                strokeWidth="1"
                fill="none"
              />
            </g>
          )}
          {variant === 2 && (
            /* سنبلةُ أجراسٍ متدرّجة */
            <g transform={`translate(${tipX} ${-h})`}>
              <circle cx={lean * 1.6} cy="-10.5" r="2.4" fill={accent} opacity="0.8" />
              <circle cx={lean * 0.7} cy="-5.5" r="3" fill={accent} opacity="0.9" />
              <circle cx="0" cy="-0.5" r="3.7" fill={accent} />
              <circle cx="-1" cy="-1.4" r="1.2" fill="rgba(255,255,255,0.6)" />
            </g>
          )}
        </g>
      ) : (
        /* برعمٌ مقفَل */
        <g transform={`translate(${tipX} ${-h})`}>
          <path
            d="M0 1.8 C -3.6 -1.6, -3 -7.6, 0 -9.4 C 3 -7.6, 3.6 -1.6, 0 1.8 Z"
            fill={accent}
            opacity="0.5"
          />
          <path d="M-3 0.6 C -1.2 2.4, 1.2 2.4, 3 0.6 L 0 3.4 Z" fill="var(--stem)" opacity="0.9" />
        </g>
      )}
    </g>
  );
}

export default function BloomHero({ habits, streak, level, daypart }: Props) {
  const due = habits.length;
  const done = habits.filter((h) => h.completedToday).length;
  const allDone = due > 0 && done >= due;
  const { title, sub } = statusText(done, due, daypart);
  const night = daypart === "night" || daypart === "fajr";

  /* توزيع النبتات من منتصف التلّة نحو الأطراف */
  const order = [3, 2, 4, 1, 5, 0, 6];
  const spots = order.slice(0, Math.min(due, 7)).sort((a, b) => a - b);

  return (
    <section
      className={`sky-panel sky-${daypart} mt-3 overflow-hidden rounded-[--radius-xl]`}
      aria-label="تلّة الواحة"
    >
      <div className="relative flex flex-col items-center px-4 pb-4 pt-1 text-center">
        <svg
          className="w-full max-w-[360px]"
          viewBox="0 0 220 132"
          role="img"
          aria-label={`حديقة اليوم: ${ar(done)} من ${ar(due)} أزهار متفتّحة`}
        >
          <OasisSky daypart={daypart} />

          {/* الأرض: ثلاث طبقات بألوان الوقت نفسه */}
          <path d="M0 132 L0 96 Q 60 78 118 84 T 220 92 L220 132 Z" fill="var(--hill-far)" />
          <path d="M0 132 L0 106 Q 70 88 130 94 T 220 103 L220 132 Z" fill="var(--hill-mid)" />
          <path d="M0 132 L0 114 Q 85 96 150 102 T 220 112 L220 132 Z" fill="var(--hill-near)" />

          {/* البركة */}
          <ellipse cx="190" cy="122" rx="15" ry="4.2" fill="var(--pond)" />
          <path
            d="M181 121 Q 187 119.6 196 120.8"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.1"
            strokeLinecap="round"
            fill="none"
          />

          {/* حُزمُ عشبٍ ظلّية */}
          {[
            { x: 52, y: 112 },
            { x: 104, y: 106 },
            { x: 150, y: 108 },
          ].map((g, i) => (
            <path
              key={i}
              transform={`translate(${g.x} ${g.y})`}
              d="M0 0 C -1 -3 -1.4 -5 -2.6 -7.5 M0 0 C 0 -3.8 0 -6 0 -8.5 M0 0 C 1 -3 1.4 -5 2.6 -7.5"
              stroke="var(--stem)"
              strokeWidth="1.1"
              strokeLinecap="round"
              fill="none"
              opacity="0.55"
            />
          ))}

          {/* نبتات العادات */}
          {habits.slice(0, 7).map((h, i) => {
            const si = spots[i] ?? i;
            const s = SPOTS[si];
            return (
              <Plant
                key={h.id}
                habit={h}
                x={s.x}
                y={s.y}
                h={s.h}
                variant={si % 3}
                lean={si % 2 === 0 ? -1 : 1}
                delay={i * 110}
                night={night}
              />
            );
          })}

          {/* عند اكتمال اليوم: بتلاتٌ تنجرف بهدوء */}
          {allDone && (
            <g aria-hidden>
              <ellipse className="animate-bob" cx="74" cy="62" rx="2.6" ry="1.4" fill="var(--color-blush)" opacity="0.8" transform="rotate(-24 74 62)" />
              <ellipse className="animate-bob" style={{ animationDelay: "1.4s" }} cx="140" cy="54" rx="2.2" ry="1.2" fill="var(--color-amber)" opacity="0.75" transform="rotate(18 140 54)" />
            </g>
          )}
        </svg>

        <h2 className="mt-1.5 font-[family-name:var(--font-display)] text-[17px] font-semibold leading-snug">
          {title}
        </h2>
        <p className="sky-muted mt-0.5 text-[13px] leading-relaxed">{sub}</p>

        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <span className="sky-chip inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold">
            <span className="score">
              {ar(done)} / {ar(due)}
            </span>
            اليوم
          </span>
          <span className="sky-chip inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold">
            <Icon name="leaf" size={13} className="text-[--color-sage-ink]" />
            <span className="streak">{ar(streak)}</span> مداومة
          </span>
          <span className="sky-chip inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold">
            <Icon name="spark" size={13} className="text-[--color-amber-ink]" />
            مستوى <span className="tabular">{ar(level)}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
