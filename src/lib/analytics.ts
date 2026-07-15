// عون — طبقة حساب التحليلات: شبكة السنة (٣٦٥ يوماً) + الاتساق الأسبوعي + ملخّص.
import "server-only";
import { prisma } from "./db";
import { todayKey, dateKeyOffset } from "./date";
import { qualifiesForStreak, computeOverallStreak } from "./scoring";
import { summarizeHistory, HISTORY_WINDOW_DAYS } from "./history";
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
  /** هل في هذا الأسبوع أثرٌ فعلي؟ false = قبل أول نشاطٍ للمستخدم (يُعرض «—» لا ٠). */
  hasData: boolean;
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
  // «اليوم» بتوقيت المستخدم؛ ونافذة 365 يوماً موحّدة مع اللوحة.
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { timezone: true },
  });
  const tz = user?.timezone || "Asia/Riyadh";
  const today = todayKey(tz);
  const windowStart = dateKeyOffset(today, -(HISTORY_WINDOW_DAYS - 1));

  const [rows, logs] = (await Promise.all([
    prisma.habit.findMany({
      where: { userId, archived: false },
      select: { id: true, frequency: true, weekdays: true },
    }),
    prisma.dailyLog.findMany({
      where: { userId, completed: true, date: { gte: windowStart } },
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

  const { days: dayStats, qualifyingDates, bestStreak, perfectDays, todayScore } =
    summarizeHistory(habits, completedByDay, today, tz, HISTORY_WINDOW_DAYS);

  // أول نشاطٍ فعلي (أقدم إتمام في النافذة) — لقصّ الفراغ السابق لانضمام المستخدم،
  // فلا تُعرض أسابيع «صفر» زائفة عن زمنٍ لم يكن فيه مستخدماً أصلاً.
  const firstActive = activeDates.size > 0 ? [...activeDates].sort()[0] : null;

  const allDays: DayCell[] = dayStats.map((d) => ({
    date: d.date,
    level: levelOf(d.due, d.completed),
    completed: d.completed,
    due: d.due,
  }));
  // بلا أي نشاط: نكتفي بالأسبوع الحالي بدل سنةٍ فارغة كاملة.
  const days = firstActive
    ? allDays.filter((d) => d.date >= firstActive)
    : allDays.slice(-7);

  const currentStreak = computeOverallStreak(
    qualifyingDates,
    today,
    qualifiesForStreak(todayScore)
  );

  // اتساق آخر 8 أسابيع (متوسّط النتيجة اليومية لكل أسبوع)،
  // مع قصّ الأسابيع الفارغة كلياً السابقة لأول نشاط.
  const last56 = dayStats.slice(-56);
  const weeks: WeekPoint[] = [];
  for (let w = 0; w < 8; w++) {
    const chunk = last56.slice(w * 7, w * 7 + 7);
    if (chunk.length === 0) continue;
    const hasData = firstActive !== null && chunk.some((d) => d.date >= firstActive);
    const isCurrent = w === 7;
    // أسبوعٌ بأكمله قبل أول نشاط: يُقصّ (إلا الأسبوع الحالي فيبقى مَعلماً بلا بيانات).
    if (!hasData && !isCurrent) continue;
    const avg = chunk.reduce((sum, d) => sum + d.score, 0) / chunk.length;
    weeks.push({ index: w + 1, score: hasData ? Math.round(avg) : 0, hasData });
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
