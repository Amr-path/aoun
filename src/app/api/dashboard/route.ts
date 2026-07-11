import { NextResponse } from "next/server";
import { getDashboard } from "@/lib/habits";
import { getUserId } from "@/lib/auth";

// GET /api/dashboard — لوحة التحكم للمستخدم الحالي.
export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "غير مسجّل" }, { status: 401 });
    const data = await getDashboard(userId);
    return NextResponse.json(data);
  } catch (err) {
    console.error("dashboard GET", err);
    return NextResponse.json({ error: "تعذّر تحميل اللوحة" }, { status: 500 });
  }
}
