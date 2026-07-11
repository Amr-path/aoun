// عون — خوارزمية التلعيب (GPS: Global Performance Score)
// منطق نقيّ بلا أي تبعية (لا Prisma، لا React) ليكون قابلاً للاختبار وإعادة
// الاستخدام في أي واجهة مستقبلية (ويب/جوال).
//
// مبدأ التصميم: كل القيم المشتقّة (النتيجة، الـstreak، الـXP) تُحسب بشكل
// حتميّ (deterministic) من التاريخ، لا عبر حالة تراكمية هشّة. هذا يجعلها
// قابلة للاختبار ويمنع أخطاء العدّ المزدوج أو انحراف الحالة.

import type { Frequency, Weekday } from "./types";
import { dateKeyOffset, isDueOn } from "./date";

// ─── ثوابت قابلة للضبط ────────────────────────────────────────
export const SCORING = {
  /** أدنى نتيجة يومية (0..100) تُعدّ «يوماً ناجحاً» يُبقي الـstreak. */
  STREAK_THRESHOLD: 70,
  /** نقاط الخبرة الأساسية عند إتمام عادة. */
  XP_PER_COMPLETION: 10,
  /** حدّ أقصى لمكافأة الـstreak المضافة لكل إتمام (تُعرض في نافذة المكافأة). */
  XP_STREAK_BONUS_CAP: 20,
  /** مكافأة «اليوم المثالي» (إتمام كل المستحقّات). */
  XP_PERFECT_DAY: 25,
  /** عدد نقاط الخبرة لكل مستوى. */
  XP_PER_LEVEL: 500,
} as const;

/**
 * النتيجة اليومية (0..100) = نسبة العادات المُنجزة من المستحقّة اليوم.
 * إتمام عادة يرفع النتيجة فوراً؛ وإلغاؤها أو فواتها يُبقيها منخفضة (هبوط مرئي).
 * إذا لا شيء مستحقّ اليوم تُعتبر النتيجة مكتملة (يوم راحة).
 */
export function computeDailyScore(dueCount: number, completedCount: number): number {
  if (dueCount <= 0) return 100;
  const clamped = Math.max(0, Math.min(completedCount, dueCount));
  return Math.round((clamped / dueCount) * 100);
}

/** هل تؤهّل النتيجة اليومية للحفاظ على الـstreak؟ */
export function qualifiesForStreak(dailyScore: number): boolean {
  return dailyScore >= SCORING.STREAK_THRESHOLD;
}

/**
 * نقاط الخبرة المعروضة عند إتمام عادة (لنافذة المكافأة)، مع مكافأة تصاعدية
 * للـstreak: كل يوم في السلسلة يضيف نقطة حتى سقف XP_STREAK_BONUS_CAP.
 */
export function xpForCompletion(currentStreak: number): number {
  const bonus = Math.min(Math.max(currentStreak, 0), SCORING.XP_STREAK_BONUS_CAP);
  return SCORING.XP_PER_COMPLETION + bonus;
}

/**
 * streak عادة واحدة: عدد أيام الاستحقاق المتتالية المُنجزة رجوعاً من اليوم.
 * الأيام غير المستحقّة (خارج التكرار) تُتخطّى ولا تكسر السلسلة.
 * @param completedDates تواريخ الإتمام (YYYY-MM-DD).
 * @param completedToday هل أُنجزت اليوم؟ (قد لا تكون بعد في المجموعة أثناء التحديث التفاؤلي)
 */
export function computeHabitStreak(
  completedDates: Set<string>,
  frequency: Frequency,
  weekdays: Weekday[],
  todayKey: string,
  completedToday: boolean
): number {
  let streak = 0;
  let cursor = todayKey;
  // إن كان اليوم مستحقّاً ولم يُنجز بعد، ابدأ العدّ من الأمس حتى لا تُكسر السلسلة.
  if (isDueOn(frequency, weekdays, cursor) && !completedToday) {
    cursor = dateKeyOffset(cursor, -1);
  }
  for (let guard = 0; guard < 366; guard++) {
    if (!isDueOn(frequency, weekdays, cursor)) {
      cursor = dateKeyOffset(cursor, -1);
      continue;
    }
    if (completedDates.has(cursor) || (cursor === todayKey && completedToday)) {
      streak++;
      cursor = dateKeyOffset(cursor, -1);
    } else {
      break;
    }
  }
  return streak;
}

/**
 * streak الأداء العام: عدد الأيام المتتالية المؤهّلة (نتيجتها ≥ العتبة)
 * رجوعاً من اليوم. اليوم الحالي يُحتسب فقط إذا كان مؤهّلاً الآن.
 * @param qualifyingDates تواريخ الأيام التي بلغت العتبة (عدا اليوم).
 * @param todayQualifies هل اليوم الحالي مؤهّل الآن؟
 */
export function computeOverallStreak(
  qualifyingDates: Set<string>,
  todayKey: string,
  todayQualifies: boolean
): number {
  let streak = 0;
  let cursor = todayKey;
  if (!todayQualifies) cursor = dateKeyOffset(cursor, -1);
  for (let guard = 0; guard < 3660; guard++) {
    if (cursor === todayKey) {
      if (todayQualifies) {
        streak++;
        cursor = dateKeyOffset(cursor, -1);
      } else break;
    } else if (qualifyingDates.has(cursor)) {
      streak++;
      cursor = dateKeyOffset(cursor, -1);
    } else {
      break;
    }
  }
  return streak;
}

/** إجمالي XP الحتميّ من التاريخ: إتمامات + أيام مثالية. */
export function computeTotalXp(totalCompletions: number, perfectDays: number): number {
  return (
    totalCompletions * SCORING.XP_PER_COMPLETION + perfectDays * SCORING.XP_PERFECT_DAY
  );
}

/** مستوى المستخدم وتقدّمه ضمن المستوى الحالي. */
export function levelFromXp(totalXp: number): {
  level: number;
  intoLevel: number;
  span: number;
} {
  const span = SCORING.XP_PER_LEVEL;
  const safe = Math.max(0, totalXp);
  return { level: Math.floor(safe / span) + 1, intoLevel: safe % span, span };
}
