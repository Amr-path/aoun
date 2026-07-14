// عون — صفحة عدم الاتصال (تُعرض حين لا تتوفّر الشبكة).
import Logo from "@/components/Logo";

export const metadata = { title: "دون اتصال" };

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-1 flex-col items-center justify-center px-6 text-center">
      <Logo variant="badge" size={72} className="mb-6" />
      <span className="pill mb-4 inline-flex items-center gap-2 bg-[--color-accent-soft] px-4 py-1.5 text-sm font-medium text-[--color-accent-ink]">
        <span className="inline-block h-2 w-2 rounded-full bg-[--color-accent]" />
        دون اتصال
      </span>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-black text-[--color-ink]">
        لا اتصال الآن
      </h1>
      <p className="mt-2 leading-relaxed text-[--color-muted]">
        يبدو أنك دون إنترنت. عاداتك محفوظة، وستعود لوحتك حين يعود الاتصال.
      </p>
    </main>
  );
}
