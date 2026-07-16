// عون — شبكة السنة (٣٦٥ يوماً): كثافة الآذريون = اتساقك.
// تتقاسم مع الحديقة الهندسة والسُلّم والمفتاح وحاوية التمرير (lib/levels + YearCanvas).
import { weekdayOf } from "@/lib/date";
import { CELL, LEVEL_FILL, dayTooltip } from "@/lib/levels";
import type { DayCell } from "@/lib/analytics";
import YearCanvas, { LevelLegend, Spacer } from "./YearCanvas";

function Square({ level, title }: { level: number; title?: string }) {
  return (
    <span
      title={title}
      style={{
        width: CELL,
        height: CELL,
        borderRadius: 3,
        background: LEVEL_FILL[level],
      }}
    />
  );
}

export default function ContributionGrid({ days }: { days: DayCell[] }) {
  if (!days.length) return null;
  const lead = weekdayOf(days[0].date);

  return (
    <div className="flex flex-col gap-3">
      <YearCanvas label="شبكة سنتك — كثافة اللون تعكس اتساق إنجازك اليومي (مرّر فوق أي يومٍ لعدد المُنجز)">
        {Array.from({ length: lead }, (_, i) => (
          <Spacer key={`lead-${i}`} />
        ))}
        {days.map((d) => (
          <Square key={d.date} level={d.level} title={dayTooltip(d)} />
        ))}
      </YearCanvas>

      <LevelLegend mark={(l) => <Square level={l} />} />
    </div>
  );
}
