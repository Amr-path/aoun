// عون — مقياس «سنتك» المشترك: هندسةٌ وسُلّمٌ لونيّ واحد تتشارَكه العدستان
// (الحديقة والشبكة). كانت لكلٍّ منهما نسخته الخاصة بنسبٍ مختلفة (٣٠/٥٥/٨٠ مقابل
// ٣٨/٦٢/٨٨) وخطوةٌ مختلفة (١٤ مقابل ١١+٣٫٥) — فبَدَتا من تطبيقين لا تطبيقٍ واحد.
// نقيٌّ وصالحٌ على العميل (لا JSX ولا server-only).
import { ar } from "./numerals";
import type { DayCell } from "./analytics";

/** ضلع الخلية ثمّ الفجوة بالبكسل — الخطوة الواحدة لكلتا العدستين. */
export const CELL = 11;
export const GAP = 3;
export const ROWS = 7;

/** سُلّم الآذريون: من السطح الفارغ إلى لون النظام الكامل. مصدر الحقيقة الوحيد. */
export const LEVEL_FILL = [
  "var(--color-surface-2)",
  "color-mix(in srgb, var(--color-accent) 30%, var(--color-surface-2))",
  "color-mix(in srgb, var(--color-accent) 55%, var(--color-surface-2))",
  "color-mix(in srgb, var(--color-accent) 80%, var(--color-surface-2))",
  "var(--color-accent)",
];

/** قطر البرعم لكل مستوى — يبدأ بذرةً وينتهي خليةً ممتلئة تُطابق الشبكة تماماً.
 *  فالعدستان تلتقيان عند الإتمام الكامل: نفس الشكل، نفس اللون. */
export const BUD_SIZE = [3, 5, 7, 9, 11];

/** انحناء البرعم — دائريٌّ صِغَراً، مُربَّعٌ ليّنٌ كِبَراً (٣px = انحناء الشبكة). */
export const BUD_RADIUS = ["999px", "999px", "2.5px", "3px", "3px"];

// تاريخٌ عربيٌّ مقروء بدل ISO الجافّ: «الثلاثاء، ١٤ يوليو».
const DAY_FMT = new Intl.DateTimeFormat("ar", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

/** تلميحةُ اليوم — تُستخدَم في العدستين (كانت في الشبكة وحدها). */
export function dayTooltip(c: DayCell): string {
  return `${DAY_FMT.format(new Date(`${c.date}T00:00:00`))} · ${ar(c.completed)}/${ar(c.due)}`;
}
