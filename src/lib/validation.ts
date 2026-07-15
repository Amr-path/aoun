// عون — طبقة التحقّق من المدخلات (zod).
// مصدر الحقيقة الوحيد لأشكال أجسام الطلبات القادمة من الواجهة أو الجوّال.
// يستبدل تحويلات `as` غير الآمنة في مسارات الـAPI بتحقّق فعليّ عند الحدود.
import { z } from "zod";
import { COLOR_KEYS, type ColorKey, type Weekday } from "./types";

/** وقت "HH:mm" بنظام 24 ساعة. */
export const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "صيغة الوقت يجب أن تكون HH:mm");

/** تكرار العادة. */
export const frequencySchema = z.enum(["daily", "weekly"]);

/** مفتاح لون من مفاتيح الحديقة السبعة الصالحة فقط. */
export const colorKeySchema = z.enum(
  COLOR_KEYS as [ColorKey, ...ColorKey[]]
);

/** يوم أسبوع 0..6 (0=الأحد). */
export const weekdaySchema = z
  .number()
  .int()
  .gte(0)
  .lte(6)
  .transform((n) => n as Weekday);

/** مصفوفة أيام الأسبوع للتكرار المخصّص. */
export const weekdaysSchema = z.array(weekdaySchema).min(1).max(7);

/** خطوات صغيرة (micro-steps). */
const microStepsSchema = z.array(z.string().max(200)).max(20);

/** مواصفات عادة عند الإنشاء أو الـonboarding. */
export const onboardingHabitInputSchema = z.object({
  title: z.string().trim().min(1, "العنوان مطلوب").max(100),
  emoji: z.string().trim().min(1).max(16),
  frequency: frequencySchema,
  weekdays: weekdaysSchema,
  scheduledAt: timeSchema,
  microSteps: microStepsSchema,
  colorKey: colorKeySchema,
  apiRefined: z.boolean().optional(),
});

/** تعديل جزئيّ لعادة قائمة (كل الحقول اختيارية). */
export const habitPatchSchema = z
  .object({
    frequency: frequencySchema.optional(),
    weekdays: weekdaysSchema.optional(),
    scheduledAt: timeSchema.optional(),
    title: z.string().trim().min(1).max(100).optional(),
    emoji: z.string().trim().min(1).max(16).optional(),
    colorKey: colorKeySchema.optional(),
    // مهلة التذكير قبل الموعد — قيم محدّدة فقط (كما في واجهة الإدارة).
    reminderOffsetMin: z
      .union([z.literal(0), z.literal(15), z.literal(30), z.literal(60)])
      .optional(),
    // أرشفة العادة أو إعادتها (بدل الحذف المدمّر للسجلّات).
    archived: z.boolean().optional(),
  })
  .refine((p) => Object.keys(p).length > 0, {
    message: "لا يوجد حقل للتعديل",
  });

/** إجابات التشخيص الأوليّ (5 أسئلة). */
export const diagnosticSchema = z.object({
  lifestyle: z.string().max(500),
  energyLevel: z.enum(["low", "medium", "high"]),
  focusArea: z
    .array(z.enum(["spiritual", "physical", "mental", "sleep", "social"]))
    .min(1),
  wakeTime: timeSchema,
  mainStruggle: z.string().max(500),
});

/** جسم طلب الـonboarding. */
export const onboardingBodySchema = z.object({
  diagnostic: diagnosticSchema,
  habits: z.array(onboardingHabitInputSchema).min(1).max(7),
});

/** مفتاح تاريخ YYYY-MM-DD. */
export const dateKeySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "التاريخ يجب أن يكون YYYY-MM-DD");

/** جسم تسجيل حالة عادة في يوم. */
export const logHabitSchema = z.object({
  date: dateKeySchema,
  completed: z.boolean(),
});

/** يتحقّق أن السلسلة مُعرّف IANA صالح لمنطقة زمنية. */
export function isValidTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** تعديل بيانات المستخدم (الاسم/المنطقة الزمنية). */
export const userPatchSchema = z.object({
  name: z.string().trim().max(80).optional(),
  timezone: z
    .string()
    .refine(isValidTimeZone, "منطقة زمنية غير صالحة")
    .optional(),
});

/** يقرأ جسم JSON ويتحقّق منه؛ يعيد null عند فشل التحليل أو التحقّق. */
export async function parseJson<T>(
  req: Request,
  schema: z.ZodType<T>
): Promise<T | null> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return null;
  }
  const result = schema.safeParse(raw);
  return result.success ? result.data : null;
}
