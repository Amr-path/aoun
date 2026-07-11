"use client";
// عون — عرض السنة: تبديل بين «الحديقة» العضوية و«الشبكة» الكلاسيكية.
import { useState } from "react";
import ContributionGrid from "./ContributionGrid";
import GardenGrid from "./GardenGrid";
import type { DayCell } from "@/lib/analytics";

export default function YearView({ days }: { days: DayCell[] }) {
  const [mode, setMode] = useState<"garden" | "grid">("garden");

  return (
    <div className="flex flex-col gap-4">
      <div className="pill inline-flex self-start bg-[--color-surface-2] p-1 text-sm">
        <button
          type="button"
          onClick={() => setMode("garden")}
          className={`pill px-4 py-1.5 transition-colors ${
            mode === "garden"
              ? "bg-[--color-surface] font-semibold text-[--color-ink] shadow-sm"
              : "text-[--color-muted]"
          }`}
        >
          🌷 حديقة
        </button>
        <button
          type="button"
          onClick={() => setMode("grid")}
          className={`pill px-4 py-1.5 transition-colors ${
            mode === "grid"
              ? "bg-[--color-surface] font-semibold text-[--color-ink] shadow-sm"
              : "text-[--color-muted]"
          }`}
        >
          ▦ شبكة
        </button>
      </div>
      {mode === "garden" ? <GardenGrid days={days} /> : <ContributionGrid days={days} />}
    </div>
  );
}
