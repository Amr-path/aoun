import Link from "next/link";
import FlowerMark from "@/components/FlowerMark";
import Icon, { type IconName } from "@/components/ui/Icon";

const PILLARS: { icon: IconName; title: string; body: string }[] = [
  { icon: "spark", title: "تركيزٌ لا تشتّت", body: "قلّةٌ تُتقنها خيرٌ من قائمةٍ تُرهقك وتتركها." },
  { icon: "leaf", title: "مداومةٌ تنمو", body: "كل يومٍ يضيف بتلةً؛ حديقتك تحكي رحلتك بصمت." },
  { icon: "sun", title: "هدوءٌ يوميّ", body: "تذكيراتٌ لطيفة ولحظاتُ احتفاءٍ صغيرة، بلا ضجيج." },
];

const GLOW =
  "radial-gradient(95% 46% at 50% -8%, rgba(224,145,58,.11), transparent 62%)," +
  "radial-gradient(66% 34% at 80% 12%, rgba(226,166,133,.11), transparent 64%)," +
  "radial-gradient(70% 40% at 14% 20%, rgba(124,127,208,.08), transparent 62%)," +
  "radial-gradient(90% 46% at 50% 110%, rgba(92,154,100,.07), transparent 60%)";

// فاصلٌ مُزخرف: خيطان يذوبان في الذهب حول معيّنٍ صغير — على طراز فواصل المخطوطات.
function OrnamentDivider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`flex w-full max-w-xs items-center gap-3 ${className}`}>
      <span className="ornament-line" />
      <span
        className="h-1.5 w-1.5 shrink-0 rotate-45"
        style={{ background: "color-mix(in srgb, var(--color-accent) 70%, transparent)", borderRadius: 1 }}
      />
      <span className="ornament-line rev" />
    </div>
  );
}

// سماء الفجر خلف الترويسة: نجومٌ تُومض تخبو نحو الأفق، وتوهّجُ شمسٍ وليدة.
function HeroSky() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 170"
      preserveAspectRatio="xMidYMin slice"
      className="pointer-events-none absolute inset-x-0 top-0 h-[170px] w-full"
    >
      <defs>
        <filter id="lp-soft" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="20" />
        </filter>
      </defs>
      {/* توهّج شمسٍ خجولة عند الأفق */}
      <g opacity="0.45">
        <circle className="sun-glow" cx="200" cy="168" r="64" fill="var(--color-accent)" filter="url(#lp-soft)" />
      </g>
      {/* نجومٌ متلألئة — أعلى اللوحة حيث ما زال الليل باقيًا */}
      <g fill="currentColor" opacity="0.7">
        <circle className="tw" cx="38" cy="30" r="1.5" />
        <circle className="tw" cx="92" cy="64" r="1.1" style={{ animationDelay: "-1.3s" }} />
        <circle className="tw" cx="140" cy="22" r="1.2" style={{ animationDelay: "-2.4s" }} />
        <circle className="tw" cx="256" cy="26" r="1.3" style={{ animationDelay: "-0.8s" }} />
        <circle className="tw" cx="316" cy="58" r="1.1" style={{ animationDelay: "-2.9s" }} />
        <circle className="tw" cx="368" cy="34" r="1.5" style={{ animationDelay: "-1.8s" }} />
        <circle className="tw" cx="24" cy="86" r="1" style={{ animationDelay: "-0.4s" }} />
        <circle className="tw" cx="376" cy="92" r="1" style={{ animationDelay: "-3.1s" }} />
        <path className="tw" d="M66 14l1.5 4.5 4.5 1.5-4.5 1.5-1.5 4.5-1.5-4.5-4.5-1.5 4.5-1.5z" style={{ animationDelay: "-2.1s" }} />
        <path className="tw" d="M330 12l1.8 5.2 5.2 1.8-5.2 1.8-1.8 5.2-1.8-5.2-5.2-1.8 5.2-1.8z" style={{ animationDelay: "-0.6s" }} />
        <path className="tw" d="M196 10l1.3 3.7 3.7 1.3-3.7 1.3-1.3 3.7-1.3-3.7-3.7-1.3 3.7-1.3z" style={{ animationDelay: "-1.6s" }} />
      </g>
    </svg>
  );
}

