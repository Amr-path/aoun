// عون — شبكة الشارات: المفتوحة خرزةُ زبدةٍ منفوخة تطفو بمرح، والمقفلة خرزةٌ رمادية غائرة في العجين.
import { BADGES, type BadgeStats } from "@/lib/badges";

export default function BadgesSection({ stats }: { stats: BadgeStats }) {
  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
      {BADGES.map((b, i) => {
        const earned = b.earned(stats);
        return (
          <div key={b.key} className="flex flex-col items-center gap-1.5 text-center">
            <div
              className={`grid h-16 w-16 place-items-center rounded-full text-2xl transition-all ${
                earned ? "animate-bob" : ""
              }`}
              style={
                earned
                  ? {
                      background: "var(--grad-sunrise)",
                      color: "var(--color-amber-ink)",
                      boxShadow:
                        "inset 0 2px 0 rgba(255, 255, 255, 0.45), 0 3px 0 0 var(--edge)",
                      animationDelay: `${(i % 4) * 0.45}s`,
                    }
                  : {
                      background: "var(--color-surface-3)",
                      boxShadow: "inset 0 2px 3px rgba(96, 66, 30, 0.18)",
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
