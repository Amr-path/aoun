import { NextResponse } from "next/server";
import { applyOnboarding, type OnboardingHabitInput } from "@/lib/habits";
import { getUserId } from "@/lib/auth";
import type { DiagnosticAnswers } from "@/lib/types";

// POST /api/onboarding — يحفظ التشخيص ويثبّت العادات المختارة (حدّ 7).
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      diagnostic: DiagnosticAnswers;
      habits: OnboardingHabitInput[];
    };
    if (!body?.diagnostic || !Array.isArray(body.habits) || body.habits.length === 0) {
      return NextResponse.json(
        { error: "التشخيص وقائمة العادات مطلوبان" },
        { status: 400 }
      );
    }
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "غير مسجّل" }, { status: 401 });
    const data = await applyOnboarding(userId, body.diagnostic, body.habits);
    return NextResponse.json(data);
  } catch (err) {
    console.error("onboarding POST", err);
    return NextResponse.json({ error: "تعذّر حفظ الإعداد" }, { status: 500 });
  }
}
