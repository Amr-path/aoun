import { NextResponse } from "next/server";
import { createHabit } from "@/lib/habits";
import { getUserId } from "@/lib/auth";
import { parseJson, onboardingHabitInputSchema } from "@/lib/validation";

// POST /api/habits — ينشئ عادةً جديدة (حدّ 7).
export async function POST(req: Request) {
  // مصادقة أولاً، ثمّ تحقّق من المدخلات.
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "غير مسجّل", code: "unauthorized" }, { status: 401 });
  }
  const input = await parseJson(req, onboardingHabitInputSchema);
  if (!input) {
    return NextResponse.json({ error: "مدخلات غير صالحة", code: "invalid_input" }, { status: 400 });
  }
  try {
    const data = await createHabit(userId, input);
    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "تعذّر إنشاء العادة";
    console.error("habit POST", err);
    return NextResponse.json({ error: msg, code: "server_error" }, { status: 400 });
  }
}
