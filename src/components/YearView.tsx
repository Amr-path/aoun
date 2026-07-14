"use client";
// عون — عرض السنة: تبديل بين «الحديقة» العضوية و«الشبكة» الكلاسيكية.
import { useState } from "react";
import ContributionGrid from "./ContributionGrid";
import GardenGrid from "./GardenGrid";
import Icon from "./ui/Icon";
import type { DayCell } from "@/lib/analytics";

// شعارٌ صغيرٌ للشبكة (٢×٢) بديلٌ نظيفٌ للإيموجي.
function GridGlyph() {
  return (
    <span className="grid grid-cols-2 gap-[2px]" aria-hidden>
      {Array.from({ length: 4 }).map((_, i) => (
        <span key={i} className="h-[5px] w-[5px] rounded-[1.5px] bg-current" />
      ))}
    </span>
  );
}

export default function YearView({ days }: { days: DayCell[] }) {
  const [mode, setMode] = useState<"garden" | "grid">("garden");

  return (
    <div className="flex flex-col gap-4">
      {/* مبدّل العرض: قناةٌ طينية غائرة تعلوها خرزةٌ بيضاء منفوخة للوضع المختار */}
      <div className="inline-flex gap-1 self-start rounded-full bg-[--color-surface-3] p-1 text-sm shadow-[inset_0_2px_3px_rgba(96,66,30,0.18)]">
        <button
          type="button"
          onClick={() => setMode("garden")}
          aria-pressed={mode === "garden"}
          className={`press pill inline-flex items-center gap-1.5 px-4 py-1.5 transition-colors ${
            mode === "garden"
              ? "bg-[--color-surface] font-bold text-[--color-accent-ink] shadow-[inset_0_1.5px_0_rgba(255,255,255,0.6),0_3px_0_0_var(--edge)]"
              : "text-[--color-muted]"
          }`}
        >
          <Icon name="leaf" size={16} />
          حديقة
        </button>
        <button
          type="button"
          onClick={() => setMode("grid")}
          aria-pressed={mode === "grid"}
          className={`press pill inline-flex items-center gap-1.5 px-4 py-1.5 transition-colors ${
            mode === "grid"
              ? "bg-[--color-surface] font-bold text-[--color-accent-ink] shadow-[inset_0_1.5px_0_rgba(255,255,255,0.6),0_3px_0_0_var(--edge)]"
              : "text-[--color-muted]"
          }`}
        >
          <GridGlyph />
          شبكة
        </button>
      </div>
      {mode === "garden" ? <GardenGrid days={days} /> : <ContributionGrid days={days} />}
    </div>
  );
}
