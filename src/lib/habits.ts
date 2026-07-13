// عون — طبقة الخدمة الخادمية للعادات ولوحة التحكم.
// تربط قاعدة البيانات (Prisma) بمنطق التلعيب النقيّ (scoring). تُستهلَك من
// API routes ومن مكوّنات الخادم — وستُستهلَك مستقبلاً من تطبيق الجوال عبر نفس الـAPI.
import "server-only";
import { prisma } from "./db";
import { BRAND } from "./constants";
import { todayKey, dateKeyOffset, isDueOn } from "./date";
import {
  computeDailyScore,
  qualifiesForStreak,
  computeHabitStreak,
  computeOverallStreak,
  computeTotalXp,
} from "./scoring";
import { summarizeHistory, HISTORY_WINDOW_DAYS } from "./history";
import type {
  Habit,
  HabitWithStatus,
  UserScore,
  Frequency,
  Weekday,
  ColorKey,
  DiagnosticAnswers,
} from "./types";

/** العادة أو المورد المطلوب غير موجود (أو ليس مملوكاً للمستخدم) → 404. */
export class NotFoundError extends Error {}
/** تجاوز الحدّ الأقصى للعادات الفعّالة → 409. */
export class HabitLimitError extends Error {}

type HabitRow = {
  id: string;
  title: string;
  emoji: string;
  frequency: string;
  weekdays: string;
  scheduledAt: string;
  apiRefined: boolean;
  microSteps: string;
  reminderOffsetMin: number;
  colorKey: string;
  position: number;
  archived: boolean;
};

/** يحوّل صفّ Prisma إلى نوع النطاق (يفكّ حقول JSON). */
export function mapHabit(row: HabitRow): Habit {
  return {
    id: row.id,
    title: row.title,
    emoji: row.emoji,
    frequency: row.frequency as Frequency,
    weekdays: safeJson<Weekday[]>(row.weekdays, [0, 1, 2, 3, 4, 5, 6]),
    scheduledAt: row.scheduledAt,
    apiRefined: row.apiRefined,
    microSteps: safeJson<string[]>(row.microSteps, []),
    reminderOffsetMin: row.reminderOffsetMin,
    colorKey: row.colorKey as ColorKey,
    position: row.position,
    archived: row.archived,
  };
}

function safeJson<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export interface DashboardData {
  dateKey: string;
  habits: HabitWithStatus[];
  score: UserScore;
}

/** يبني لوحة التحكم: العادات مع حالتها اليومية + النتيجة العامة. */
export async function getDashboard(userId: string): Promise<DashboardData> {
  // «اليوم» يُحسب بتوقيت المستخدم لا بتوقيت الرياض الثابت (تصحيح انحراف حتى 8 ساعات).
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
      orderBy: { position: "asc" },
    }),
    prisma.dailyLog.findMany({
      where: { userId, completed: true, date: { gte: windowStart } },
      select: { habitId: true, date: true },
    }),
  ])) as [HabitRow[], { habitId: string; date: string }[]];

  const habits: Habit[] = rows.map(mapHabit);

  // فهرسة تواريخ الإتمام لكل عادة + لكل يوم.
  const byHabit = new Map<string, Set<string>>();
  const completedByDay = new Map<string, Set<string>>();
  for (const log of logs) {
    if (!byHabit.has(log.habitId)) byHabit.set(log.habitId, new Set());
    byHabit.get(log.habitId)!.add(log.date);
    if (!completedByDay.has(log.date)) completedByDay.set(log.date, new Set());
    completedByDay.get(log.date)!.add(log.habitId);
  }

  // حالة كل عادة اليوم.
  const withStatus: HabitWithStatus[] = habits.map((h) => {
    const dates = byHabit.get(h.id) ?? new Set<string>();
    const completedToday = dates.has(today);
    return {
      ...h,
      completedToday,
      dueToday: isDueOn(h.frequency, h.weekdays, today),
      streak: computeHabitStreak(dates, h.frequency, h.weekdays, today, completedToday),
    };
  });

  // نتيجة اليوم.
  const dueToday = withStatus.filter((h) => h.dueToday);
  const completedTodayCount = dueToday.filter((h) => h.completedToday).length;
  const currentScore = computeDailyScore(dueToday.length, completedTodayCount);
  const todayQualifies = qualifiesForStreak(currentScore);

  // مسح نافذة تاريخية واحدة متّسقة مع التحليلات (تُحسب XP من نفس النافذة).
  const { qualifyingDates, bestStreak, perfectDays } = summarizeHistory(
    habits,
    completedByDay,
    today,
    tz,
    HISTORY_WINDOW_DAYS,
    currentScore // الحالة التفاؤلية لليوم
  );

  const streakCount = computeOverallStreak(qualifyingDates, today, todayQualifies);
  const totalCompletions = logs.length;
  const totalXp = computeTotalXp(totalCompletions, perfectDays);

  const score: UserScore = {
    currentScore,
    streakCount,
    bestStreak: Math.max(bestStreak, streakCount),
    totalXp,
    lastScoredDate: today,
  };

  // GET لا يكتب في القاعدة: أُزيل upsert لـ UserScore (قيمته لا يقرؤها أحد).
  return { dateKey: today, habits: withStatus, score };
}

