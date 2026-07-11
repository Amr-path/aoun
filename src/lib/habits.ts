// عون — طبقة الخدمة الخادمية للعادات ولوحة التحكم.
// تربط قاعدة البيانات (Prisma) بمنطق التلعيب النقيّ (scoring). تُستهلَك من
// API routes ومن مكوّنات الخادم — وستُستهلَك مستقبلاً من تطبيق الجوال عبر نفس الـAPI.
import "server-only";
import { prisma } from "./db";
import { HABIT_LIBRARY, DEFAULT_SEVEN_KEYS, BRAND } from "./constants";
import { todayKey, lastNDays, isDueOn } from "./date";
import {
  computeDailyScore,
  qualifiesForStreak,
  computeHabitStreak,
  computeOverallStreak,
  computeTotalXp,
} from "./scoring";
import type {
  Habit,
  HabitWithStatus,
  UserScore,
  Frequency,
  Weekday,
  ColorKey,
  DiagnosticAnswers,
} from "./types";

const DEMO_EMAIL = "demo@aoun.app";
const HISTORY_DAYS = 90;

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

/** يضمن وجود مستخدم تجريبي (بلا مصادقة بعد) مع السبع عادات وسجلّ نتيجة. */
export async function getOrCreateDemoUser(): Promise<string> {
  const existing = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    select: { id: true },
  });
  if (existing) return existing.id;

  const user = await prisma.user.create({
    data: {
      email: DEMO_EMAIL,
      name: "مستخدم تجريبي",
      onboardedAt: new Date(),
      score: { create: {} },
    },
    select: { id: true },
  });

  const templates = DEFAULT_SEVEN_KEYS.map(
    (k) => HABIT_LIBRARY.find((h) => h.key === k)!
  ).slice(0, BRAND.maxHabits);

  await prisma.habit.createMany({
    data: templates.map((t, i) => ({
      userId: user.id,
      title: t.title,
      emoji: t.emoji,
      frequency: t.frequency,
      weekdays: JSON.stringify(t.weekdays),
      scheduledAt: t.scheduledAt,
      microSteps: JSON.stringify(t.microSteps),
      colorKey: t.colorKey,
      position: i,
    })),
  });

  return user.id;
}

export interface DashboardData {
  dateKey: string;
  habits: HabitWithStatus[];
  score: UserScore;
}

/** يبني لوحة التحكم: العادات مع حالتها اليومية + النتيجة العامة. */
export async function getDashboard(userId: string): Promise<DashboardData> {
  const tz = "Asia/Riyadh";
  const today = todayKey(tz);

  const [rows, logs] = (await Promise.all([
    prisma.habit.findMany({
      where: { userId, archived: false },
      orderBy: { position: "asc" },
    }),
    prisma.dailyLog.findMany({
      where: { userId, completed: true },
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

  // مسح التاريخ لحساب الأيام المؤهّلة + أفضل streak + الأيام المثالية.
  const days = lastNDays(HISTORY_DAYS, tz); // تصاعدي شامل اليوم
  const qualifyingDates = new Set<string>();
  let bestStreak = 0;
  let run = 0;
  let perfectDays = 0;

  for (const day of days) {
    const dueThatDay = habits.filter((h) => isDueOn(h.frequency, h.weekdays, day));
    const completedSet = completedByDay.get(day) ?? new Set<string>();
    const completedCount = dueThatDay.filter((h) => completedSet.has(h.id)).length;
    const score =
      day === today ? currentScore : computeDailyScore(dueThatDay.length, completedCount);

    if (dueThatDay.length > 0 && completedCount >= dueThatDay.length) perfectDays++;

    if (qualifiesForStreak(score)) {
      if (day !== today) qualifyingDates.add(day);
      run++;
      bestStreak = Math.max(bestStreak, run);
    } else {
      run = 0;
    }
  }

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

  // تحديث الحالة المُخزّنة (cache) دون حجب الاستجابة على الأخطاء.
  await prisma.userScore
    .upsert({
      where: { userId },
      update: { ...score },
      create: { userId, ...score },
    })
    .catch(() => void 0);

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
  if (!habit) throw new Error("العادة غير موجودة");

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
  if (!owned) throw new Error("العادة غير موجودة");

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
  const count = await prisma.habit.count({ where: { userId, archived: false } });
  if (count >= BRAND.maxHabits) {
    throw new Error(`الحدّ الأقصى ${BRAND.maxHabits} عادات`);
  }

  await prisma.habit.create({
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
  if (!owned) throw new Error("العادة غير موجودة");

  await prisma.habit.delete({ where: { id: habitId } });
  return getDashboard(userId);
}
