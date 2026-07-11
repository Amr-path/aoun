// عون — طبقة حساب التحليلات: شبكة السنة (٣٦٥ يوماً) + الاتساق الأسبوعي + ملخّص.
import "server-only";
import { prisma } from "./db";
import { todayKey, lastNDays, isDueOn } from "./date";
import { computeDailyScore, qualifiesForStreak, computeOverallStreak } from "./scoring";
import type { Frequency, Weekday } from "./types";

export interface DayCell {
  date: string;
  level: number; // 0..4
  completed: number;
  due: number;
}

export interface WeekPoint {
  index: number; // 1..8 (الأقدم→الأحدث)
  score: number; // 0..100
}

export interface Analytics {
  days: DayCell[];
  weeks: WeekPoint[];
  totalCompletions: number;
  activeDays: number;
  perfectDays: number;
  currentStreak: number;
  bestStreak: number;
}

type HabitRow = { id: string; frequency: string; weekdays: string };

function parseWeekdays(raw: string): Weekday[] {
  try {
    return JSON.parse(raw) as Weekday[];
  } catch {
    return [0, 1, 2, 3, 4, 5, 6];
  }
}

function levelOf(due: number, completed: number): number {
  if (due <= 0) return 0;
  const ratio = completed / due;
  if (ratio <= 0) return 0;
  if (ratio >= 1) return 4;
  return Math.max(1, Math.ceil(ratio * 4));
}

export async function getAnalytics(userId: string): Promise<Analytics> {
  const tz = "Asia/Riyadh";
  const today = todayKey(tz);

  const [rows, logs] = (await Promise.all([
    prisma.habit.findMany({
      where: { userId, archived: false },
      select: { id: true, frequency: true, weekdays: true },
    }),
    prisma.dailyLog.findMany({
      where: { userId, completed: true },
      select: { date: true, habitId: true },
    }),
  ])) as [HabitRow[], { date: string; habitId: string }[]];

  const habits = rows.map((h) => ({
    id: h.id,
    frequency: h.frequency as Frequency,
    weekdays: parseWeekdays(h.weekdays),
  }));

  const completedByDay = new Map<string, Set<string>>();
  const activeDates = new Set<string>();
  for (const l of logs) {
    if (!completedByDay.has(l.date)) completedByDay.set(l.date, new Set());
    completedByDay.get(l.date)!.add(l.habitId);
    activeDates.add(l.date);
  }

  const dayKeys = lastNDays(365, tz);
  const days: DayCell[] = [];
  const qualifyingDates = new Set<string>();
  let bestStreak = 0;
  let run = 0;
  let perfectDays = 0;
  let todayScore = 0;

  for (const date of dayKeys) {
    const due = habits.filter((h) => isDueOn(h.frequency, h.weekdays, date));
    const doneSet = completedByDay.get(date) ?? new Set<string>();
    const completed = due.filter((h) => doneSet.has(h.id)).length;
    const score = computeDailyScore(due.length, completed);

    if (date === today) todayScore = score;
    if (due.length > 0 && completed >= due.length) perfectDays++;

    if (qualifiesForStreak(score)) {
      if (date !== today) qualifyingDates.add(date);
      run++;
      bestStreak = Math.max(bestStreak, run);
    } else {
      run = 0;
    }

    days.push({ date, level: levelOf(due.length, completed), completed, due: due.length });
  }

  const currentStreak = computeOverallStreak(
    qualifyingDates,
    today,
    qualifiesForStreak(todayScore)
  );

  // اتساق آخر 8 أسابيع (متوسّط النتيجة اليومية لكل أسبوع).
  const last56 = days.slice(-56);
  const weeks: WeekPoint[] = [];
  for (let w = 0; w < 8; w++) {
    const chunk = last56.slice(w * 7, w * 7 + 7);
    if (chunk.length === 0) continue;
    const avg =
      chunk.reduce((sum, d) => sum + computeDailyScore(d.due, d.completed), 0) /
      chunk.length;
    weeks.push({ index: w + 1, score: Math.round(avg) });
  }

  return {
    days,
    weeks,
    totalCompletions: logs.length,
    activeDays: activeDates.size,
    perfectDays,
    currentStreak,
    bestStreak: Math.max(bestStreak, currentStreak),
  };
}
