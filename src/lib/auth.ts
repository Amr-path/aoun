// عون — المصادقة: كلمة مرور مُجزّأة (bcrypt) + جلسة JWT في كوكي HttpOnly.
import "server-only";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "aoun_session";
const DEV_FALLBACK_SECRET = "dev-secret-change-me";

/**
 * يحلّ سرّ توقيع الجلسات. يرمي خطأً عند الإقلاع في الإنتاج إذا كان السرّ
 * غائباً أو ما زال بالقيمة الافتراضية — حتى لا تُوقَّع الجلسات بنصّ معروف للجميع.
 */
function resolveAuthSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret === DEV_FALLBACK_SECRET) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "AUTH_SECRET مطلوب في الإنتاج ولا يجوز استخدام القيمة الافتراضية."
      );
    }
    return new TextEncoder().encode(DEV_FALLBACK_SECRET);
  }
  return new TextEncoder().encode(secret);
}

const secretKey = resolveAuthSecret();

export function hashPassword(pw: string): Promise<string> {
  return bcrypt.hash(pw, 10);
}

export function verifyPassword(pw: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pw, hash);
}

/** ينشئ جلسة (كوكي موقّع) للمستخدم. */
export async function createSession(userId: string): Promise<void> {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secretKey);

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

/** يُنهي الجلسة. */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

/** يُرجع معرّف المستخدم من الجلسة، أو null. */
export async function getUserId(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

/** يفرض تسجيل الدخول في صفحات الخادم (يعيد التوجيه إلى /login إن لم يُسجّل). */
export async function requireUserId(): Promise<string> {
  const id = await getUserId();
  if (!id) redirect("/login");
  return id;
}
