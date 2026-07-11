import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";

// POST /api/auth/register — ينشئ حساباً جديداً ويبدأ الجلسة.
export async function POST(req: Request) {
  try {
    const { email, password, name } = (await req.json()) as {
      email?: string;
      password?: string;
      name?: string;
    };
    const mail = email?.trim().toLowerCase();
    if (!mail || !password || password.length < 6) {
      return NextResponse.json(
        { error: "البريد مطلوب وكلمة المرور ٦ أحرف على الأقل" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: mail },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json({ error: "البريد مُستخدم بالفعل" }, { status: 409 });
    }

    const hash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email: mail, name: name?.trim() || null, password: hash, score: { create: {} } },
      select: { id: true },
    });

    await createSession(user.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("register", err);
    return NextResponse.json({ error: "تعذّر إنشاء الحساب" }, { status: 500 });
  }
}
