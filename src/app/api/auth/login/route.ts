import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";

// hash وهميّ ثابت لموازنة زمن الردّ عندما لا يوجد الحساب (يمنع كشف وجود البريد).
const DUMMY_HASH = "$2a$10$sJwKCZbHwI7xal/gxvuCzeoi0fWemj5cXez7Kc/qQy.YHTKDIAZtC";

// POST /api/auth/login — يتحقّق من البيانات ويبدأ الجلسة.
export async function POST(req: Request) {
  try {
    const { email, password } = (await req.json()) as {
      email?: string;
      password?: string;
    };
    const mail = email?.trim().toLowerCase();
    if (!mail || !password) {
      return NextResponse.json({ error: "أدخل البريد وكلمة المرور" }, { status: 400 });
    }

    const user = (await prisma.user.findUnique({
      where: { email: mail },
      select: { id: true, password: true },
    })) as { id: string; password: string | null } | null;

    // نُنفّذ bcrypt دائماً (ضد hash وهميّ عند غياب الحساب) لموازنة الزمن.
    const ok = await verifyPassword(password, user?.password || DUMMY_HASH);
    if (!user?.password || !ok) {
      return NextResponse.json({ error: "البريد أو كلمة المرور غير صحيحة" }, { status: 401 });
    }

    await createSession(user.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("login", err);
    return NextResponse.json({ error: "تعذّر تسجيل الدخول" }, { status: 500 });
  }
}
