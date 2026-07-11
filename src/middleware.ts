// عون — حماية المسارات: إعادة التوجيه إلى /login عند غياب الجلسة.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("aoun_session")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/analytics/:path*",
    "/onboarding/:path*",
    "/settings/:path*",
    "/reflect/:path*",
    "/harvest/:path*",
  ],
};
