// عون — الأنواع الأساسية للنطاق (domain types)
// مصدر الحقيقة الوحيد لأشكال البيانات المتبادلة بين الواجهة والخادم.

/** مفاتيح ألوان اللكنة (accent) الهادئة المعتمدة في نظام التصميم. */
export type ColorKey = "sage" | "clay" | "lavender" | "sky" | "amber" | "blush";

/** كل مفاتيح الألوان (للتحقّق والتكرار). */
export const COLOR_KEYS: ColorKey[] = ["sage", "clay", "lavender", "sky", "amber", "blush"];

/** تكرار العادة. */
export type Frequency = "daily" | "weekly";

/** يوم الأسبوع: 0=الأحد ... 6=السبت. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** العادة كما تُستهلك في الواجهة (الحقول المُفكَّكة من JSON). */
export interface Habit {
  id: string;
  title: string;
  emoji: string;
  frequency: Frequency;
  weekdays: Weekday[];
  /** الوقت المجدول "HH:mm" (24h). */
  scheduledAt: string;
  apiRefined: boolean;
  microSteps: string[];
  reminderOffsetMin: number;
  colorKey: ColorKey;
  position: number;
  archived: boolean;
}

/** حالة عادة في يوم محدد. */
export interface DailyLog {
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  completedAt: string | null;
}

/** عادة مع حالتها اليومية وعدّاد الـstreak — الوحدة التي تعرضها البطاقة. */
export interface HabitWithStatus extends Habit {
  completedToday: boolean;
  /** عدد الأيام المتتالية التي أُنجزت فيها هذه العادة. */
  streak: number;
  /** هل هذه العادة مستحقّة اليوم بحسب التكرار؟ */
  dueToday: boolean;
}

/** نتيجة المستخدم وحالة التلعيب. */
export interface UserScore {
  currentScore: number; // 0..100
  streakCount: number;
  bestStreak: number;
  totalXp: number;
  lastScoredDate: string | null;
}

/** إجابات التشخيص الأولي (5 أسئلة). */
export interface DiagnosticAnswers {
  lifestyle: string;
  energyLevel: "low" | "medium" | "high";
  focusArea: FocusArea[];
  wakeTime: string; // HH:mm
  mainStruggle: string;
}

export type FocusArea =
  | "spiritual" // روحي
  | "physical" // بدني
  | "mental" // ذهني/تركيز
  | "sleep" // نوم
  | "social"; // اجتماعي

// ─────────────────────────────────────────────────────────────
// عقد طبقة خدمة الـLLM (تنقيح العادات المخصصة)
// ─────────────────────────────────────────────────────────────

/** الحمولة المُرسَلة لواجهة التنقيح. */
export interface RefineHabitRequest {
  rawText: string;
  context?: {
    focusAreas?: FocusArea[];
    wakeTime?: string;
    locale?: string;
  };
}

/** الاستجابة المُنقّحة القادمة من الواجهة. */
export interface RefineHabitResponse {
  title: string;
  emoji: string;
  microSteps: string[];
  /** أوقات مقترحة "HH:mm". */
  suggestedTimes: string[];
  frequency: Frequency;
  weekdays: Weekday[];
  colorKey: ColorKey;
}
