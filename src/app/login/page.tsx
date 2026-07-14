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
      {/* همسة نقش الخاتم خلف الصفحة كلّها */}
      <div aria-hidden className="pattern-khatam pointer-events-none absolute inset-0 -z-10 opacity-[0.035]" />
      {/* نجومٌ ذهبية تُومض في أعلى السماء */}
      <svg
        aria-hidden
        viewBox="0 0 400 120"
        preserveAspectRatio="xMidYMin slice"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[120px] w-full text-[--color-accent]"
      >
        <g fill="currentColor" opacity="0.55">
          <circle className="tw" cx="46" cy="34" r="1.4" />
          <circle className="tw" cx="118" cy="62" r="1" style={{ animationDelay: "-1.4s" }} />
          <circle className="tw" cx="204" cy="24" r="1.2" style={{ animationDelay: "-2.6s" }} />
          <circle className="tw" cx="286" cy="56" r="1" style={{ animationDelay: "-0.7s" }} />
          <circle className="tw" cx="356" cy="30" r="1.4" style={{ animationDelay: "-1.9s" }} />
          <path className="tw" d="M156 14l1.6 4.6 4.6 1.6-4.6 1.6-1.6 4.6-1.6-4.6-4.6-1.6 4.6-1.6z" style={{ animationDelay: "-2.2s" }} />
          <path className="tw" d="M322 12l1.4 4 4 1.4-4 1.4-1.4 4-1.4-4-4-1.4 4-1.4z" style={{ animationDelay: "-0.9s" }} />
        </g>
      </svg>
      <AuthForm />
    </main>
  );
}
