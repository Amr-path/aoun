import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";

// PATCH /api/user — يحدّث اسم المستخدم أو منطقته الزمنية.
export async function PATCH(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "غير مسجّل" }, { status: 401 });

    const { name, timezone } = (await req.json()) as {
      name?: string;
      timezone?: string;
    };

    await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined ? { name: name.trim() || null } : {}),
        ...(timezone ? { timezone } : {}),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("user PATCH", err);
    return NextResponse.json({ error: "تعذّر الحفظ" }, { status: 500 });
  }
}
