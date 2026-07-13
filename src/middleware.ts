// عون — حماية المسارات: إعادة التوجيه إلى /login عند غياب جلسة صحيحة.
// يعمل على الـedge runtime؛ يتحقّق من توقيع الـJWT فعلاً (لا مجرّد وجود الكوكي).
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const DEV_FALLBACK_SECRET = "dev-secret-change-me";

/** يحلّ سرّ التحقق؛ يرمي خطأً في الإنتاج إن كان السرّ غائباً أو افتراضياً. */
function authSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret === DEV_FALLBACK_SECRET) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET مطلوب في الإنتاج.");
    }
    return new TextEncoder().encode(DEV_FALLBACK_SECRET);
  }
  return new TextEncoder().encode(secret);
}

async function hasValidSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, authSecret());
    return typeof payload.sub === "string" && payload.sub.length > 0;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("aoun_session")?.value;
  if (!(await hasValidSession(token))) {
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
    "/harvest/:path*",
  ],
};
