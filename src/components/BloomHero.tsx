"use client";
// عون — «تلّة الواحة»: مشهدُ حديقةٍ حيّ يتبدّل مع وقتك (فجر/صباح/ظهيرة/غروب/ليل).
// لكل عادةٍ نبتةٌ على التلّة: تبدأ برعماً خجولاً، وتتفتّح زهرةً بلونها بارتدادٍ
// مطاطيّ «جيلي» لحظةَ الإنجاز. الشمس والقمر والغيوم تعيش فوقها بحسب الساعة.
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

/* مواضع النبتات على قوس التلّة (حتى سبع عادات) — ثابتة كي لا يختلف العميل عن الخادم */
const SPOTS: { x: number; y: number }[] = [
  { x: 32, y: 113 },
  { x: 61, y: 104 },
  { x: 88, y: 98 },
  { x: 110, y: 95 },
  { x: 132, y: 98 },
  { x: 159, y: 104 },
  { x: 188, y: 113 },
];

/* نجوم الليل والفجر — مواضع ثابتة */
const STARS: { x: number; y: number; r: number; d: number }[] = [
  { x: 18, y: 22, r: 1.6, d: 0 },
  { x: 46, y: 12, r: 1.2, d: 1.4 },
  { x: 78, y: 26, r: 1.3, d: 2.3 },
  { x: 126, y: 12, r: 1.2, d: 0.7 },
  { x: 172, y: 20, r: 1.6, d: 1.9 },
  { x: 200, y: 34, r: 1.1, d: 2.8 },
];

function statusText(done: number, due: number, daypart: Daypart) {
  if (due === 0) return { title: "لا عادات اليوم", sub: "استرِح — وغداً نبدأ برفق." };
  if (done >= due)
    return {
      title: "تفتّحت واحتُك!",
      sub:
        daypart === "night"
          ? "كل الأزهار متفتّحة تحت القمر. نَم قريرَ العين."
          : "يومٌ مكتمل — حديقتك تبتسم لك.",
    };
  const left = due - done;
  const leftText = left === 1 ? "برعمٌ واحد" : left === 2 ? "برعمان" : `${ar(left)} براعم`;
  return {
    title: done === 0 ? "لنسقِ أوّل برعم" : "الواحة تتفتّح",
    sub: `بقي ${leftText} حتى تكتمل الحديقة.`,
  };
}

/* سماء المشهد: شمسٌ طرية نهاراً، قمرٌ ونجوم ليلاً، وغيمتان تطفوان دائماً */
function OasisSky({ daypart }: { daypart: Daypart }) {
  const starry = daypart === "night" || daypart === "fajr";
  const sunX = daypart === "morning" ? 42 : daypart === "sunset" ? 178 : 110;
  const sunY = daypart === "noon" ? 20 : daypart === "morning" ? 32 : 40;
  return (
    <g aria-hidden>
      {starry &&
        STARS.map((s, i) => (
          <circle
            key={i}
            className="tw"
            style={{ animationDelay: `${s.d}s` }}
            cx={s.x}
            cy={s.y}
            r={s.r * (daypart === "fajr" ? 0.75 : 1)}
            fill="currentColor"
            opacity={daypart === "fajr" ? 0.4 : 0.85}
          />
        ))}
      {daypart === "night" ? (
        <g className="animate-bob" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <circle cx="186" cy="26" r="13" fill="#fdf3d5" />
          <circle cx="191" cy="22" r="11" fill="var(--sky-grad-hole, #55497e)" opacity="0.92" />
          <circle cx="182" cy="30" r="1.6" fill="#e4d5a8" opacity="0.8" />
        </g>
      ) : (
        <g className="sun-glow">
          <circle cx={sunX} cy={sunY} r="15" fill="#f7c765" />
          <circle cx={sunX} cy={sunY} r="11" fill="#fbdf9a" />
        </g>
      )}
      <g className="animate-bob" style={{ animationDelay: "0.8s" }} opacity="0.9">
        <ellipse cx="62" cy="34" rx="16" ry="7" fill="#fff" />
        <ellipse cx="50" cy="38" rx="11" ry="6" fill="#fff" />
        <ellipse cx="74" cy="38" rx="10" ry="5" fill="#fff" />
      </g>
      <g className="animate-bob" style={{ animationDelay: "2s" }} opacity="0.75">
        <ellipse cx="152" cy="52" rx="12" ry="5.5" fill="#fff" />
        <ellipse cx="143" cy="55" rx="8" ry="4.5" fill="#fff" />
      </g>
    </g>
  );
}

