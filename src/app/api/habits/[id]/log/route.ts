import { NextResponse } from "next/server";
import { setHabitStatus } from "@/lib/habits";
import { getUserId } from "@/lib/auth";

// POST /api/habits/:id/log — يضبط حالة العادة في يوم محدّد.
// body: { date: "YYYY-MM-DD", completed: boolean }
export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const body = (await req.json()) as { date?: string; completed?: boolean };

    if (!body.date || typeof body.completed !== "boolean") {
      return NextResponse.json(
        { error: "الحقول date و completed مطلوبة" },
        { status: 400 }
      );
    }

    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "غير مسجّل" }, { status: 401 });
    const data = await setHabitStatus(userId, id, body.date, body.completed);
    return NextResponse.json(data);
  } catch (err) {
    console.error("habit log POST", err);
    return NextResponse.json({ error: "تعذّر تحديث الحالة" }, { status: 500 });
  }
}
