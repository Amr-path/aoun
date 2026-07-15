// عون — تلخيص التاريخ اليوميّ في نافذة واحدة متّسقة.
// مصدر الحقيقة الوحيد لمسح الأيام (الأيام المثالية + المؤهّلة + أفضل streak).
// تستخدمه اللوحة (habits.ts) والتحليلات (analytics.ts) معاً حتى تتطابق أرقامهما،
// ويُحسب الـXP من نافذة واحدة بدل خلط «كل التاريخ» بـ«٩٠ يوماً» الذي كان يُنقص XP.
import { isDueOn, lastNDays } from "./date";
import { computeDailyScore, qualifiesForStreak } from "./scoring";
import type { Frequency, Weekday } from "./types";

/** النافذة التاريخية الموحّدة (بالأيام) للّوحة والتحليلات. */
export const HISTORY_WINDOW_DAYS = 365;

export interface HistoryHabit {
  id: string;
  frequency: Frequency;
  weekdays: Weekday[];
  /**
   * مفتاح تاريخ إنشاء العادة (YYYY-MM-DD بتوقيت المستخدم) — اختياريّ.
   * العادة لا تُعدّ مستحقّة قبل يوم إنشائها، حتى لا تكسر عادةٌ جديدة
   * نتائج الأيام الماضية بأثرٍ رجعيّ (٣/٣=١٠٠٪ كانت تصبح ٣/٥=٦٠٪).
   * غيابه = مستحقّة دائماً (توافقاً مع المستدعين غير المحدّثين).
   */
  createdOn?: string;
}

export interface DayStat {
  date: string;
  due: number;
  completed: number;
  score: number;
}

export interface HistorySummary {
  /** كل أيام النافذة تصاعدياً (شامل اليوم). */
  days: DayStat[];
  /** تواريخ الأيام المؤهّلة (بلغت العتبة) — عدا اليوم. */
  qualifyingDates: Set<string>;
  bestStreak: number;
  perfectDays: number;
  /** نتيجة اليوم كما حُسبت (أو المُمرّرة override). */
  todayScore: number;
}

/**
 * يمسح نافذة تاريخية واحدة ويحسب الإحصاءات المشتركة.
 * @param todayScoreOverride نتيجة اليوم المحسوبة مسبقاً (لِتضمين الحالة التفاؤلية للّوحة).
 */
export function summarizeHistory(
  habits: HistoryHabit[],
  completedByDay: Map<string, Set<string>>,
  today: string,
  tz: string,
  windowDays: number = HISTORY_WINDOW_DAYS,
  todayScoreOverride?: number
): HistorySummary {
  const dayKeys = lastNDays(windowDays, tz);
  const days: DayStat[] = [];
  const qualifyingDates = new Set<string>();
  let bestStreak = 0;
  let run = 0;
  let perfectDays = 0;
  let todayScore = 0;

  for (const date of dayKeys) {
    // لا تُحتسب العادة في الأيام السابقة لإنشائها (إصلاح كسر الـstreak الرجعيّ).
    const due = habits.filter(
      (h) =>
        (!h.createdOn || date >= h.createdOn) &&
        isDueOn(h.frequency, h.weekdays, date)
    );
    const doneSet = completedByDay.get(date) ?? new Set<string>();
    const completed = due.filter((h) => doneSet.has(h.id)).length;
    const score =
      date === today && todayScoreOverride !== undefined
        ? todayScoreOverride
        : computeDailyScore(due.length, completed);

    if (date === today) todayScore = score;
    if (due.length > 0 && completed >= due.length) perfectDays++;

    if (qualifiesForStreak(score)) {
      if (date !== today) qualifyingDates.add(date);
      run++;
      bestStreak = Math.max(bestStreak, run);
    } else {
      run = 0;
    }

    days.push({ date, due: due.length, completed, score });
  }

  return { days, qualifyingDates, bestStreak, perfectDays, todayScore };
}
