// عون — مجدول التذكيرات: يُحسب بواسطة مسار cron ويرسل Web Push.
// تذكيرٌ قبل موعد العادة بمهلتها، ونداءٌ لطيف عند الفوات.
import "server-only";
import { prisma } from "./db";
import { todayKey, isDueOn } from "./date";
import { getUserPushSubs, sendPushToSubs } from "./push";
import { MISSED_NUDGE } from "./messages";
import { toMinutes, inWindow } from "./timewindow";
import { formatTime12 } from "./time";
import { ar } from "./numerals";
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

function safeWeekdays(raw: string): Weekday[] {
  try {
    return JSON.parse(raw) as Weekday[];
  } catch {
    return [0, 1, 2, 3, 4, 5, 6];
  }
}

function reminderBody(title: string, offset: number): string {
  // أرقام عربية دائماً في نصوص الإشعارات (كانت لاتينية).
  return `${title} بعد ${ar(offset)} دقيقة — استعدّ بهدوء.`;
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
 * نمطان بحسب `windowMin` (يُقيَّد إلى 5..1440):
 * - windowMin < 720: تذكيرات دقيقة لكل عادة — يفترض مجدولاً خارجياً كل 5 دقائق،
 *   فيقع كل موعد في نافذةٍ واحدة فقط. وتقليل التكرار مضمونٌ إضافياً على الجهاز
 *   عبر حقل `tag` في الإشعار (إشعارٌ بنفس الوسم يستبدل سابقه بدل تراكمه).
 * - windowMin >= 720: «الملخّص الصباحي» — دفعة واحدة لكل مستخدم تسرد عادات
 *   اليوم بأوقاتها، بدل وابلٍ من إشعارٍ لكل عادة. مناسب لـcron يعمل مرّةً
 *   يومياً (Vercel Hobby: 05:00 UTC) حيث نافذة 5 دقائق لا تصادف شيئاً أبداً.
 * ملاحظة للإنتاج: لِدَيمومة منع التكرار عبر تشغيلاتٍ مكرّرة/متأخّرة من الخادم،
 * يُنصح بجدول «سجلّ إرسال» (SentReminder) — يتطلّب migration.
 */
export async function runReminders(windowMin = 5): Promise<{
  reminders: number;
  nudges: number;
}> {
  // تقييد النافذة إلى مجالٍ معقول (5 دقائق..يوم كامل).
  const win = Math.min(1440, Math.max(5, Math.floor(windowMin)));
  const digestMode = win >= 720;

  const users = (await prisma.user.findMany({
    select: { id: true, timezone: true },
  })) as { id: string; timezone: string }[];

  let reminders = 0;
  let nudges = 0;

  for (const u of users) {
    const tz = u.timezone || "Asia/Riyadh";
    const today = todayKey(tz);
    const now = nowMinutes(tz);

    // اشتراكات الجهاز تُجلب مرّة واحدة لكل مستخدم (بدل مرّةٍ لكل عادة مستحقّة).
    const [rows, logs, subs] = (await Promise.all([
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
      getUserPushSubs(u.id),
    ])) as [HabitRow[], { habitId: string }[], Awaited<ReturnType<typeof getUserPushSubs>>];

    // بلا أجهزةٍ مشتركة لا داعي لفحص العادات.
    if (subs.length === 0) continue;

    const done = new Set(logs.map((l) => l.habitId));

    // ─── نمط «الملخّص الصباحي»: دفعة واحدة تسرد عادات اليوم ───
    if (digestMode) {
      const dueToday = rows
        .filter((h) => isDueOn(h.frequency as Frequency, safeWeekdays(h.weekdays), today))
        .sort((a, b) => toMinutes(a.scheduledAt) - toMinutes(b.scheduledAt));
      if (dueToday.length === 0) continue;

      const list = dueToday
        .map((h) => `${h.title} ${formatTime12(h.scheduledAt)}`)
        .join("، ");
      const sent = await sendPushToSubs(subs, {
        title: "عون — الملخّص الصباحي",
        body: `عاداتك اليوم: ${list}`,
        url: "/dashboard",
        tag: `digest-${today}`,
      });
      if (sent > 0) reminders++;
      continue;
    }

    // ─── النمط الدقيق: تذكيرٌ لكل عادة ضمن نافذتها ───
    for (const h of rows) {
      const weekdays = safeWeekdays(h.weekdays);
      if (!isDueOn(h.frequency as Frequency, weekdays, today)) continue;

      const sched = toMinutes(h.scheduledAt);
      const offset = h.reminderOffsetMin ?? 30;

      // تذكيرٌ قبل الموعد.
      if (inWindow(now, sched - offset, win)) {
        const sent = await sendPushToSubs(subs, {
          title: "عون — تذكيرٌ لطيف",
          body: reminderBody(h.title, offset),
          url: "/dashboard",
          tag: `rem-${h.id}`,
        });
        if (sent > 0) reminders++;
      }

      // نداءٌ لطيف عند الفوات (بعد الموعد بساعتين) إن لم تُنجَز.
      if (!done.has(h.id) && inWindow(now, sched + 120, win)) {
        const sent = await sendPushToSubs(subs, {
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
