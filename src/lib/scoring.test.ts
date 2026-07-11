// عون — اختبارات منطق التلعيب. تُشغَّل عبر: npm run test
// (node --import tsx --test)
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  computeDailyScore,
  qualifiesForStreak,
  xpForCompletion,
  computeHabitStreak,
  computeOverallStreak,
  computeTotalXp,
  levelFromXp,
  SCORING,
} from "./scoring";
import type { Weekday } from "./types";

const ALL_DAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6];

test("computeDailyScore: نسبة صحيحة ومقيّدة", () => {
  assert.equal(computeDailyScore(0, 0), 100, "لا مستحقّات = يوم راحة");
  assert.equal(computeDailyScore(7, 0), 0);
  assert.equal(computeDailyScore(7, 7), 100);
  assert.equal(computeDailyScore(4, 3), 75);
  assert.equal(computeDailyScore(3, 2), 67, "تقريب");
  assert.equal(computeDailyScore(7, 99), 100, "لا يتجاوز 100");
  assert.equal(computeDailyScore(7, -5), 0, "لا ينزل تحت 0");
});

test("qualifiesForStreak: العتبة", () => {
  assert.equal(qualifiesForStreak(SCORING.STREAK_THRESHOLD), true);
  assert.equal(qualifiesForStreak(SCORING.STREAK_THRESHOLD - 1), false);
  assert.equal(qualifiesForStreak(100), true);
});

test("xpForCompletion: أساس + مكافأة streak مقيّدة", () => {
  assert.equal(xpForCompletion(0), SCORING.XP_PER_COMPLETION);
  assert.equal(xpForCompletion(5), SCORING.XP_PER_COMPLETION + 5);
  assert.equal(
    xpForCompletion(999),
    SCORING.XP_PER_COMPLETION + SCORING.XP_STREAK_BONUS_CAP,
    "المكافأة مسقوفة"
  );
});

test("computeHabitStreak: يومي متتالٍ", () => {
  const today = "2026-07-10";
  const dates = new Set(["2026-07-08", "2026-07-09"]); // أمس وأول أمس
  // لم يُنجز اليوم بعد → يبدأ من الأمس = 2
  assert.equal(computeHabitStreak(dates, "daily", ALL_DAYS, today, false), 2);
  // أُنجز اليوم أيضاً → 3
  assert.equal(computeHabitStreak(dates, "daily", ALL_DAYS, today, true), 3);
});

test("computeHabitStreak: فجوة تكسر السلسلة", () => {
  const today = "2026-07-10";
  const dates = new Set(["2026-07-09", "2026-07-07"]); // فجوة يوم 8
  assert.equal(computeHabitStreak(dates, "daily", ALL_DAYS, today, true), 2);
});

test("computeHabitStreak: أسبوعي يتخطّى الأيام غير المستحقّة", () => {
  // مستحقّ الإثنين/الأربعاء/الجمعة فقط. 2026-07-10 جمعة.
  const week: Weekday[] = [1, 3, 5];
  const today = "2026-07-10"; // جمعة
  // الجمعة 07-10، الأربعاء 07-08، الإثنين 07-06
  const dates = new Set(["2026-07-08", "2026-07-06"]);
  assert.equal(computeHabitStreak(dates, "weekly", week, today, true), 3);
});

test("computeOverallStreak: أيام مؤهّلة متتالية", () => {
  const today = "2026-07-10";
  const q = new Set(["2026-07-09", "2026-07-08"]);
  assert.equal(computeOverallStreak(q, today, true), 3);
  assert.equal(computeOverallStreak(q, today, false), 2, "اليوم غير مؤهّل بعد");
});

test("computeOverallStreak: يوم غير مؤهّل يقطع", () => {
  const today = "2026-07-10";
  const q = new Set(["2026-07-09"]); // 07-08 غير مؤهّل
  assert.equal(computeOverallStreak(q, today, true), 2);
});

test("computeTotalXp: حتميّ", () => {
  assert.equal(
    computeTotalXp(10, 2),
    10 * SCORING.XP_PER_COMPLETION + 2 * SCORING.XP_PERFECT_DAY
  );
  assert.equal(computeTotalXp(0, 0), 0);
});

test("levelFromXp", () => {
  assert.deepEqual(levelFromXp(0), { level: 1, intoLevel: 0, span: 500 });
  assert.deepEqual(levelFromXp(500), { level: 2, intoLevel: 0, span: 500 });
  assert.deepEqual(levelFromXp(720), { level: 2, intoLevel: 220, span: 500 });
});
