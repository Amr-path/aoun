import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { sendPushToUser } from "@/lib/push";

// POST /api/push/test — يرسل إشعاراً تجريبياً لأجهزة المستخدم.
export async function POST() {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "غير مسجّل" }, { status: 401 });
    const sent = await sendPushToUser(userId, {
      title: "عون — تذكيرٌ لطيف",
      body: "هكذا ستصلك تذكيراتك بلطف قبل موعد كل عادة.",
      url: "/dashboard",
      tag: "aoun-test",
    });
    return NextResponse.json({ ok: true, sent });
  } catch (err) {
    console.error("push test", err);
    return NextResponse.json({ error: "تعذّر الإرسال" }, { status: 500 });
  }
}
