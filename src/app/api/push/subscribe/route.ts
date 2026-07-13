import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";

interface PushSub {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

// POST /api/push/subscribe — يحفظ اشتراك الجهاز.
export async function POST(req: Request) {
  try {
    const sub = (await req.json()) as PushSub;
    if (!sub?.endpoint || !sub.keys?.p256dh || !sub.keys?.auth) {
      return NextResponse.json({ error: "اشتراك غير صالح" }, { status: 400 });
    }
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "غير مسجّل" }, { status: 401 });
    // منع «خطف» الاشتراك: إن كان الـendpoint مسجّلاً لمستخدم آخر، ارفض بدل إعادة إسناده.
    const existing = await prisma.pushSubscription.findUnique({
      where: { endpoint: sub.endpoint },
      select: { userId: true },
    });
    if (existing && existing.userId !== userId) {
      return NextResponse.json({ error: "الاشتراك مملوك لمستخدم آخر" }, { status: 403 });
    }
    await prisma.pushSubscription.upsert({
      where: { endpoint: sub.endpoint },
      update: { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
      create: {
        userId,
        endpoint: sub.endpoint,
        p256dh: sub.keys.p256dh,
        auth: sub.keys.auth,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("push subscribe", err);
    return NextResponse.json({ error: "تعذّر حفظ الاشتراك" }, { status: 500 });
  }
}

// DELETE /api/push/subscribe — يلغي اشتراك الجهاز.
export async function DELETE(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "غير مسجّل" }, { status: 401 });
    const { endpoint } = (await req.json()) as { endpoint?: string };
    if (!endpoint) return NextResponse.json({ error: "endpoint مطلوب" }, { status: 400 });
    // مقيَّد بالملكية: لا يستطيع المستخدم إلغاء اشتراك جهاز مستخدم آخر.
    await prisma.pushSubscription.deleteMany({ where: { endpoint, userId } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("push unsubscribe", err);
    return NextResponse.json({ error: "تعذّر الإلغاء" }, { status: 500 });
  }
}
