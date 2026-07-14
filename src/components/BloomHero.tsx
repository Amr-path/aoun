"use client";
// عون — «سماء اليوم»: لوحةٌ حيّة تتبدّل مع وقتك (فجر/صباح/ظهيرة/غروب/ليل)،
// تتوسّطها زهرة اليوم داخل حلقة تقدّمٍ مذهّبة — بتلةٌ لكل عادة تتفتّح بلونها.
import { ar } from "@/lib/numerals";
import { accentOf, accentSoftOf } from "@/lib/colors";
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

const PETAL_D = "M100 92 C82 72 84 40 100 16 C116 40 118 72 100 92 Z";

/* نجومٌ ثابتة المواضع (لا عشوائية كي لا يختلف العميل عن الخادم) */
const STARS: { x: number; y: number; r: number; d: number }[] = [
  { x: 8, y: 22, r: 1.4, d: 0 },
  { x: 20, y: 58, r: 1, d: 1.1 },
  { x: 34, y: 16, r: 1.2, d: 2.2 },
  { x: 55, y: 40, r: 1, d: 0.6 },
  { x: 70, y: 14, r: 1.5, d: 1.7 },
  { x: 84, y: 48, r: 1.1, d: 2.8 },
  { x: 93, y: 20, r: 1.3, d: 0.9 },
  { x: 45, y: 74, r: 0.9, d: 2.0 },
];

function statusText(done: number, due: number, daypart: Daypart) {
  if (due === 0) return { title: "لا عادات اليوم", sub: "استرِح — وغداً نبدأ برفق." };
  if (done >= due)
    return {
      title: "اكتمل يومك",
      sub: daypart === "night" ? "تفتّحت زهرتك تحت النجوم. نَم قريرَ العين." : "أحسنت، تفتّحت زهرتك.",
    };
  const left = due - done;
  const leftText = left === 1 ? "عادةٌ واحدة" : left === 2 ? "عادتان" : `${ar(left)} عادات`;
  return {
    title: done === 0 ? "لنبدأ يومك برفق" : "أنت في الطريق",
    sub: `بقيت ${leftText} على اكتماله.`,
  };
}

/* زينة السماء بحسب الوقت: نجوم وهلال ليلاً، توهّج شمسٍ نهاراً */
function SkyDecor({ daypart }: { daypart: Daypart }) {
  const starry = daypart === "night" || daypart === "fajr";
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {starry &&
        STARS.map((s, i) => (
          <circle
            key={i}
            className="tw"
            style={{ animationDelay: `${s.d}s` }}
            cx={s.x}
            cy={s.y}
            r={s.r * (daypart === "fajr" ? 0.7 : 1)}
            fill="currentColor"
            opacity={daypart === "fajr" ? 0.35 : 0.7}
          />
        ))}
      {daypart === "night" && (
        <path
          d="M88 10 a7.5 7.5 0 1 0 6 12 a6 6 0 1 1 -6 -12 Z"
          fill="currentColor"
          opacity="0.75"
          transform="rotate(-14 88 16)"
        />
      )}
      {(daypart === "morning" || daypart === "noon") && (
        <circle
          cx={daypart === "morning" ? 14 : 50}
          cy={daypart === "morning" ? 26 : 10}
          r="9"
          fill="#ffd98f"
          stroke="var(--sky-ink)"
          strokeWidth="1.5"
        />
      )}
      {daypart === "sunset" && (
        <circle cx="18" cy="78" r="11" fill="#ffd98f" stroke="var(--sky-ink)" strokeWidth="1.5" />
      )}
    </svg>
  );
}

export default function BloomHero({ habits, streak, level, daypart }: Props) {
  const due = habits.length;
  const done = habits.filter((h) => h.completedToday).length;
  const allDone = due > 0 && done >= due;
  const { title, sub } = statusText(done, due, daypart);
  const n = Math.max(due, 1);

  // حلقة التقدّم المذهّبة حول الزهرة
  const R = 64;
  const C = 2 * Math.PI * R;
  const pct = due > 0 ? done / due : 0;

  return (
    <section
      className={`sky-panel sky-${daypart} mt-3 overflow-hidden rounded-[--radius-xl] border-[2.5px] border-[--color-border]`}
      style={{ boxShadow: "var(--shadow-2)" }}
      aria-label="سماء اليوم"
    >
      {/* نقش الخاتم — همسة مخطوطة خلف السماء */}
      <div aria-hidden className="pattern-khatam pointer-events-none absolute inset-0 opacity-[0.05]" />
      <SkyDecor daypart={daypart} />

      <div className="relative flex flex-col items-center px-5 pb-4 pt-5 text-center">
        {/* الزهرة داخل حلقة الخيط الذهبي */}
        <div className={`relative grid h-[132px] w-[132px] place-items-center ${allDone ? "animate-breathe" : ""}`}>
          <svg className="absolute inset-0" width="132" height="132" viewBox="0 0 144 144" aria-hidden>
            <circle
              cx="72"
              cy="72"
              r={R}
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.14"
              strokeWidth="3"
            />
            <circle
              cx="72"
              cy="72"
              r={R}
              fill="none"
              stroke="var(--sky-ink)"
              strokeWidth="4"
              strokeLinecap="butt"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - pct)}
              transform="rotate(-90 72 72)"
              style={{ transition: "stroke-dashoffset 0.8s var(--ease-soft)" }}
            />
          </svg>

          <svg width="98" height="98" viewBox="0 0 200 200" aria-hidden>
            {due === 0 && <circle cx="100" cy="100" r="18" fill="currentColor" opacity="0.15" />}
            {habits.map((h, i) => {
              const accent = accentOf(h.colorKey);
              const soft = accentSoftOf(h.colorKey);
              const dn = h.completedToday;
              return (
                <g key={h.id} transform={`rotate(${(i * 360) / n} 100 100)`}>
                  <path
                    d={PETAL_D}
                    style={{
                      fill: dn ? accent : soft,
                      stroke: dn ? "var(--sky-ink)" : accent,
                      strokeWidth: dn ? 3 : 2.5,
                      strokeOpacity: dn ? 1 : 0.6,
                      opacity: dn ? 1 : 0.55,
                      transformBox: "fill-box",
                      transformOrigin: "center bottom",
                      transform: dn ? "scale(1)" : "scale(0.78)",
                      transition:
                        "transform .55s var(--ease-spring), opacity .4s ease, fill .4s ease, stroke .4s ease",
                    }}
                  />
                </g>
              );
            })}
            <circle cx="100" cy="100" r="15" fill="#fff" stroke="var(--sky-ink)" strokeWidth="3" />
            <circle cx="100" cy="100" r="9.5" fill="var(--color-accent)" />
          </svg>
        </div>

        <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl font-extrabold leading-snug">
          {title}
        </h2>
        <p className="sky-muted mt-0.5 text-[13px] leading-relaxed">{sub}</p>

        {/* الرقاقات — زجاجٌ فوق السماء */}
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          <span className="sky-chip tilt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold">
            <span className="score">
              {ar(done)} / {ar(due)}
            </span>
            اليوم
          </span>
          <span className="sky-chip tilt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold">
            <Icon name="leaf" size={13} className="opacity-80" />
            <span className="streak">{ar(streak)}</span> مداومة
          </span>
          <span className="sky-chip tilt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold">
            <Icon name="spark" size={13} className="opacity-80" />
            مستوى <span className="tabular">{ar(level)}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
