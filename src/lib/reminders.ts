// عون — مجدول التذكيرات: يُحسب بواسطة مسار cron ويرسل Web Push.
// تذكيرٌ قبل موعد العادة بمهلتها، ونداءٌ لطيف عند الفوات.
import "server-only";
import { prisma } from "./db";
import { todayKey, isDueOn } from "./date";
import { sendPushToUser } from "./push";
import { MISSED_NUDGE } from "./messages";
import type { Weekday, Frequency } from "./types";

/** دقائق منذ منتصف الليل في منطقةٍ زمنية. */
function nowMinutes(tz: string): number {
  const s = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
  return toMinutes(s);
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

/** هل «الآن» ضمن نافذة [target, target+window) مع الالتفاف حول منتصف الليل؟ */
function inWindow(now: number, target: number, windowMin: number): boolean {
  const t = ((target % 1440) + 1440) % 1440;
  let diff = now - t;
  if (diff < 0) diff += 1440;
  return diff < windowMin;
}

function safeWeekdays(raw: string): Weekday[] {
  try {
    return JSON.parse(raw) as Weekday[];
  } catch {
    return [0, 1, 2, 3, 4, 5, 6];
  }
}

function reminderBody(title: string, offset: number): string {
  return `${title} بعد ${offset} دقيقة — استعدّ بهدوء.`;
}

type HabitRow = {
  id: string;
  title: string;
  frequency: string;
  weekdays: string;
  scheduledAt: string;
  reminderOffsetMin: number;
};

/**
 * يفحص كل المستخدمين ويرسل التذكيرات المستحقّة الآن.
 * يُستدعى كل 5 دقائق (vercel.json: `*​/5 * * * *`)، و windowMin=5 يطابق التردّد
 * تماماً فيقع كل موعد في نافذةٍ واحدة فقط. وتقليل التكرار مضمونٌ إضافياً على الجهاز
 * عبر حقل `tag` في الإشعار (إشعارٌ بنفس الوسم يستبدل سابقه بدل تراكمه).
 * ملاحظة للإنتاج: لِدَيمومة منع التكرار عبر تشغيلاتٍ مكرّرة/متأخّرة من الخادم،
 * يُنصح بجدول «سجلّ إرسال» (SentReminder) — يتطلّب migration.
 */
export async function runReminders(windowMin = 5): Promise<{
  reminders: number;
  nudges: number;
}> {
  const users = (await prisma.user.findMany({
    select: { id: true, timezone: true },
  })) as { id: string; timezone: string }[];

  let reminders = 0;
  let nudges = 0;

  for (const u of users) {
    const tz = u.timezone || "Asia/Riyadh";
    const today = todayKey(tz);
    const now = nowMinutes(tz);

    const [rows, logs] = (await Promise.all([
      prisma.habit.findMany({
        where: { userId: u.id, archived: false },
        select: {
          id: true,
          title: true,
          frequency: true,
          weekdays: true,
          scheduledAt: true,
          reminderOffsetMin: true,
        },
      }),
      prisma.dailyLog.findMany({
        where: { userId: u.id, date: today, completed: true },
        select: { habitId: true },
      }),
    ])) as [HabitRow[], { habitId: string }[]];

    const done = new Set(logs.map((l) => l.habitId));

    for (const h of rows) {
      const weekdays = safeWeekdays(h.weekdays);
      if (!isDueOn(h.frequency as Frequency, weekdays, today)) continue;

      const sched = toMinutes(h.scheduledAt);
      const offset = h.reminderOffsetMin ?? 30;

      // تذكيرٌ قبل الموعد.
      if (inWindow(now, sched - offset, windowMin)) {
        const sent = await sendPushToUser(u.id, {
          title: "عون — تذكيرٌ لطيف",
          body: reminderBody(h.title, offset),
          url: "/dashboard",
          tag: `rem-${h.id}`,
        });
        if (sent > 0) reminders++;
      }

      // نداءٌ لطيف عند الفوات (بعد الموعد بساعتين) إن لم تُنجَز.
      if (!done.has(h.id) && inWindow(now, sched + 120, windowMin)) {
        const sent = await sendPushToUser(u.id, {
          title: `عون — ${h.title}`,
          body: MISSED_NUDGE,
          url: "/dashboard",
          tag: `nudge-${h.id}`,
        });
        if (sent > 0) nudges++;
      }
    }
  }

  return { reminders, nudges };
}
