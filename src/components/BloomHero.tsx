"use client";
// عون — «تلّة الواحة»: مشهدُ حديقةٍ نباتيّ راقٍ يتبدّل مع وقتك (فجر/صباح/ظهيرة/غروب/ليل).
// لكل عادةٍ نبتةٌ رشيقة على التلّة: برعمٌ مقفَل قبل الإنجاز، يتفتّح زهرةً بلونها
// بارتدادٍ ناعم لحظةَ الإتمام. ثلاث سلالات من الأزهار تمنح الحديقة تنوّعاً طبيعياً.
import { ar } from "@/lib/numerals";
import { accentOf, accentInkOf } from "@/lib/colors";
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

/* مواضع النبتات على قوس التلّة + طول ساقها (أطول في الوسط) — ثابتة للتطابق بين الخادم والعميل */
const SPOTS: { x: number; y: number; h: number }[] = [
  { x: 34, y: 117, h: 15 },
  { x: 62, y: 110, h: 19 },
  { x: 88, y: 105, h: 23 },
  { x: 110, y: 103, h: 26 },
  { x: 132, y: 105, h: 23 },
  { x: 158, y: 110, h: 19 },
  { x: 186, y: 116, h: 15 },
];

/* شرارات النجوم (رباعية الرؤوس) — مواضع ثابتة */
const STARS: { x: number; y: number; r: number; d: number }[] = [
  { x: 22, y: 24, r: 2.6, d: 0 },
  { x: 52, y: 13, r: 1.8, d: 1.4 },
  { x: 86, y: 27, r: 2.1, d: 2.3 },
  { x: 128, y: 13, r: 1.8, d: 0.7 },
  { x: 162, y: 30, r: 2.3, d: 1.9 },
  { x: 205, y: 40, r: 1.7, d: 2.8 },
];

function sparkle(x: number, y: number, r: number): string {
  const w = r * 0.28;
  return `M${x} ${y - r} L${x + w} ${y - w} L${x + r} ${y} L${x + w} ${y + w} L${x} ${y + r} L${x - w} ${y + w} L${x - r} ${y} L${x - w} ${y - w} Z`;
}

function statusText(done: number, due: number, daypart: Daypart) {
  if (due === 0) return { title: "لا عادات اليوم", sub: "استرِح — وغداً نبدأ برفق." };
  if (done >= due)
    return {
      title: "اكتملت حديقتُك",
      sub:
        daypart === "night"
          ? "كل الأزهار متفتّحة تحت القمر. نَم قريرَ العين."
          : "يومٌ مكتمل — أزهارُك السبع في أبهى حالها.",
    };
  const left = due - done;
  const leftText = left === 1 ? "برعمٌ واحد" : left === 2 ? "برعمان" : `${ar(left)} براعم`;
  return {
    title: done === 0 ? "حديقتُك بانتظارك" : "الحديقة تتفتّح",
    sub: `بقي ${leftText} حتى يكتمل اليوم.`,
  };
}

/* سماء المشهد: شمسٌ بهالة رقيقة نهاراً، هلالٌ وشراراتُ نجومٍ ليلاً، وضبابٌ خفيف */
function OasisSky({ daypart }: { daypart: Daypart }) {
  const starry = daypart === "night" || daypart === "fajr";
  const sunX = daypart === "morning" ? 46 : daypart === "sunset" ? 174 : 110;
  const sunY = daypart === "noon" ? 22 : daypart === "morning" ? 34 : 44;
  return (
    <g aria-hidden>
      {starry &&
        STARS.map((s, i) => (
          <path
            key={i}
            className="tw"
            style={{ animationDelay: `${s.d}s` }}
            d={sparkle(s.x, s.y, s.r)}
            fill="currentColor"
            opacity={daypart === "fajr" ? 0.35 : 0.8}
          />
        ))}
      {daypart === "night" ? (
        <path
          d="M195.5 12.5 A10 10 0 1 0 195.5 31.5 A13 13 0 0 1 195.5 12.5 Z"
          fill="#f2e9cf"
          opacity="0.95"
        />
      ) : (
        <g className="sun-glow">
          <circle cx={sunX} cy={sunY} r="15" fill="#f6c559" opacity="0.28" />
          <circle cx={sunX} cy={sunY} r="10" fill={daypart === "sunset" ? "#f2a35c" : "#f6c559"} />
        </g>
      )}
      {/* ضبابٌ خفيف بدل الغيوم */}
      <ellipse className="animate-bob" cx="66" cy="34" rx="22" ry="3.6" fill="#fff" opacity="0.32" />
      <ellipse
        className="animate-bob"
        style={{ animationDelay: "1.8s" }}
        cx="152"
        cy="52"
        rx="16"
        ry="2.8"
        fill="#fff"
        opacity="0.22"
      />
      {daypart === "night" && (
        <>
          <circle className="tw" cx="72" cy="72" r="1.4" fill="var(--color-amber)" opacity="0.8" />
          <circle
            className="tw"
            style={{ animationDelay: "1.6s" }}
            cx="148"
            cy="80"
            r="1.2"
            fill="var(--color-amber)"
            opacity="0.7"
          />
        </>
      )}
    </g>
  );
}

