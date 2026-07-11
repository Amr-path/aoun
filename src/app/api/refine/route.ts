import { NextResponse } from "next/server";
import { refineHabit } from "@/lib/refiner";
import type { RefineHabitRequest } from "@/lib/types";

// POST /api/refine — يحوّل نصّ عادة خام إلى عادة منقّحة عبر طبقة الـLLM.
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RefineHabitRequest;
    if (!body?.rawText || !body.rawText.trim()) {
      return NextResponse.json({ error: "النص مطلوب" }, { status: 400 });
    }
    const refined = await refineHabit(body);
    return NextResponse.json(refined);
  } catch (err) {
    console.error("refine POST", err);
    return NextResponse.json({ error: "تعذّر تنقيح العادة" }, { status: 500 });
  }
}
