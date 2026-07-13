import { NextResponse } from "next/server";
import { updateHabit, deleteHabit } from "@/lib/habits";
import { getUserId } from "@/lib/auth";
import { parseJson, habitPatchSchema } from "@/lib/validation";

// PATCH /api/habits/:id — يعدّل التكرار/الوقت/العنوان.
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "غير مسجّل", code: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const patch = await parseJson(req, habitPatchSchema);
  if (!patch) {
    return NextResponse.json({ error: "مدخلات غير صالحة", code: "invalid_input" }, { status: 400 });
  }
  try {
    const data = await updateHabit(userId, id, patch);
    return NextResponse.json(data);
  } catch (err) {
    console.error("habit PATCH", err);
    return NextResponse.json({ error: "تعذّر تعديل العادة", code: "server_error" }, { status: 500 });
  }
}

// DELETE /api/habits/:id — يحذف العادة.
export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "غير مسجّل", code: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  try {
    const data = await deleteHabit(userId, id);
    return NextResponse.json(data);
  } catch (err) {
    console.error("habit DELETE", err);
    return NextResponse.json({ error: "تعذّر حذف العادة", code: "server_error" }, { status: 500 });
  }
}
