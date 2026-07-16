"use client";
// عون — عرض السنة: تبديل بين «الحديقة» (نموّ) و«الشبكة» (كثافة) — عدستان
// على نفس البيانات ونفس الهندسة.
// التمرير إلى «اليوم» صار داخل YearCanvas فيسري على العدستين؛ كان هنا مقصوراً
// على الشبكة (mode !== "grid" يعود مبكراً) فتفتح الحديقةُ — وهي الافتراضية —
// عند أقدم يومٍ في سنتك ويغيب اليوم خارج الشاشة.
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

const SEG_CLASS =
  "press inline-flex min-h-[32px] items-center gap-1.5 rounded-[7px] px-4 py-1.5 transition-all duration-150";

export default function YearView({ days }: { days: DayCell[] }) {
  const [mode, setMode] = useState<"garden" | "grid">("garden");

  return (
    <div className="flex flex-col gap-4">
      {/* مبدّل العرض: عنصر تحكّمٍ مجزّأ بأسلوب iOS — مقطعٌ نشطٌ أبيض بظلٍّ خافت */}
      <div className="inline-flex self-start rounded-[9px] bg-[--color-surface-2] p-[2px] text-sm">
        <button
          type="button"
          onClick={() => setMode("garden")}
          aria-pressed={mode === "garden"}
          className={`${SEG_CLASS} ${
            mode === "garden"
              ? "bg-[--color-surface] font-semibold text-[--color-ink] shadow-[var(--shadow-1)]"
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
          className={`${SEG_CLASS} ${
            mode === "grid"
              ? "bg-[--color-surface] font-semibold text-[--color-ink] shadow-[var(--shadow-1)]"
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