// لقطة منتجٍ مصغّرة من داخل التطبيق تطفو أسفل الصفحة.
function ProductPeek() {
  const rows = [
    { emoji: "🚶", name: "المشي", soft: "var(--color-lavender-soft)", ring: "var(--color-lavender)", done: false },
    { emoji: "📖", name: "القراءة", soft: "var(--color-sky-soft)", ring: "var(--color-sky)", done: false },
    { emoji: "💧", name: "شرب الماء", soft: "var(--color-surface)", ring: "var(--color-sage)", done: true },
  ];
  return (
    <div
      className="lp-peek mt-8 w-[302px] rounded-t-[--radius-xl] border border-b-0 border-[--color-hairline-soft] bg-[--color-surface] px-4 pt-4"
      style={{
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,.7), 0 30px 60px -24px rgba(60,44,26,.4), 0 12px 28px -16px rgba(60,44,26,.3)",
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="font-[family-name:var(--font-display)] text-base font-extrabold text-[--color-ink]">
          صباح الخير
        </span>
        <span className="text-xs text-[--color-faint]">الخميس ٢٤ يوليو</span>
      </div>

      <div
        className="mb-2.5 flex items-center gap-3 rounded-[--radius-md] border border-[--color-hairline-soft] p-2.5"
        style={{ background: "linear-gradient(180deg, var(--color-surface), var(--color-bg))" }}
      >
        <div className="relative grid h-[56px] w-[56px] shrink-0 place-items-center">
          <svg width="56" height="56" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="22" fill="none" stroke="var(--color-surface-2)" strokeWidth="6" />
            <circle
              cx="28"
              cy="28"
              r="22"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="138.2"
              strokeDashoffset="79"
              transform="rotate(-90 28 28)"
            />
          </svg>
          <b className="score absolute font-[family-name:var(--font-display)] text-sm font-extrabold text-[--color-ink]">
            ٣/٧
          </b>
        </div>
        <div className="min-w-0 flex-1 text-right">
          <div className="text-xs font-bold text-[--color-ink]">أنت في الطريق</div>
          <div className="mt-0.5 text-xs text-[--color-muted]">بقيت أربع عادات على اكتماله</div>
          {/* خيطُ اليوم الذهبيّ — التقدّم يُنسَج ضوءًا */}
          <div className="thread mt-2" aria-hidden>
            <i style={{ width: "43%" }} />
          </div>
        </div>
      </div>

      {rows.map((r) => (
        <div
          key={r.name}
          className="mb-2 flex items-center gap-2.5 rounded-[--radius-sm] border p-2.5"
          style={{
            background: r.done ? "var(--color-sage-soft)" : "var(--color-surface)",
            borderColor: r.done ? "transparent" : "var(--color-hairline-soft)",
          }}
        >
          <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[--radius-xs] text-sm" style={{ background: r.soft }}>
            {r.emoji}
          </span>
          <span className="flex-1 text-xs font-bold text-[--color-ink]">{r.name}</span>
          <span
            className="grid h-[19px] w-[19px] shrink-0 place-items-center rounded-full"
            style={{
              border: r.done ? "none" : `1.5px solid ${r.ring}`,
              background: r.done ? "var(--color-sage)" : "transparent",
            }}
          >
            {r.done && (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative mx-auto flex w-full max-w-lg flex-1 flex-col items-center overflow-hidden px-6 pb-0 pt-5 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ background: GLOW }} />

      {/* ─── الترويسة: فاتحة مخطوطةٍ تحت سماء فجر حيّة ─── */}
      <section className="sky-panel sky-fajr relative w-full overflow-hidden rounded-[--radius-xl] border border-[--color-hairline-soft] px-6 pt-10 shadow-[var(--shadow-2)]">
        {/* همسة نقش الخاتم الثمانيّ على السماء */}
        <div aria-hidden className="pattern-khatam pointer-events-none absolute inset-0 opacity-[0.05]" />
        <HeroSky />

        <div className="relative flex flex-col items-center">
          <FlowerMark size={72} className="mb-4" />

          <h1 className="font-[family-name:var(--font-display)] text-4xl font-extrabold leading-[1.2]">
            رفيقُك
            <br />
            <span className="text-gild">للاستمرار.</span>
          </h1>

          <p className="quote-seed sky-muted mt-4 max-w-[300px] text-lg leading-relaxed">
            سبعُ عاداتٍ فقط، تكفيك عامَك كلَّه. لا قوائمَ مرهقة، ولا تشتّت — بل ما يبني استمرارَك، بهدوء.
          </p>

          <div className="mt-6 flex items-center gap-2.5">
            <Link
              href="/login"
              className="press rounded-full px-6 py-3 text-base font-bold text-[--color-cream]"
              style={{
                background: "var(--grad-cta)",
                boxShadow: "0 10px 22px -8px rgba(200,122,40,.5), inset 0 1px 0 rgba(255,255,255,.35)",
              }}
            >
              ابدأ رحلتك
            </Link>
            <a href="#why" className="sky-chip press rounded-full px-6 py-3 text-base font-bold">
              تعرّف أكثر
            </a>
          </div>

          <p className="sky-muted mt-4 text-sm">
            لديك حساب؟{" "}
            <Link href="/login" className="font-bold underline underline-offset-4 hover:opacity-80">
              سجّل الدخول
            </Link>
          </p>

          <ProductPeek />
        </div>
      </section>

      <OrnamentDivider className="mt-16" />

      {/* لماذا سبعٌ فقط — الفلسفة */}
      <section id="why" className="mt-10 w-full max-w-md scroll-mt-8">
        <div className="flex items-center gap-4">
          <span aria-hidden className="ornament-line" />
          <h2 className="shrink-0 font-[family-name:var(--font-display)] text-2xl font-extrabold">
            <span className="text-gild">لماذا سبعٌ فقط؟</span>
          </h2>
          <span aria-hidden className="ornament-line rev" />
        </div>
        <p className="mx-auto mt-4 max-w-[340px] text-sm leading-relaxed text-[--color-muted]">
          لأن الاستمرار لا يولد من القوائم الطويلة، بل من قِلّةٍ تُتقنها. سبعُ عاداتٍ
          تغطّي أركان يومك دون أن تُثقلك — فتبقى معك عامًا كاملًا.
        </p>
        <div className="mt-8 grid gap-3 text-right sm:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.title} className="card relative overflow-hidden p-4">
              {/* همسة نقشٍ خلف البطاقة */}
              <div aria-hidden className="pattern-khatam pointer-events-none absolute inset-0 opacity-[0.04]" />
              <div className="relative">
                {/* معيّنٌ مُذهّب — بدل الرقاقة المستديرة */}
                <span
                  aria-hidden
                  className="mx-1.5 mb-4 mt-1.5 grid h-8 w-8 rotate-45 place-items-center bg-[--color-accent-soft]"
                  style={{
                    borderRadius: 6,
                    border: "1px solid color-mix(in srgb, var(--color-accent) 45%, transparent)",
                    boxShadow: "var(--shadow-1)",
                  }}
                >
                  <span className="grid -rotate-45 place-items-center text-[--color-accent-ink]">
                    <Icon name={p.icon} size={16} />
                  </span>
                </span>
                <h3 className="text-sm font-bold text-[--color-ink]">{p.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[--color-muted]">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <OrnamentDivider className="mt-16" />

      {/* دعوة أخيرة — بطاقةٌ بإطارٍ مُذهّب */}
      <section className="mt-10 w-full max-w-md">
        <div className="card gild-frame relative overflow-hidden p-8">
          <div aria-hidden className="pattern-khatam pointer-events-none absolute inset-0 opacity-[0.05]" />
          <div className="relative flex flex-col items-center text-center">
            <FlowerMark size={52} className="mb-3" />
            <h2 className="font-[family-name:var(--font-display)] text-xl font-extrabold">
              <span className="text-gild">ابدأ عامك بهدوء</span>
            </h2>
            <p className="quote-seed mt-2.5 max-w-[300px] text-base leading-relaxed text-[--color-muted]">
              سبعُ عاداتٍ، حديقةٌ تنمو معك، ورفيقٌ لا يزحمك. مجّانًا بلا حدٍّ زمنيّ.
            </p>
            <Link
              href="/login"
              className="press mt-6 rounded-full px-7 py-3 text-base font-bold text-[--color-cream]"
              style={{
                background: "var(--grad-cta)",
                boxShadow: "0 10px 22px -8px rgba(200,122,40,.5), inset 0 1px 0 rgba(255,255,255,.35)",
              }}
            >
              ابدأ رحلتك
            </Link>
          </div>
        </div>
      </section>

      <footer className="mb-4 mt-12 flex flex-col items-center pb-8">
        <OrnamentDivider className="mb-4 max-w-[180px]" />
        <p className="text-xs text-[--color-faint]">عون — رفيقُك للاستمرار · صُنع بعناية</p>
      </footer>
    </main>
  );
}
