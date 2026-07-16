// عون — شبكة الشارات: المفتوحة دائرةٌ بلون النظام الهادئ، والمقفلة رماديةٌ خافتة — بلا حركةٍ زائدة.
import { BADGES, type BadgeStats } from "@/lib/badges";

export default function BadgesSection({ stats }: { stats: BadgeStats }) {
  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
      {BADGES.map((b) => {
        const earned = b.earned(stats);
        return (
          <div key={b.key} className="flex flex-col items-center gap-1.5 text-center">
            <div
              className={`grid h-16 w-16 place-items-center rounded-full text-2xl ${
                earned
                  ? "bg-[--color-accent-soft] text-[--color-accent-ink]"
                  : "bg-[--color-surface-2] opacity-45 grayscale"
              }`}
            >
              {b.icon}
            </div>
            <span
              className={`text-[12px] font-semibold ${
                earned ? "text-[--color-ink]" : "text-[--color-faint]"
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
