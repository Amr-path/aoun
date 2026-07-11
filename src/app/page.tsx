import Link from "next/link";
import { BRAND, HABIT_LIBRARY, DEFAULT_SEVEN_KEYS } from "@/lib/constants";
import { accentSoftOf } from "@/lib/colors";
import { ar } from "@/lib/numerals";
import Logo from "@/components/Logo";

const preview = DEFAULT_SEVEN_KEYS.map(
  (k) => HABIT_LIBRARY.find((h) => h.key === k)!
);

export default function Home() {
  return (
    <main className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col items-center px-6 py-16 sm:py-24">
      <Logo variant="badge" size={88} animated className="mb-8" />
      <span className="pill animate-rise mb-6 inline-flex items-center gap-2 bg-[--color-accent-soft] px-4 py-1.5 text-sm font-medium text-[--color-accent-ink]">
        <span className="inline-block h-2 w-2 rounded-full bg-[--color-accent]" />
        {BRAND.philosophy}
      </span>

      <h1
        className="animate-rise text-center font-[family-name:var(--font-display)] text-7xl font-black leading-none tracking-tight text-[--color-ink] sm:text-8xl"
        style={{ animationDelay: "60ms" }}
      >
        {BRAND.name}
      </h1>
      <p
        className="animate-rise mt-4 text-center text-xl text-[--color-muted] sm:text-2xl"
        style={{ animationDelay: "120ms" }}
      >
        {BRAND.tagline}
      </p>

      <p
        className="animate-rise mt-6 max-w-xl text-center text-balance leading-relaxed text-[--color-faint]"
        style={{ animationDelay: "180ms" }}
      >
        سبعُ عاداتٍ فقط، تكفيك عامَك كلَّه. لا قوائمَ مرهقة، ولا تشتُّت — بل ما
        يبني استمرارَك، يوماً إثرَ يوم، في هدوء.
      </p>

      <div
        className="animate-rise mt-14 grid w-full grid-cols-2 gap-3 sm:grid-cols-4"
        style={{ animationDelay: "240ms" }}
      >
        {preview.map((h) => (
          <div key={h.key} className="card flex flex-col gap-2 p-4">
            <span
              className="grid h-10 w-10 place-items-center rounded-2xl text-xl"
              style={{ background: accentSoftOf(h.colorKey) }}
            >
              {h.emoji}
            </span>
            <span className="text-sm font-semibold text-[--color-ink]">{h.title}</span>
            <span className="tabular text-xs text-[--color-faint]">{h.scheduledAt}</span>
          </div>
        ))}
        <div className="card flex items-center justify-center p-4 text-center" style={{ background: "var(--grad-sunrise)" }}>
          <span className="font-[family-name:var(--font-display)] tabular text-4xl font-black text-[--color-cream]">
            {ar(7)}
          </span>
        </div>
      </div>

      <div
        className="animate-rise mt-14 flex flex-col items-center gap-3 sm:flex-row"
        style={{ animationDelay: "300ms" }}
      >
        <Link
          href="/login"
          className="press pill bg-[--color-ink] px-8 py-3 font-semibold text-[--color-cream] shadow-[var(--shadow-2)]"
        >
          ابدأ رحلتك
        </Link>
        <Link
          href="/login"
          className="press pill border border-[--color-hairline] px-8 py-3 font-semibold text-[--color-ink] transition-colors hover:bg-[--color-surface-2]"
        >
          لديك حساب؟ دخول
        </Link>
      </div>

      <footer className="mt-auto pt-16 text-center text-xs text-[--color-faint]">
        عون — رفيقك للاستمرار
      </footer>
    </main>
  );
}
