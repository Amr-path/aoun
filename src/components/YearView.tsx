"use client";
// عون — عرض السنة: تبديل بين «الحديقة» العضوية و«الشبكة» الكلاسيكية.
import { useEffect, useRef, useState } from "react";
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
  const gridWrapRef = useRef<HTMLDivElement>(null);

  // الشبكة تُرسم من الأقدم إلى الأحدث، وحاوية التمرير في RTL تبدأ عند الطرف الأقدم
  // فيختفي «اليوم». نمرّر بعد التركيب إلى الطرف الأحدث — ودلالات scrollLeft في RTL
  // تختلف بين المتصفحات، فنجرّب السالب أولاً ثم الموجب إن لم يتغيّر شيء.
  useEffect(() => {
    if (mode !== "grid") return;
    const container = gridWrapRef.current?.querySelector<HTMLElement>(".overflow-x-auto");
    if (!container) return;
    const before = container.scrollLeft;
    container.scrollLeft = -container.scrollWidth;
    if (container.scrollLeft === before) container.scrollLeft = container.scrollWidth;
  }, [mode]);

  return (
    <div className="flex flex-col gap-4">
      {/* مبدّل العرض: عنصر تحكّمٍ مجزّأ بأسلوب iOS — مقطعٌ نشطٌ أبيض بظلٍّ خافت */}
      <div className="inline-flex self-start rounded-[9px] bg-[--color-surface-2] p-[2px] text-sm">
        <button
          type="button"
          onClick={() => setMode("garden")}
          aria-pressed={mode === "garden"}
          className={`press inline-flex items-center gap-1.5 rounded-[7px] px-4 py-1.5 transition-all duration-150 ${
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
          className={`press inline-flex items-center gap-1.5 rounded-[7px] px-4 py-1.5 transition-all duration-150 ${
            mode === "grid"
              ? "bg-[--color-surface] font-semibold text-[--color-ink] shadow-[var(--shadow-1)]"
              : "text-[--color-muted]"
          }`}
        >
          <GridGlyph />
          شبكة
        </button>
      </div>
      {mode === "garden" ? (
        <GardenGrid days={days} />
      ) : (
        <div ref={gridWrapRef}>
          <ContributionGrid days={days} />
        </div>
      )}
    </div>
  );
}