/* نبتة عادة: برعمٌ صغير قبل الإنجاز، زهرةٌ متفتّحة بارتدادٍ جيلي بعده */
function Plant({
  habit,
  x,
  y,
  delay,
}: {
  habit: HabitLite;
  x: number;
  y: number;
  delay: number;
}) {
  const accent = accentOf(habit.colorKey);
  const ink = accentInkOf(habit.colorKey);
  const dn = habit.completedToday;
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0 C-1 -6 -1 -10 0 -15" stroke={ink} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M0 -7 C-5 -8 -7 -11 -7 -14 C-3 -13 -1 -10 0 -7 Z" fill={accent} opacity={dn ? 0.9 : 0.55} />
      <path d="M0 -9 C5 -10 7 -13 7 -16 C3 -15 1 -12 0 -9 Z" fill={accent} opacity={dn ? 0.9 : 0.55} />
      {dn ? (
        <g
          className="animate-sprout"
          style={{ animationDelay: `${delay}ms`, transformBox: "fill-box", transformOrigin: "center bottom" }}
        >
          {[0, 60, 120, 180, 240, 300].map((rot) => (
            <ellipse
              key={rot}
              cx="0"
              cy="-25"
              rx="4.6"
              ry="7"
              fill={accent}
              stroke="#fff"
              strokeWidth="1.3"
              transform={`rotate(${rot} 0 -19)`}
            />
          ))}
          <circle cx="0" cy="-19" r="4.6" fill="#fff" />
          <circle cx="0" cy="-19" r="3" fill="var(--color-amber)" />
        </g>
      ) : (
        <circle cx="0" cy="-17.5" r="3.6" fill={accent} opacity="0.5" stroke={ink} strokeWidth="1.2" strokeOpacity="0.4" />
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
        {/* المشهد */}
        <svg
          className={`w-full max-w-[340px] ${allDone ? "animate-breathe" : ""}`}
          viewBox="0 0 220 140"
          role="img"
          aria-label={`حديقة اليوم: ${ar(done)} من ${ar(due)} أزهار متفتّحة`}
        >
          <OasisSky daypart={daypart} />

          {/* التلّة: طبقتان طريّتان */}
          <path d="M0 140 L0 122 Q110 84 220 122 L220 140 Z" fill="var(--color-sage)" opacity="0.4" />
          <path d="M0 140 L0 127 Q110 92 220 127 L220 140 Z" fill="var(--color-sage)" opacity="0.9" />
          {/* بركة صغيرة تلمع */}
          <ellipse cx="186" cy="131" rx="17" ry="5" fill="var(--color-sky)" opacity="0.85" />
          <ellipse cx="181" cy="130" rx="6" ry="1.6" fill="#fff" opacity="0.7" />

          {/* نبتات العادات */}
          {habits.slice(0, 7).map((h, i) => {
            const s = SPOTS[spots[i] ?? i];
            return <Plant key={h.id} habit={h} x={s.x} y={s.y} delay={i * 110} />;
          })}

          {/* عند اكتمال اليوم: فراشات صغيرة تحتفل */}
          {allDone && (
            <g aria-hidden>
              <text x="58" y="72" fontSize="10" className="animate-bob">🦋</text>
              <text x="150" y="62" fontSize="9" className="animate-bob" style={{ animationDelay: "1.2s" }}>🐝</text>
            </g>
          )}
        </svg>

        <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold leading-snug">
          {title}
        </h2>
        <p className="sky-muted mt-0.5 text-[13px] leading-relaxed">{sub}</p>

        {/* خرزات الحالة */}
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <span className="sky-chip tilt-1 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold">
            <span className="score">
              {ar(done)} / {ar(due)}
            </span>
            اليوم
          </span>
          <span className="sky-chip tilt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold">
            <Icon name="leaf" size={13} className="text-[--color-sage-ink]" />
            <span className="streak">{ar(streak)}</span> مداومة
          </span>
          <span className="sky-chip tilt-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold">
            <Icon name="spark" size={13} className="text-[--color-amber-ink]" />
            مستوى <span className="tabular">{ar(level)}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
