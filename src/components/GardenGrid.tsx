// عون — «حديقة السنة»: كل يومٍ برعمٌ ينمو بمقدار إنجازه.
//
// التصميم القديم رسم زهوراً ببتلاتٍ في SVG بخطوة ١٤px وسُلّمٍ لونيّ خاص ومفتاحٍ
// مستقل — فكان جسماً غريباً وسط بطاقاتٍ نظيفة، والبتلات عند ٣٫٥px تتلبّد فلا
// تُقرأ. ونظام «نقاء» صريح: لا زخرفة تسبق الوظيفة.
//
// البديل: نفس هندسة الشبكة ونفس سُلّمها، والنموّ يُقاس بالحجم والانحناء بدل
// البتلات — بذرةٌ (٣px) تكبر حتى تصير خليةً ممتلئة (١١px) تُطابق الشبكة عند
// الإتمام الكامل. فالعدستان صارتا نظرتين لشيءٍ واحد لا شكلين متنافرين.
// وترميز المستوى بالحجم *واللون* معاً يجعله مقروءاً بلا تمييز ألوان.
import { weekdayOf } from "@/lib/date";
import { BUD_RADIUS, BUD_SIZE, CELL, LEVEL_FILL, dayTooltip } from "@/lib/levels";
import type { DayCell } from "@/lib/analytics";
import YearCanvas, { LevelLegend, Spacer } from "./YearCanvas";

function Bud({ level, title }: { level: number; title?: string }) {
  return (
    <span
      title={title}
      className="grid place-items-center"
      style={{ width: CELL, height: CELL }}
    >
      <span
        style={{
          width: BUD_SIZE[level],
          height: BUD_SIZE[level],
          borderRadius: BUD_RADIUS[level],
          // اليوم الخالي: بذرةٌ خافتة في التربة لا مربّعٌ رماديّ — فالفراغ يُلمَح ولا يزاحم.
          background: level === 0 ? "var(--color-hairline)" : LEVEL_FILL[level],
          opacity: level === 0 ? 0.5 : 1,
        }}
      />
    </span>
  );
}

export default function GardenGrid({ days }: { days: DayCell[] }) {
  if (!days.length) return null;
  const lead = weekdayOf(days[0].date);

  return (
    <div className="flex flex-col gap-3">
      <YearCanvas label="حديقة سنتك — كل يومٍ برعمٌ يكبر بمقدار إنجازه، من بذرةٍ إلى خليةٍ ممتلئة (مرّر فوق أي يومٍ لعدد المُنجز)">
        {Array.from({ length: lead }, (_, i) => (
          <Spacer key={`lead-${i}`} />
        ))}
        {days.map((d) => (
          <Bud key={d.date} level={d.level} title={dayTooltip(d)} />
        ))}
      </YearCanvas>

      <LevelLegend mark={(l) => <Bud level={l} />} />
    </div>
  );
}
