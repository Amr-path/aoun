import { NextResponse } from "next/server";
import { runReminders } from "@/lib/reminders";

export const dynamic = "force-dynamic";

// GET /api/cron/reminders — يُستدعى دورياً (Vercel Cron أو أي مجدول خارجي).
// محميّ بـ CRON_SECRET عبر ترويسة Authorization: Bearer <secret>.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  // fail-closed: بلا سرٍّ صالح مضبوط، المسار مرفوض دائماً — لا يصبح عاماً أبداً.
  if (!secret || secret === "change-me-please" || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const result = await runReminders();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("cron reminders", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
