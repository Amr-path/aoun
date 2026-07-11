import { NextResponse } from "next/server";

// ميزة «يوم الراحة» أُزيلت. هذا المسار متوقّف.
export async function POST() {
  return NextResponse.json({ error: "غير متاح" }, { status: 410 });
}
