import { NextResponse } from "next/server";
import { updateHabit, deleteHabit, type HabitPatch } from "@/lib/habits";
import { getUserId } from "@/lib/auth";

// PATCH /api/habits/:id — يعدّل التكرار/الوقت/العنوان.
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const patch = (await req.json()) as HabitPatch;
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "غير مسجّل" }, { status: 401 });
    const data = await updateHabit(userId, id, patch);
    return NextResponse.json(data);
  } catch (err) {
    console.error("habit PATCH", err);
    return NextResponse.json({ error: "تعذّر تعديل العادة" }, { status: 500 });
  }
}

// DELETE /api/habits/:id — يحذف العادة.
export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "غير مسجّل" }, { status: 401 });
    const data = await deleteHabit(userId, id);
    return NextResponse.json(data);
  } catch (err) {
    console.error("habit DELETE", err);
    return NextResponse.json({ error: "تعذّر حذف العادة" }, { status: 500 });
  }
}
