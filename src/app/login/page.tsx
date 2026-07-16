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
    <main className="mx-auto flex min-h-dvh w-full flex-1 flex-col items-center justify-center px-6 py-12">
      <AuthForm initialMode={initialMode} />
    </main>
  );
}
