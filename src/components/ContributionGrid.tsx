// عون — شبكة السنة (٣٦٥ يوماً) على طراز الحدائق: كثافة الآذريون = اتساقك.
import { weekdayOf } from "@/lib/date";
import { ar } from "@/lib/numerals";
import type { DayCell } from "@/lib/analytics";

// تاريخٌ عربيٌّ مقروء في التلميحة بدل ISO الجافّ: «الثلاثاء، ١٤ يوليو».
const DAY_FMT = new Intl.DateTimeFormat("ar", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

function tooltipOf(c: DayCell): string {
  return `${DAY_FMT.format(new Date(`${c.date}T00:00:00`))} · ${ar(c.completed)}/${ar(c.due)}`;
}

// سُلّم توقيعيّ: من السطح الفارغ إلى لون النظام الكامل — درجاتٌ هادئة متدرّجة.
const LEVELS = [
  "var(--color-surface-2)",
  "color-mix(in srgb, var(--color-accent) 30%, var(--color-surface-2))",
  "color-mix(in srgb, var(--color-accent) 55%, var(--color-surface-2))",
  "color-mix(in srgb, var(--color-accent) 80%, var(--color-surface-2))",
  "var(--color-accent)",
];

export default function ContributionGrid({ days }: { days: DayCell[] }) {
  if (!days.length) return null;
  const lead = weekdayOf(days[0].date);
  const cells: (DayCell | null)[] = [...Array(lead).fill(null), ...days];

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto pb-1">
        <div
          className="grid grid-flow-col gap-[3.5px]"
          style={{ gridTemplateRows: "repeat(7, 1fr)" }}
          role="img"
          aria-label="شبكة سنتك — كثافة اللون تعكس اتساق إنجازك اليومي (مرّر فوق أي يومٍ لعدد المُنجز)"
        >
          {cells.map((c, i) => (
            <span
              key={i}
              title={c ? tooltipOf(c) : undefined}
              className="h-[11px] w-[11px] rounded-[3px]"
              style={{ background: c ? LEVELS[c.level] : "transparent" }}
            />
          ))}
        </div>
      </div>

      {/* المفتاح — نصٌّ صغير وعيّناتٌ مستوية بلا أي إطار */}
      <div className="flex items-center gap-2 text-[11px] text-[--color-faint]">
        <span>أقل</span>
        <span className="inline-flex items-center gap-1">
          {LEVELS.map((c, i) => (
            <span
              key={i}
              className="h-[10px] w-[10px] rounded-[3px]"
              style={{ background: c }}
            />
          ))}
        </span>
        <span>أكثر</span>
      </div>
    </div>
  );
}
