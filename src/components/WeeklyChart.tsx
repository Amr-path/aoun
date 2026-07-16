// عون — اتساق آخر ٨ أسابيع (متوسّط النتيجة اليومية).
// أعمدةٌ نظيفة بروح iOS: الأسبوع الحالي بلون النظام كاملاً، والأسابيع الماضية
// بنسخته الخافتة — بلا لمعاتٍ داخلية ولا ظلال، والانتقال في الارتفاع يبقى سلساً.
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
        return (
          <div key={w.index} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex h-full w-full items-end overflow-hidden rounded-[3px] bg-[--color-surface-2]">
              <div
                className="w-full rounded-[3px] transition-[height] duration-700"
                style={{
                  // لا ارتفاعَ زائفاً لأسبوعٍ بلا بيانات — الصدق قبل الجمال.
                  height: w.hasData ? `${Math.max(w.score, 6)}%` : "0%",
                  background: current
                    ? "var(--color-accent)"
                    : "color-mix(in srgb, var(--color-accent) 35%, transparent)",
                  transitionTimingFunction: "var(--ease-soft)",
                }}
                title={w.hasData ? `${ar(w.score)}٪` : "لا بيانات بعد"}
              />
            </div>
            <span
              className={`tabular text-[11px] ${
                current && w.hasData
                  ? "font-semibold text-[--color-ink]"
                  : "text-[--color-faint]"
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
