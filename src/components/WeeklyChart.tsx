// عون — اتساق آخر ٨ أسابيع (متوسّط النتيجة اليومية).
// أعمدةٌ بروتالية: الأسبوع الحالي والمكتمل بأصفر «صخب» الصريح، وسواها بسطحٍ أعمق — حدودٌ سميكة ولا وهج.
import { ar } from "@/lib/numerals";
import type { WeekPoint } from "@/lib/analytics";

export default function WeeklyChart({ weeks }: { weeks: WeekPoint[] }) {
  if (!weeks.length) return null;
  return (
    <div
      className="flex h-32 items-end gap-2"
      role="img"
      aria-label="اتساقك الأسبوعي — ارتفاع كل عمودٍ يعكس متوسّط إنجازك في ذلك الأسبوع"
    >
      {weeks.map((w, i) => {
        const current = i === weeks.length - 1;
        const gilded = current || w.score >= 100;
        return (
          <div key={w.index} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex h-full w-full items-end overflow-hidden rounded-[--radius-sm] bg-[--color-surface-2]">
              <div
                className="w-full rounded-[--radius-sm] transition-[height] duration-700 ease-out"
                style={{
                  height: `${Math.max(w.score, 3)}%`,
                  background: gilded ? "var(--color-accent)" : "var(--color-surface-3)",
                  border: "2px solid var(--color-border)",
                }}
                title={`${ar(w.score)}٪`}
              />
            </div>
            <span
              className={`tabular text-xs ${
                current ? "text-gild font-bold" : "text-[--color-faint]"
              }`}
            >
              {ar(w.score)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
