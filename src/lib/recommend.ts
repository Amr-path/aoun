// عون — محرك التوصية النقيّ: يقترح 7 عادات مؤسِّسة بناءً على التشخيص.
// بلا تبعيات خارجية ليكون حتميّاً وقابلاً للاختبار.
import { HABIT_LIBRARY, type HabitTemplate } from "./constants";
import type { DiagnosticAnswers, FocusArea, Weekday } from "./types";

const TARGET = 7;

/** عادات مؤسِّسة تُفضَّل دائماً لقيمتها العامة. */
const FOUNDATIONAL = new Set(["water_2l", "sleep_7", "walk_30"]);

/** عادات تناسب الطاقة المنخفضة (لطيفة) مقابل المرتفعة (مجهدة). */
const LOW_ENERGY = new Set(["sleep_7", "water_2l", "gratitude"]);
const HIGH_ENERGY = new Set(["move_body", "deep_focus", "walk_30", "sunlight", "learn"]);

/** يحسب درجة ملاءمة قالبٍ لإجابات التشخيص (أعلى = أنسب). */
export function scoreTemplate(t: HabitTemplate, a: DiagnosticAnswers): number {
  let s = 0;
  const overlap = t.focus.filter((f) => a.focusArea.includes(f as FocusArea)).length;
  s += overlap * 12;
  if (FOUNDATIONAL.has(t.key)) s += 6;
  if (a.energyLevel === "low" && LOW_ENERGY.has(t.key)) s += 6;
  if (a.energyLevel === "high" && HIGH_ENERGY.has(t.key)) s += 6;
  if (a.energyLevel === "high" && LOW_ENERGY.has(t.key) && !FOUNDATIONAL.has(t.key)) s -= 2;
  return s;
}

/**
 * يقترح 7 قوالب. يرتّب بالدرجة (وترتيب المكتبة عند التعادل لثبات النتيجة)،
 * ثم يضمن تغطية كل مجال تركيز اختاره المستخدم بعادة واحدة على الأقل.
 */
export function recommendHabits(a: DiagnosticAnswers): HabitTemplate[] {
  const ranked = HABIT_LIBRARY.map((t, i) => ({ t, i, s: scoreTemplate(t, a) })).sort(
    (x, y) => y.s - x.s || x.i - y.i
  );

  const chosen: HabitTemplate[] = [];
  const chosenKeys = new Set<string>();
  for (const { t } of ranked) {
    if (chosen.length >= TARGET) break;
    chosen.push(t);
    chosenKeys.add(t.key);
  }

  // ضمان تغطية كل مجال مختار.
  for (const area of a.focusArea) {
    const covered = chosen.some((t) => t.focus.includes(area));
    if (covered) continue;
    const candidate = ranked.find(
      ({ t }) => t.focus.includes(area) && !chosenKeys.has(t.key)
    );
    if (!candidate) continue;
    // استبدل أضعف عادة غير مؤسِّسة وغير مطلوبة للتغطية.
    const replaceIdx = findReplaceableIndex(chosen, a);
    if (replaceIdx >= 0) {
      chosenKeys.delete(chosen[replaceIdx].key);
      chosen[replaceIdx] = candidate.t;
      chosenKeys.add(candidate.t.key);
    }
  }

  return chosen.slice(0, TARGET);
}

/** يجد فهرس أضعف عادة يمكن استبدالها (أدنى درجة، غير مؤسِّسة). */
function findReplaceableIndex(chosen: HabitTemplate[], a: DiagnosticAnswers): number {
  let worst = -1;
  let worstScore = Infinity;
  for (let i = 0; i < chosen.length; i++) {
    if (FOUNDATIONAL.has(chosen[i].key)) continue;
    const sc = scoreTemplate(chosen[i], a);
    if (sc < worstScore) {
      worstScore = sc;
      worst = i;
    }
  }
  return worst;
}

/**
 * يخصّص أوقات العادات الصباحية حول وقت الاستيقاظ (إن وُجد).
 * يُرجع نسخاً معدّلة دون المساس بالمكتبة الأصلية.
 */
export function personalizeTimes(
  templates: HabitTemplate[],
  wakeTime?: string
): HabitTemplate[] {
  if (!wakeTime || !/^\d{2}:\d{2}$/.test(wakeTime)) return templates.map((t) => ({ ...t }));
  const morningKeys = new Set(["no_phone_morning"]);
  return templates.map((t) => {
    if (morningKeys.has(t.key)) {
      return { ...t, scheduledAt: addMinutes(wakeTime, 20) };
    }
    return { ...t };
  });
}

/** يضيف دقائق لوقت "HH:mm" مع الالتفاف عند منتصف الليل. */
export function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(":").map(Number);
  let total = (h * 60 + m + mins) % (24 * 60);
  if (total < 0) total += 24 * 60;
  const hh = String(Math.floor(total / 60)).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

/** أيام أسبوعية افتراضية. */
export const DEFAULT_WEEKDAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6];
