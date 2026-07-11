// عون — صفحة الدخول/التسجيل.
import { redirect } from "next/navigation";
import { getUserId } from "@/lib/auth";
import AuthForm from "@/components/AuthForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "دخول" };

export default async function LoginPage() {
  const id = await getUserId();
  if (id) redirect("/dashboard");
  return (
    <main className="mx-auto flex min-h-dvh w-full flex-1 flex-col items-center justify-center px-6 py-12">
      <AuthForm />
    </main>
  );
}
