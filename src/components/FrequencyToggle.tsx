"use client";
// عون — تبديل تكرار العادة: يومي أو أسبوعي مخصّص.
import type { Frequency, Weekday } from "@/lib/types";
import { WEEKDAY_SHORT_AR } from "@/lib/constants";

interface Props {
  frequency: Frequency;
  weekdays: Weekday[];
  onChange: (frequency: Frequency, weekdays: Weekday[]) => void;
}

const ALL: Weekday[] = [0, 1, 2, 3, 4, 5, 6];

export default function FrequencyToggle({ frequency, weekdays, onChange }: Props) {
  const setDaily = () => onChange("daily", ALL);
  const setWeekly = () => onChange("weekly", weekdays.length ? weekdays : [1, 3, 5]);

  const toggleDay = (d: Weekday) => {
    const has = weekdays.includes(d);
    const next = has ? weekdays.filter((x) => x !== d) : [...weekdays, d].sort();
    onChange("weekly", next.length ? (next as Weekday[]) : [d]);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="pill inline-flex bg-[--color-surface-2] p-1 text-sm shadow-[var(--shadow-top)]">
        <button
          type="button"
          onClick={setDaily}
          className={`pill press px-4 py-1.5 transition-colors ${
            frequency === "daily"
              ? "bg-[--color-accent-soft] font-semibold text-[--color-accent-ink] shadow-[var(--shadow-1)]"
              : "text-[--color-muted]"
          }`}
        >
          يومي
        </button>
        <button
          type="button"
          onClick={setWeekly}
          className={`pill press px-4 py-1.5 transition-colors ${
            frequency === "weekly"
              ? "bg-[--color-accent-soft] font-semibold text-[--color-accent-ink] shadow-[var(--shadow-1)]"
              : "text-[--color-muted]"
          }`}
        >
          أيام محدّدة
        </button>
      </div>

      {frequency === "weekly" && (
        <div className="flex flex-wrap gap-1.5">
          {ALL.map((d) => {
            const on = weekdays.includes(d);
            return (
              <button
                key={d}
                type="button"
                onClick={() => toggleDay(d)}
                aria-pressed={on}
                className={`press grid h-9 w-9 place-items-center rounded-[--radius-sm] text-sm font-medium transition-all ${
                  on
                    ? "bg-[--color-accent-soft] font-bold text-[--color-accent-ink] shadow-[var(--shadow-top)]"
                    : "bg-[--color-surface-2] text-[--color-muted] hover:bg-[--color-surface-3]"
                }`}
              >
                {WEEKDAY_SHORT_AR[d]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
