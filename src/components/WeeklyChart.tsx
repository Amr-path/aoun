// عون — اتساق آخر ٨ أسابيع (متوسّط النتيجة اليومية).
// أعمدةُ «مصّاصات» طينية: قناةٌ غائرة يعلوها عمودٌ حلويٌّ مكتنز — الأسبوع الحالي والمكتمل
// بتدرّج المرجان، وسواهما بأزرق السماء — بلا حدودٍ إطلاقاً وبارتدادةٍ مطاطية عند النموّ.
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
        const gilded = w.hasData && (current || w.score >= 100);
        return (
          <div key={w.index} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex h-full w-full items-end overflow-hidden rounded-full bg-[--color-surface-3] shadow-[inset_0_2px_3px_rgba(96,66,30,0.18)]">
              <div
                className="w-full rounded-full transition-[height] duration-700"
                style={{
                  // لا ارتفاعَ زائفاً لأسبوعٍ بلا بيانات — الصدق قبل الجمال.
                  height: w.hasData ? `${Math.max(w.score, 6)}%` : "0%",
                  background: gilded ? "var(--grad-cta)" : "var(--color-sky)",
                  boxShadow:
                    "inset 0 2px 0 rgba(255, 255, 255, 0.4), inset 0 -2px 0 rgba(0, 0, 0, 0.12)",
                  transitionTimingFunction: "var(--ease-spring)",
                }}
                title={w.hasData ? `${ar(w.score)}٪` : "لا بيانات بعد"}
              />
            </div>
            <span
              className={`tabular text-xs ${
                current && w.hasData ? "text-gild font-bold" : "text-[--color-faint]"
              }`}
            >
              {w.hasData ? `${ar(w.score)}٪` : "—"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
