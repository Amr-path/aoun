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
    const emailOk = !!mail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
    // bcrypt يقصّ صامتاً عند 72 بايت؛ نفرض 8–72 بوضوح.
    if (!emailOk || !password || password.length < 8 || password.length > 72) {
      return NextResponse.json(
        { error: "أدخل بريداً صحيحاً وكلمة مرور من ٨ إلى ٧٢ حرفاً" },
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
