import { NextResponse } from "next/server";
import { runReminders } from "@/lib/reminders";

export const dynamic = "force-dynamic";

// GET /api/cron/reminders?window=<دقائق> — يُستدعى دورياً (Vercel Cron أو أي مجدول خارجي).
// محميّ بـ CRON_SECRET عبر ترويسة Authorization: Bearer <secret>.
// `window` (اختياري، يُقيَّد 5..1440): نافذة المطابقة بالدقائق.
// - مجدول خارجي كل 5 دقائق: بلا معامل (الافتراضي 5) → تذكيرات دقيقة لكل عادة.
// - Vercel Cron اليومي (05:00 UTC): window=1440 → «الملخّص الصباحي» دفعةً واحدة،
//   إذ إنّ نافذة 5 دقائق مع تشغيلٍ يوميٍّ واحد لا تصادف أيّ موعدٍ أبداً.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  // fail-closed: بلا سرٍّ صالح مضبوط، المسار مرفوض دائماً — لا يصبح عاماً أبداً.
  if (!secret || secret === "change-me-please" || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const raw = new URL(req.url).searchParams.get("window");
    const parsed = raw === null ? NaN : Number.parseInt(raw, 10);
    const windowMin = Number.isFinite(parsed)
      ? Math.min(1440, Math.max(5, parsed))
      : 5;
    const result = await runReminders(windowMin);
    return NextResponse.json({ ok: true, window: windowMin, ...result });
  } catch (err) {
    console.error("cron reminders", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