/* نبتة عادة: ساقٌ منحنية رشيقة وورقتان، وثلاث سلالات من الأزهار للتنوّع */
function Plant({
  habit,
  x,
  y,
  h,
  variant,
  lean,
  delay,
}: {
  habit: HabitLite;
  x: number;
  y: number;
  h: number;
  variant: number;
  lean: number;
  delay: number;
}) {
  const accent = accentOf(habit.colorKey);
  const ink = accentInkOf(habit.colorKey);
  const dn = habit.completedToday;
  const tipX = lean * 1.5;

  return (
    <g transform={`translate(${x} ${y})`}>
      {/* الساق */}
      <path
        d={`M0 0 C ${lean * 2.4} ${-h * 0.35}, ${lean * 3} ${-h * 0.7}, ${tipX} ${-h}`}
        stroke="var(--color-sage-ink)"
        strokeWidth="1.7"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      {/* ورقتان متقابلتان */}
      <path
        d={`M${lean * 1.2} ${-h * 0.42} C ${lean * 1.2 - 6} ${-h * 0.42 - 2}, ${lean * 1.2 - 8} ${-h * 0.42 - 7}, ${lean * 1.2 - 6.5} ${-h * 0.42 - 10} C ${lean * 1.2 - 2.5} ${-h * 0.42 - 7.5}, ${lean * 1.2 - 1} ${-h * 0.42 - 3.5}, ${lean * 1.2} ${-h * 0.42} Z`}
        fill="var(--color-sage)"
        opacity="0.9"
      />
      <path
        d={`M${lean * 2} ${-h * 0.62} C ${lean * 2 + 6} ${-h * 0.62 - 2}, ${lean * 2 + 8} ${-h * 0.62 - 7}, ${lean * 2 + 6.5} ${-h * 0.62 - 10} C ${lean * 2 + 2.5} ${-h * 0.62 - 7.5}, ${lean * 2 + 1} ${-h * 0.62 - 3.5}, ${lean * 2} ${-h * 0.62} Z`}
        fill="var(--color-sage)"
        opacity="0.75"
      />

      {dn ? (
        <g
          className="animate-sprout"
          style={{ animationDelay: `${delay}ms`, transformBox: "fill-box", transformOrigin: "center bottom" }}
        >
          {variant === 0 && (
            /* سلالة أولى: زهرة خماسية البتلات */
            <g transform={`translate(${tipX} ${-h})`}>
              {[0, 72, 144, 216, 288].map((rot) => (
                <ellipse
                  key={rot}
                  cx="0"
                  cy="-5.4"
                  rx="3.4"
                  ry="5.8"
                  fill={accent}
                  stroke={ink}
                  strokeOpacity="0.28"
                  strokeWidth="0.8"
                  transform={`rotate(${rot})`}
                />
              ))}
              <circle r="3" fill="var(--color-amber)" stroke={ink} strokeOpacity="0.3" strokeWidth="0.7" />
            </g>
          )}
          {variant === 1 && (
            /* سلالة ثانية: كأسُ توليب */
            <g transform={`translate(${tipX} ${-h})`}>
              <path
                d="M-4.6 0 C -4.6 -7.5, -2.4 -10.5, 0 -11 C 2.4 -10.5, 4.6 -7.5, 4.6 0 C 3 2.2, -3 2.2, -4.6 0 Z"
                fill={accent}
                stroke={ink}
                strokeOpacity="0.3"
                strokeWidth="0.9"
              />
              <path d="M0 -10.6 C 1.6 -7.5, 1.6 -3, 0 0.8" stroke={ink} strokeOpacity="0.25" strokeWidth="0.8" fill="none" />
            </g>
          )}
          {variant === 2 && (
            /* سلالة ثالثة: سنبلةُ أجراس */
            <g transform={`translate(${tipX} ${-h})`}>
              <circle cx={lean * 1.4} cy="-9" r="2" fill={accent} opacity="0.85" />
              <circle cx={lean * 0.6} cy="-5" r="2.5" fill={accent} opacity="0.92" />
              <circle cx="0" cy="-0.5" r="3" fill={accent} />
              <circle cx="0" cy="-0.5" r="1.1" fill="#fff" opacity="0.75" />
            </g>
          )}
        </g>
      ) : (
        /* برعمٌ مقفَل: قطرةٌ حانية فوق كأسٍ أخضر */
        <g transform={`translate(${tipX} ${-h})`} opacity="0.75">
          <path
            d="M0 1.5 C -3.2 -1.5, -2.6 -6.8, 0 -8.4 C 2.6 -6.8, 3.2 -1.5, 0 1.5 Z"
            fill={accent}
            opacity="0.6"
            stroke={ink}
            strokeOpacity="0.35"
            strokeWidth="0.9"
          />
          <path d="M-2.6 0.6 C -1 2.2, 1 2.2, 2.6 0.6 L 0 3 Z" fill="var(--color-sage-ink)" opacity="0.7" />
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

  /* توزيع النبتات من منتصف التلّة نحو الأطراف */
  const order = [3, 2, 4, 1, 5, 0, 6];
  const spots = order.slice(0, Math.min(due, 7)).sort((a, b) => a - b);

  return (
    <section
      className={`sky-panel sky-${daypart} mt-3 overflow-hidden rounded-[--radius-xl]`}
      aria-label="تلّة الواحة"
    >
      <div className="relative flex flex-col items-center px-4 pb-4 pt-2 text-center">
        <svg
          className="w-full max-w-[340px]"
          viewBox="0 0 220 140"
          role="img"
          aria-label={`حديقة اليوم: ${ar(done)} من ${ar(due)} أزهار متفتّحة`}
        >
          <OasisSky daypart={daypart} />

          {/* التلال: ثلاث طبقات تمنح عمقاً */}
          <path d="M0 140 L0 116 C 45 98 90 92 110 91 C 145 92 185 102 220 118 L220 140 Z" fill="var(--color-sage)" opacity="0.22" />
          <path d="M0 140 L0 122 C 45 105 85 99 110 98 C 148 99 188 108 220 123 L220 140 Z" fill="var(--color-sage)" opacity="0.5" />
          <path d="M0 140 L0 127 C 45 111 85 104 110 103 C 148 104 188 113 220 128 L220 140 Z" fill="var(--color-sage)" opacity="0.95" />

          {/* بركة بانعكاسٍ رقيق */}
          <ellipse cx="187" cy="132" rx="16" ry="4.4" fill="var(--color-sky)" opacity="0.8" />
          <path d="M176 131 Q 182 129.6 190 130.8" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.65" />

          {/* حُزمُ عشبٍ صغيرة */}
          {[
            { x: 50, y: 121 },
            { x: 100, y: 112 },
            { x: 148, y: 115 },
          ].map((g, i) => (
            <g key={i} transform={`translate(${g.x} ${g.y})`} aria-hidden>
              <path
                d="M0 0 C -1 -3 -1.4 -5 -2.4 -7 M0 0 C 0 -3.6 0 -5.6 0 -8 M0 0 C 1 -3 1.4 -5 2.4 -7"
                stroke="var(--color-sage-ink)"
                strokeWidth="1.1"
                strokeLinecap="round"
                fill="none"
                opacity="0.4"
              />
            </g>
          ))}

          {/* نبتات العادات — سلالاتٌ متنوعة وميلانٌ طبيعي متعاكس */}
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
              />
            );
          })}

          {/* عند اكتمال اليوم: بتلاتٌ تنجرف في الهواء */}
          {allDone && (
            <g aria-hidden>
              <ellipse className="animate-bob" cx="70" cy="68" rx="2.6" ry="1.4" fill="var(--color-blush)" opacity="0.85" transform="rotate(-24 70 68)" />
              <ellipse className="animate-bob" style={{ animationDelay: "1.1s" }} cx="126" cy="58" rx="2.2" ry="1.2" fill="var(--color-amber)" opacity="0.8" transform="rotate(18 126 58)" />
              <ellipse className="animate-bob" style={{ animationDelay: "2.2s" }} cx="168" cy="72" rx="2.4" ry="1.3" fill="var(--color-lavender)" opacity="0.8" transform="rotate(-12 168 72)" />
            </g>
          )}
        </svg>

        <h2 className="mt-1 font-[family-name:var(--font-display)] text-lg font-bold leading-snug">
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
