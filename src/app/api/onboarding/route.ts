import { NextResponse } from "next/server";
import { applyOnboarding, AlreadyOnboardedError } from "@/lib/habits";
import { getUserId } from "@/lib/auth";
import { parseJson, onboardingBodySchema } from "@/lib/validation";

// POST /api/onboarding — يحفظ التشخيص ويثبّت العادات المختارة (حدّ 7).
export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "غير مسجّل", code: "unauthorized" }, { status: 401 });

  const body = await parseJson(req, onboardingBodySchema);
  if (!body) {
    return NextResponse.json({ error: "مدخلات غير صالحة", code: "invalid_input" }, { status: 400 });
  }
  try {
    const data = await applyOnboarding(userId, body.diagnostic, body.habits);
    return NextResponse.json(data);
  } catch (err) {
    // حسابٌ مُهيّأ سابقاً: نرفض إعادة التهيئة لأنها تمحو العادات وسجلّاتها كلّها.
    if (err instanceof AlreadyOnboardedError) {
      return NextResponse.json(
        {
          error: "تمّت تهيئة حسابك سابقاً — عدّل عاداتك من الإعدادات",
          code: "already_onboarded",
        },
        { status: 409 }
      );
    }
    console.error("onboarding POST", err);
    return NextResponse.json({ error: "تعذّر حفظ الإعداد", code: "server_error" }, { status: 500 });
  }
}
