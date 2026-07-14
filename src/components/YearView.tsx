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
      <div className="pill inline-flex self-start border border-[--color-hairline-soft] bg-[--color-surface-2] p-1 text-sm">
        <button
          type="button"
          onClick={() => setMode("garden")}
          aria-pressed={mode === "garden"}
          className={`press pill inline-flex items-center gap-1.5 px-4 py-1.5 transition-colors ${
            mode === "garden"
              ? "bg-[--color-surface] font-semibold text-[--color-accent-ink] shadow-[var(--shadow-1)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--color-accent)_28%,transparent)]"
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
              ? "bg-[--color-surface] font-semibold text-[--color-accent-ink] shadow-[var(--shadow-1)] ring-1 ring-inset ring-[color-mix(in_srgb,var(--color-accent)_28%,transparent)]"
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
