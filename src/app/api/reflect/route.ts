import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { todayKey } from "@/lib/date";

// POST /api/reflect — يحفظ تأمّل اليوم (مزاج 1..5 + ملاحظة).
export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "غير مسجّل" }, { status: 401 });

    const { mood, note } = (await req.json()) as { mood?: number; note?: string };
    if (typeof mood !== "number" || mood < 1 || mood > 5) {
      return NextResponse.json({ error: "المزاج مطلوب" }, { status: 400 });
    }

    const user = (await prisma.user.findUnique({
      where: { id: userId },
      select: { timezone: true },
    })) as { timezone: string } | null;
    const date = todayKey(user?.timezone || "Asia/Riyadh");
    const cleanNote = note?.trim() || null;

    await prisma.reflection.upsert({
      where: { userId_date: { userId, date } },
      update: { mood, note: cleanNote },
      create: { userId, date, mood, note: cleanNote },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("reflect", err);
    return NextResponse.json({ error: "تعذّر الحفظ" }, { status: 500 });
  }
}
