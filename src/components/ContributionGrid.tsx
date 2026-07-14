// عون — شبكة السنة (٣٦٥ يوماً) على طراز الحدائق: كثافة الآذريون = اتساقك.
import { weekdayOf } from "@/lib/date";
import type { DayCell } from "@/lib/analytics";

// سُلّم توقيعيّ: من الورق الفارغ إلى ذهب الآذريون الكامل.
const LEVELS = [
  "var(--color-surface-2)",
  "color-mix(in srgb, var(--color-accent) 22%, var(--color-surface-2))",
  "color-mix(in srgb, var(--color-accent) 48%, var(--color-surface-2))",
  "color-mix(in srgb, var(--color-accent) 74%, var(--color-surface-2))",
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
              title={c ? `${c.date} · ${c.completed}/${c.due}` : undefined}
              className="h-[11px] w-[11px] rounded-[3.5px]"
              style={{ background: c ? LEVELS[c.level] : "transparent" }}
            />
          ))}
        </div>
      </div>

      {/* المفتاح — رقاقةٌ ورقيّة صغيرة */}
      <div className="flex items-center gap-2 text-xs text-[--color-faint]">
        <span>أقل</span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[--color-hairline-soft] bg-[--color-surface] px-2 py-1">
          {LEVELS.map((c, i) => (
            <span
              key={i}
              className="h-[11px] w-[11px] rounded-[3.5px]"
              style={{ background: c }}
            />
          ))}
        </span>
        <span>أكثر</span>
      </div>
    </div>
  );
}
