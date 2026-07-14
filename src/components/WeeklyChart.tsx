// عون — اتساق آخر ٨ أسابيع (متوسّط النتيجة اليومية).
import { ar } from "@/lib/numerals";
import type { WeekPoint } from "@/lib/analytics";

export default function WeeklyChart({ weeks }: { weeks: WeekPoint[] }) {
  if (!weeks.length) return null;
  return (
    <div className="flex h-32 items-end gap-2">
      {weeks.map((w) => (
        <div key={w.index} className="flex flex-1 flex-col items-center gap-1.5">
          <div className="flex h-full w-full items-end overflow-hidden rounded-[--radius-sm] bg-[--color-surface-2]">
            <div
              className="w-full rounded-[--radius-sm] transition-[height] duration-700"
              style={{
                height: `${Math.max(w.score, 3)}%`,
                background: "var(--grad-sunrise)",
              }}
              title={`${w.score}`}
            />
          </div>
          <span className="tabular text-xs text-[--color-faint]">{ar(w.score)}</span>
        </div>
      ))}
    </div>
  );
}
