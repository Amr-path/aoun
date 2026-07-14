// عون — شبكة الشارات: المفتوحة ملصقٌ أصفر صريح بحدٍّ سميك وظلٍّ قاسٍ، والمقفلة رقاقةٌ باهتة بحدٍّ مُقطَّع.
import { BADGES, type BadgeStats } from "@/lib/badges";

export default function BadgesSection({ stats }: { stats: BadgeStats }) {
  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
      {BADGES.map((b) => {
        const earned = b.earned(stats);
        return (
          <div key={b.key} className="flex flex-col items-center gap-1.5 text-center">
            <div
              className="grid h-16 w-16 place-items-center rounded-full text-2xl transition-all"
              style={
                earned
                  ? {
                      background: "var(--color-accent)",
                      color: "#141414",
                      border: "2px solid var(--color-border)",
                      boxShadow: "2.5px 2.5px 0 0 var(--color-border)",
                    }
                  : {
                      background: "var(--color-surface-2)",
                      border: "2px dashed var(--color-hairline-soft)",
                      filter: "grayscale(1)",
                      opacity: 0.45,
                    }
              }
            >
              {b.icon}
            </div>
            <span
              className={`text-xs font-semibold ${
                earned ? "text-gild" : "text-[--color-faint]"
              }`}
            >
              {b.label}
            </span>
            <span className="text-xs leading-tight text-[--color-faint]">{b.desc}</span>
          </div>
        );
      })}
    </div>
  );
}
