// عون — توليد نصوص سردية ذكية: لمحة الأسبوع، رسائل التعافي، و«لماذا بدأت».
import { weekdayOf } from "./date";
import { WEEKDAY_LABELS_AR } from "./constants";
import { ar } from "./numerals";
import type { FocusArea } from "./types";

type DayLite = { date: string; completed: number };

/** لمحةٌ سردية دافئة عن أسبوعك (تُعرض في صفحة الرحلة). */
export function weeklyNarrative(days: DayLite[], name: string | null): string {
  const last7 = days.slice(-7);
  const prev7 = days.slice(-14, -7);
  const n = name ? `${name}، ` : "";
  if (last7.length === 0) return `${n}ابدأ أسبوعك الأول مع عون.`;

  const thisTotal = last7.reduce((s, d) => s + d.completed, 0);
  const prevTotal = prev7.reduce((s, d) => s + d.completed, 0);
  const activeDays = last7.filter((d) => d.completed > 0).length;

  if (thisTotal === 0) return `${n}أسبوعٌ هادئ. لا بأس — بدايةٌ صغيرة اليوم تكفي.`;

  let bestI = 0;
  for (let i = 1; i < last7.length; i++) {
    if (last7[i].completed > last7[bestI].completed) bestI = i;
  }
  const bestDay = WEEKDAY_LABELS_AR[weekdayOf(last7[bestI].date)];
  const trend =
    thisTotal > prevTotal
      ? "تصاعدٌ جميل عن الأسبوع الماضي."
      : thisTotal < prevTotal
        ? "أقلّ قليلاً من الأسبوع الماضي، والعودة سهلة."
        : "بثباتٍ كالأسبوع الماضي.";

  return `${n}أتممتَ ${ar(thisTotal)} عادةً هذا الأسبوع في ${ar(
    activeDays
  )} أيام، وأنشط أيامك كان ${bestDay}. ${trend}`;
}

const WHY_MAP: Record<string, string> = {
  spiritual: "سكون نفسك",
  physical: "صحّة جسدك",
  mental: "صفاء ذهنك",
  sleep: "راحتك ونومك",
  social: "دفء علاقاتك",
};

/** يستخرج «لماذا بدأت» من إجابات التشخيص المحفوظة. */
export function whyFromDiagnostic(raw: string | null): string {
  try {
    const d = raw ? (JSON.parse(raw) as { focusArea?: FocusArea[] }) : null;
    const areas = (d?.focusArea ?? []).map((a) => WHY_MAP[a]).filter(Boolean);
    if (areas.length === 0) return "أن تبني نسخةً أفضل منك";
    if (areas.length === 1) return areas[0];
    if (areas.length === 2) return `${areas[0]} و${areas[1]}`;
    return `${areas.slice(0, -1).join("، ")}، و${areas[areas.length - 1]}`;
  } catch {
    return "أن تبني نسخةً أفضل منك";
  }
}

/** رسالة تعافٍ عند العودة بعد انقطاع: تعاطفٌ بلا لومٍ، وتذكيرٌ بـ«لماذا بدأت». */
export function recoveryMessage(
  bestStreak: number,
  name: string | null,
  why: string
): string {
  const n = name || "صديقي";
  const streakPart =
    bestStreak >= 3
      ? `واظبتَ من قبل ${ar(bestStreak)} يوماً متّصلة، وتلك القدرة لم تغادرك. `
      : "";
  return `عدتَ يا ${n}، وهذا وحده يكفي اليوم. ${streakPart}ما بدأتَ من أجله ما زال يستحقّ: ${why}. خطوةٌ واحدة الآن، والباقي يتبع.`;
}
