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
    <main className="relative mx-auto flex min-h-dvh w-full flex-1 flex-col items-center justify-center overflow-hidden px-6 py-12">
      {/* نقاط بولكا خلف الصفحة كلّها */}
      <div aria-hidden className="pattern-khatam pointer-events-none absolute inset-0 -z-10 opacity-[0.05]" />
      {/* أشكالٌ بروتالية مقصوصة في أعلى الصفحة: أستِرِسك ونجمة ودائرة مفرّغة ومتعرّج */}
      <svg
        aria-hidden
        viewBox="0 0 400 120"
        preserveAspectRatio="xMidYMin slice"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[120px] w-full text-[--color-accent]"
      >
        <g className="tw" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
          <path d="M52 18v28M39 25l26 14M65 25l-26 14" />
        </g>
        <path
          className="tw"
          fill="currentColor"
          d="M336 22l5 14 14 5-14 5-5 14-5-14-14-5 14-5z"
          style={{ animationDelay: "-1.4s" }}
        />
        <circle
          className="tw"
          cx="204"
          cy="30"
          r="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          style={{ animationDelay: "-2.6s" }}
        />
        <polyline
          points="120,78 132,64 144,78 156,64 168,78"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <AuthForm />
    </main>
  );
}
