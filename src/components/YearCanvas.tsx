"use client";
// عون — لوحة السنة المشتركة: حاوية التمرير + الشبكة ٧×ن + المفتاح.
// تتشارَكها العدستان فتبقيان متطابقتَي الهندسة، ويُصلَح التمرير إلى «اليوم» مرّةً
// واحدة لكليهما (كان مقصوراً على الشبكة، فتفتح الحديقةُ عند أقدم يومٍ في سنتك).
import { useEffect, useRef, type ReactNode } from "react";
import { CELL, GAP, ROWS } from "@/lib/levels";

export default function YearCanvas({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // الأقدم يميناً والأحدث يساراً (اتجاه القراءة)، فـ«اليوم» عند الطرف الأيسر —
  // خارج الشاشة عند التركيب. الاصطلاح الحديث: 0 عند اليمين والقيم سالبة يساراً؛
  // والقديم: 0 عند اليسار. وضعُ -max يُصيب الطرفَ الأحدث في كليهما (يُقصّ إلى 0
  // في القديم فيقع على اليسار = اليوم)، فيُغني عن التخمين.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max > 0) el.scrollLeft = -max;
  }, []);

  return (
    <div ref={ref} className="overflow-x-auto pb-1">
      <div
        className="grid grid-flow-col"
        style={{
          gridTemplateRows: `repeat(${ROWS}, ${CELL}px)`,
          gap: `${GAP}px`,
          width: "max-content",
        }}
        role="img"
        aria-label={label}
      >
        {children}
      </div>
    </div>
  );
}

/** خليةٌ فارغة تُزيح بداية الأسبوع الأول إلى يومها الصحيح. */
export function Spacer() {
  return <span aria-hidden style={{ width: CELL, height: CELL }} />;
}

/** المفتاح — بنيةٌ واحدة، وتترك لكل عدسةٍ علامتَها. */
export function LevelLegend({ mark }: { mark: (level: number) => ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[11px] text-[--color-faint]">
      <span>أقل</span>
      <span className="inline-flex items-center gap-1" aria-hidden>
        {[0, 1, 2, 3, 4].map((l) => (
          <span key={l}>{mark(l)}</span>
        ))}
      </span>
      <span>أكثر</span>
    </div>
  );
}
