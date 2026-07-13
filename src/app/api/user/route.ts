import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import { parseJson, userPatchSchema } from "@/lib/validation";

// PATCH /api/user — يحدّث اسم المستخدم أو منطقته الزمنية.
export async function PATCH(req: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "غير مسجّل", code: "unauthorized" }, { status: 401 });

  const body = await parseJson(req, userPatchSchema);
  if (!body) {
    return NextResponse.json({ error: "مدخلات غير صالحة", code: "invalid_input" }, { status: 400 });
  }
  const { name, timezone } = body;

  try {
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
    return NextResponse.json({ error: "تعذّر الحفظ", code: "server_error" }, { status: 500 });
  }
}
