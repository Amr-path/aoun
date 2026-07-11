// عون — أدوات التاريخ. كل السجلّات اليومية تُخزّن بصيغة YYYY-MM-DD بتوقيت المستخدم
// لتفادي التباس المناطق الزمنية بين الخادم والعميل.
import type { Weekday } from "./types";

/** يُرجع تاريخ اليوم بصيغة YYYY-MM-DD في منطقة زمنية محددة. */
export function todayKey(timeZone = "Asia/Riyadh", now = new Date()): string {
  // en-CA يُنتج صيغة YYYY-MM-DD مباشرة.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** يُرجع مفتاح تاريخ مُزاحاً بعدد أيام (سالب للماضي). */
export function dateKeyOffset(baseKey: string, offsetDays: number): string {
  const [y, m, d] = baseKey.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + offsetDays);
  return dt.toISOString().slice(0, 10);
}

/** يوم الأسبوع (0=الأحد) لمفتاح تاريخ. */
export function weekdayOf(dateKey: string): Weekday {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay() as Weekday;
}

/** هل العادة مستحقّة في هذا اليوم بحسب تكرارها؟ */
export function isDueOn(
  frequency: "daily" | "weekly",
  weekdays: Weekday[],
  dateKey: string
): boolean {
  if (frequency === "daily") return true;
  return weekdays.includes(weekdayOf(dateKey));
}

/** يُرجع مصفوفة مفاتيح تواريخ آخر n يوماً (تصاعدياً، بما يشمل اليوم). */
export function lastNDays(n: number, timeZone = "Asia/Riyadh"): string[] {
  const today = todayKey(timeZone);
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(dateKeyOffset(today, -i));
  return out;
}
