import { NextResponse } from "next/server";
import { createHabit, type OnboardingHabitInput } from "@/lib/habits";
import { getUserId } from "@/lib/auth";

// POST /api/habits — ينشئ عادةً جديدة (حدّ 7).
export async function POST(req: Request) {
  try {
    const input = (await req.json()) as OnboardingHabitInput;
    if (!input?.title?.trim()) {
      return NextResponse.json({ error: "العنوان مطلوب" }, { status: 400 });
    }
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "غير مسجّل" }, { status: 401 });
    const data = await createHabit(userId, input);
    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "تعذّر إنشاء العادة";
    console.error("habit POST", err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
