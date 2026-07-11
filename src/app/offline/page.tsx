// عون — صفحة عدم الاتصال (تُعرض حين لا تتوفّر الشبكة).
import Logo from "@/components/Logo";

export const metadata = { title: "دون اتصال" };

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-1 flex-col items-center justify-center px-6 text-center">
      <Logo variant="badge" size={72} className="mb-6" />
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-black text-[--color-ink]">
        لا اتصال الآن
      </h1>
      <p className="mt-2 text-[--color-muted]">
        يبدو أنك دون إنترنت. عاداتك محفوظة، وستعود لوحتك حين يعود الاتصال.
      </p>
    </main>
  );
}
