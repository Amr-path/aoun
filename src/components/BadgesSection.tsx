// عون — شبكة الشارات (مفتوحة/مقفلة) بلغة بصرية توقيعيّة موحّدة (ذهب الآذريون).
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
                      background: "var(--color-accent-soft)",
                      boxShadow:
                        "inset 0 0 0 2px var(--color-accent), var(--shadow-top)",
                    }
                  : {
                      background: "var(--color-surface-2)",
                      filter: "grayscale(1)",
                      opacity: 0.45,
                    }
              }
            >
              {b.icon}
            </div>
            <span
              className="text-[11px] font-semibold"
              style={{
                color: earned ? "var(--color-accent-ink)" : "var(--color-faint)",
              }}
            >
              {b.label}
            </span>
            <span className="text-[10px] leading-tight text-[--color-faint]">{b.desc}</span>
          </div>
        );
      })}
    </div>
  );
}
