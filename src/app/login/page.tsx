// عون — صفحة الدخول/التسجيل.
import { redirect } from "next/navigation";
import { getUserId } from "@/lib/auth";
import AuthForm from "@/components/AuthForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "دخول" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const id = await getUserId();
  if (id) redirect("/dashboard");
  // دخول التسجيل أولاً: ?mode=register يفتح النموذج على إنشاء الحساب.
  const { mode } = await searchParams;
  const initialMode = mode === "register" ? "register" : "login";
  return (
    <main className="relative mx-auto flex min-h-dvh w-full flex-1 flex-col items-center justify-center overflow-hidden px-6 py-12">
      {/* فقاعات عجينٍ خافتة خلف الصفحة كلّها */}
      <div aria-hidden className="pattern-khatam pointer-events-none absolute inset-0 -z-10 opacity-[0.05]" />
      {/* خرزاتُ حلوى طرية تسبح على مهلٍ حول النموذج */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <span
          className="animate-bob absolute right-[12%] top-16 h-10 w-10 rounded-full bg-[--color-amber-soft]"
          style={{ boxShadow: "var(--shadow-top), 0 3px 0 0 var(--edge)" }}
        />
        <span
          className="animate-bob absolute left-[14%] top-32 h-6 w-6 rounded-full bg-[--color-sky-soft]"
          style={{ animationDelay: "-1.4s", boxShadow: "var(--shadow-top), 0 2px 0 0 var(--edge)" }}
        />
        <span
          className="animate-bob absolute bottom-24 right-[18%] h-7 w-7 rounded-full bg-[--color-blush-soft]"
          style={{ animationDelay: "-2.6s", boxShadow: "var(--shadow-top), 0 2px 0 0 var(--edge)" }}
        />
      </div>
      <AuthForm initialMode={initialMode} />
    </main>
  );
}
