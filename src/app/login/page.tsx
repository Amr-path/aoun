// عون — صفحة الدخول/التسجيل.
import { redirect } from "next/navigation";
import { getUserId } from "@/lib/auth";
import AuthForm from "@/components/AuthForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "دخول" };

export default async function LoginPage() {
  const id = await getUserId();
  if (id) redirect("/dashboard");
  const glow =
    "radial-gradient(95% 42% at 50% -8%, rgba(224,145,58,.11), transparent 62%)," +
    "radial-gradient(66% 32% at 82% 10%, rgba(226,166,133,.11), transparent 64%)," +
    "radial-gradient(70% 38% at 12% 18%, rgba(124,127,208,.08), transparent 62%)," +
    "radial-gradient(90% 44% at 50% 112%, rgba(92,154,100,.07), transparent 60%)";
  return (
    <main className="relative mx-auto flex min-h-dvh w-full flex-1 flex-col items-center justify-center overflow-hidden px-6 py-12">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ background: glow }} />
      <AuthForm />
    </main>
  );
}
