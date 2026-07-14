// عون — «حديقة السنة»: كل يومٍ برعمٌ يتفتّح بمقدار إنجازه (بديلٌ عضويّ للـheatmap).
import type { ReactNode } from "react";
import { weekdayOf } from "@/lib/date";
import type { DayCell } from "@/lib/analytics";

const STEP = 14;
const ROWS = 7;
// سُلّم توقيعيّ من ذهب الآذريون عبر color-mix على --color-accent — يستجيب لوضع «الغسق»
// ويطابق ContributionGrid (بدل hex صلب لا يتغيّر ليلاً). يُطبَّق عبر style لا fill.
const TINTS = [
  "",
  "color-mix(in srgb, var(--color-accent) 38%, var(--color-surface-2))",
  "color-mix(in srgb, var(--color-accent) 62%, var(--color-surface-2))",
  "color-mix(in srgb, var(--color-accent) 88%, var(--color-surface-2))",
  "var(--color-accent)",
];

function mark(level: number, cx: number, cy: number, key: number | string): ReactNode {
  if (level <= 0) {
    return (
      <circle key={key} cx={cx} cy={cy} r={1.4} style={{ fill: "var(--color-hairline)" }} opacity={0.55} />
    );
  }
  if (level <= 2) {
    return (
      <circle key={key} cx={cx} cy={cy} r={level === 1 ? 2.3 : 3} style={{ fill: TINTS[level] }} />
    );
  }
  // زهرةٌ صغيرة للمستويات العليا
  const petals = level === 4 ? 6 : 5;
  const ry = level === 4 ? 3.5 : 3;
  return (
    <g key={key} transform={`translate(${cx} ${cy})`}>
      {Array.from({ length: petals }).map((_, i) => (
        <ellipse
          key={i}
          cx={0}
          cy={-ry}
          rx={1.4}
          ry={ry}
          style={{ fill: TINTS[level] }}
          transform={`rotate(${(i * 360) / petals})`}
        />
      ))}
      <circle cx={0} cy={0} r={1.3} style={{ fill: "var(--color-surface)" }} />
    </g>
  );
}

export default function GardenGrid({ days }: { days: DayCell[] }) {
  if (!days.length) return null;
  const lead = weekdayOf(days[0].date);
  const cols = Math.ceil((lead + days.length) / ROWS);
  const width = cols * STEP;
  const height = ROWS * STEP;

  const nodes: ReactNode[] = days.map((d, i) => {
    const k = lead + i;
    const col = Math.floor(k / ROWS);
    const row = k % ROWS;
    const cx = (cols - 1 - col) * STEP + STEP / 2; // RTL: الأقدم يميناً
    const cy = row * STEP + STEP / 2;
    return mark(d.level, cx, cy, i);
  });

  return (
    <div className="flex flex-col gap-3">
      {/* همسةُ الخاتم خلف الحديقة — أرضيّة مخطوطةٍ للبراعم */}
      <div className="relative overflow-x-auto rounded-[--radius-md] pb-1">
        <div
          aria-hidden
          className="pattern-khatam pointer-events-none absolute inset-0 opacity-[0.04]"
        />
        <svg
          className="relative"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="حديقة سنتك — كل يومٍ يزهر بمقدار إنجازه (الشكل يكبر من نقطةٍ إلى زهرة مع الاتساق)"
        >
          {nodes}
        </svg>
      </div>
      {/* المفتاح — رقاقةٌ ورقيّة صغيرة تُطابق مفتاح الشبكة */}
      <div className="flex items-center gap-2 text-xs text-[--color-faint]">
        <span>أقل</span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[--color-hairline-soft] bg-[--color-surface] px-2 py-1">
          {[0, 1, 2, 3, 4].map((l) => (
            <svg key={l} width={14} height={14} viewBox="0 0 14 14">
              {mark(l, 7, 7, `lg-${l}`)}
            </svg>
          ))}
        </span>
        <span>أكثر</span>
      </div>
    </div>
  );
}