/** يضبط حالة عادة في يوم محدّد (إتمام/إلغاء) ثم يعيد لوحة محدّثة. */
export async function setHabitStatus(
  userId: string,
  habitId: string,
  date: string,
  completed: boolean
): Promise<DashboardData> {
  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId },
    select: { id: true },
  });
  if (!habit) throw new NotFoundError("العادة غير موجودة");

  await prisma.dailyLog.upsert({
    where: { habitId_date: { habitId, date } },
    update: { completed, completedAt: completed ? new Date() : null },
    create: {
      userId,
      habitId,
      date,
      completed,
      completedAt: completed ? new Date() : null,
    },
  });

  return getDashboard(userId);
}

/** مواصفات عادة عند الـOnboarding (من قالب مقترح أو عادة مخصّصة منقّحة). */
export interface OnboardingHabitInput {
  title: string;
  emoji: string;
  frequency: Frequency;
  weekdays: Weekday[];
  scheduledAt: string;
  microSteps: string[];
  colorKey: ColorKey;
  apiRefined?: boolean;
}

/**
 * يُطبّق نتيجة الـOnboarding: يستبدل عادات المستخدم بالمجموعة المختارة (حدّ 7)،
 * ويحفظ التشخيص ويعلّم المستخدم مُهيّأً. عملية ذرّية (transaction).
 */
export async function applyOnboarding(
  userId: string,
  diagnostic: DiagnosticAnswers,
  habits: OnboardingHabitInput[]
): Promise<DashboardData> {
  const capped = habits.slice(0, BRAND.maxHabits);

  await prisma.$transaction([
    prisma.habit.deleteMany({ where: { userId } }),
    prisma.habit.createMany({
      data: capped.map((h, i) => ({
        userId,
        title: h.title,
        emoji: h.emoji,
        frequency: h.frequency,
        weekdays: JSON.stringify(h.weekdays),
        scheduledAt: h.scheduledAt,
        microSteps: JSON.stringify(h.microSteps),
        colorKey: h.colorKey,
        apiRefined: h.apiRefined ?? false,
        position: i,
      })),
    }),
    prisma.user.update({
      where: { id: userId },
      data: { diagnostic: JSON.stringify(diagnostic), onboardedAt: new Date() },
    }),
  ]);

  return getDashboard(userId);
}

export interface HabitPatch {
  frequency?: Frequency;
  weekdays?: Weekday[];
  scheduledAt?: string;
  title?: string;
  emoji?: string;
  colorKey?: ColorKey;
  reminderOffsetMin?: number;
}

/** يعدّل تفاصيل عادة (العنوان/الإيموجي/اللون/الوقت/التكرار). */
export async function updateHabit(
  userId: string,
  habitId: string,
  patch: HabitPatch
): Promise<DashboardData> {
  const owned = await prisma.habit.findFirst({
    where: { id: habitId, userId },
    select: { id: true },
  });
  if (!owned) throw new NotFoundError("العادة غير موجودة");

  await prisma.habit.update({
    where: { id: habitId },
    data: {
      ...(patch.frequency ? { frequency: patch.frequency } : {}),
      ...(patch.weekdays ? { weekdays: JSON.stringify(patch.weekdays) } : {}),
      ...(patch.scheduledAt ? { scheduledAt: patch.scheduledAt } : {}),
      ...(patch.title ? { title: patch.title } : {}),
      ...(patch.emoji ? { emoji: patch.emoji } : {}),
      ...(patch.colorKey ? { colorKey: patch.colorKey } : {}),
      ...(patch.reminderOffsetMin !== undefined
        ? { reminderOffsetMin: patch.reminderOffsetMin }
        : {}),
    },
  });

  return getDashboard(userId);
}

/** ينشئ عادةً جديدة (يفرض حدّ 7 عادات فعّالة). */
export async function createHabit(
  userId: string,
  input: OnboardingHabitInput
): Promise<DashboardData> {
  // transaction ذرّية: عدّ + إنشاء معاً حتى لا يتجاوز طلبان متزامنان الحدّ.
  await prisma.$transaction(async (tx) => {
    const count = await tx.habit.count({ where: { userId, archived: false } });
    if (count >= BRAND.maxHabits) {
      throw new HabitLimitError(`الحدّ الأقصى ${BRAND.maxHabits} عادات`);
    }
    await tx.habit.create({
      data: {
        userId,
        title: input.title,
        emoji: input.emoji,
        frequency: input.frequency,
        weekdays: JSON.stringify(input.weekdays),
        scheduledAt: input.scheduledAt,
        microSteps: JSON.stringify(input.microSteps),
        colorKey: input.colorKey,
        apiRefined: input.apiRefined ?? false,
        position: count,
      },
    });
  });

  return getDashboard(userId);
}

/** يحذف عادةً (وسجلّاتها اليومية عبر onDelete: Cascade). */
export async function deleteHabit(
  userId: string,
  habitId: string
): Promise<DashboardData> {
  const owned = await prisma.habit.findFirst({
    where: { id: habitId, userId },
    select: { id: true },
  });
  if (!owned) throw new NotFoundError("العادة غير موجودة");

  await prisma.habit.delete({ where: { id: habitId } });
  return getDashboard(userId);
}
