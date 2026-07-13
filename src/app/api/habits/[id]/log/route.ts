import { NextResponse } from "next/server";
import { setHabitStatus, NotFoundError } from "@/lib/habits";
import { getUserId } from "@/lib/auth";
import { parseJson, logHabitSchema } from "@/lib/validation";

// POST /api/habits/:id/log — يضبط حالة العادة في يوم محدّد.
// body: { date: "YYYY-MM-DD", completed: boolean }
export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "غير مسجّل", code: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const body = await parseJson(req, logHabitSchema);
  if (!body) {
    return NextResponse.json({ error: "مدخلات غير صالحة", code: "invalid_input" }, { status: 400 });
  }
  try {
    const data = await setHabitStatus(userId, id, body.date, body.completed);
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return NextResponse.json({ error: err.message, code: "not_found" }, { status: 404 });
    }
    console.error("habit log POST", err);
    return NextResponse.json({ error: "تعذّر تحديث الحالة", code: "server_error" }, { status: 500 });
  }
}
