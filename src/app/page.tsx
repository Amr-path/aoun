import Link from "next/link";
import FlowerMark from "@/components/FlowerMark";
import Icon, { type IconName } from "@/components/ui/Icon";

// خرزات الأركان الطينية — باستيل ناعم مع حبرٍ مطابق لكل لون.
const CHIP_TONES = [
  { bg: "var(--color-sage-soft)", ink: "var(--color-sage-ink)" },
  { bg: "var(--color-sky-soft)", ink: "var(--color-sky-ink)" },
  { bg: "var(--color-amber-soft)", ink: "var(--color-amber-ink)" },
];

const PILLARS: { icon: IconName; title: string; body: string }[] = [
  { icon: "spark", title: "تركيزٌ لا تشتّت", body: "قلّةٌ تُتقنها خيرٌ من قائمةٍ تُرهقك وتتركها." },
  { icon: "leaf", title: "مداومةٌ تنمو", body: "كل يومٍ يضيف بتلةً؛ حديقتك تحكي رحلتك بصمت." },
  { icon: "sun", title: "هدوءٌ يوميّ", body: "تذكيراتٌ لطيفة ولحظاتُ احتفاءٍ صغيرة، بلا ضجيج." },
];

// فاصلٌ هادئ: خيطا خرزٍ حول حبّةٍ مرجانية طرية.
function OrnamentDivider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`flex w-full max-w-xs items-center gap-3 ${className}`}>
      <span className="ornament-line" />
      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[--color-accent] shadow-[0_2px_0_0_var(--edge-accent)]" />
      <span className="ornament-line rev" />
    </div>
  );
}

// سماء الفجر خلف الترويسة: شمسُ زبدةٍ تتنفّس وغيمتان منفوختتان من عجين.
function HeroSky() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 170"
      preserveAspectRatio="xMidYMin slice"
      className="pointer-events-none absolute inset-x-0 top-0 h-[170px] w-full"
    >
      {/* هالة الشمس ثم قرصها الزبديّ الطريّ */}
      <circle className="sun-glow" cx="326" cy="54" r="42" fill="var(--color-amber)" opacity="0.3" />
      <circle cx="326" cy="54" r="26" fill="var(--color-amber)" />
      <ellipse cx="318" cy="45" rx="11" ry="7" fill="rgba(255,255,255,0.45)" />

      {/* غيمةٌ كبيرة تتمايل على مهل */}
      <g className="animate-bob" fill="var(--color-surface)" opacity="0.95">
        <ellipse cx="72" cy="64" rx="34" ry="16" />
        <ellipse cx="96" cy="55" rx="22" ry="14" />
        <ellipse cx="48" cy="56" rx="18" ry="12" />
      </g>
      {/* وغيمةٌ صغيرة تتبعها بخطوةٍ متأخرة */}
      <g className="animate-bob" style={{ animationDelay: "-1.8s" }} fill="var(--color-surface)" opacity="0.85">
        <ellipse cx="228" cy="32" rx="25" ry="11" />
        <ellipse cx="247" cy="26" rx="15" ry="9" />
        <ellipse cx="210" cy="26" rx="13" ry="8" />
      </g>
    </svg>
  );
}

// تلّةٌ خضراء صغيرة تحتضن أسفل اللوحة — صدى «تلّة الواحة» داخل التطبيق.
function HeroHill() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 overflow-hidden">
      <svg viewBox="0 0 400 64" preserveAspectRatio="none" className="h-full w-full">
        <ellipse cx="120" cy="92" rx="240" ry="62" fill="var(--color-sage)" opacity="0.3" />
        <ellipse cx="310" cy="100" rx="220" ry="66" fill="var(--color-sage)" opacity="0.45" />
      </svg>
    </div>
  );
}

// لقطة منتجٍ مصغّرة من داخل التطبيق تطفو أسفل الصفحة.
function ProductPeek() {
  const rows = [
    { emoji: "🚶", name: "المشي", soft: "var(--color-lavender-soft)", ring: "var(--color-lavender)", done: false },
    { emoji: "📖", name: "القراءة", soft: "var(--color-sky-soft)", ring: "var(--color-sky)", done: false },
    { emoji: "💧", name: "شرب الماء", soft: "var(--color-surface-2)", ring: "var(--color-sage)", done: true },
  ];
  return (
    <div
      className="lp-peek tilt-1 mt-8 w-[302px] rounded-t-[--radius-xl] bg-[--color-surface] px-4 pt-4"
      style={{
        border: "1px solid var(--color-hairline-soft)",
        borderBottom: 0,
        boxShadow: "var(--shadow-top), var(--shadow-lg)",
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="font-[family-name:var(--font-display)] text-base font-extrabold text-[--color-ink]">
          صباح الخير
        </span>
        <span className="text-xs text-[--color-faint]">الخميس ٢٤ يوليو</span>
      </div>

      {/* صينيةُ الملخّص: عجينةٌ غائرة برفق */}
      <div
        className="mb-2.5 flex items-center gap-3 rounded-[--radius-md] bg-[--color-surface-2] p-2.5"
        style={{ boxShadow: "inset 0 2px 3px rgba(96, 66, 30, 0.1)" }}
      >
        <div className="relative grid h-[56px] w-[56px] shrink-0 place-items-center">
          <svg width="56" height="56" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="22" fill="none" stroke="var(--color-surface-3)" strokeWidth="6" />
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
          {/* خيطُ اليوم — التقدّم يُسكَب مرجانًا في قناةٍ طينية */}
          <div className="thread mt-2" aria-hidden>
            <i style={{ width: "43%" }} />
          </div>
        </div>
      </div>

      {rows.map((r) => (
        <div
          key={r.name}
          className="mb-2 flex items-center gap-2.5 rounded-[--radius-sm] p-2.5"
          style={{
            background: r.done ? "var(--color-sage-soft)" : "var(--color-surface)",
            border: "1px solid var(--color-hairline-soft)",
            boxShadow: "0 2px 0 0 var(--edge)",
          }}
        >
          <span
            className="icon-chip h-[30px] w-[30px] shrink-0 text-sm"
            style={{ background: r.soft }}
          >
            {r.emoji}
          </span>
          <span className="flex-1 text-xs font-bold text-[--color-ink]">{r.name}</span>
          <span
            className="grid h-[19px] w-[19px] shrink-0 place-items-center rounded-full"
            style={{
              border: r.done ? "none" : `2px solid ${r.ring}`,
              background: r.done ? "var(--color-sage)" : "transparent",
              boxShadow: r.done ? "inset 0 -2px 0 rgba(0, 0, 0, 0.12)" : undefined,
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
      {/* ─── الترويسة: لوحةُ فجرٍ طينية بشمسٍ وغيومٍ وتلّة ─── */}
      <section className="sky-panel sky-fajr relative w-full overflow-hidden rounded-[--radius-xl] px-6 pt-10">
        {/* همسة فقاعات العجين على السماء */}
        <div aria-hidden className="pattern-khatam pointer-events-none absolute inset-0 opacity-[0.05]" />
        <HeroSky />
        <HeroHill />

        <div className="relative flex flex-col items-center">
          <FlowerMark size={72} className="mb-4" />

          <h1 className="font-[family-name:var(--font-display)] text-5xl font-extrabold leading-[1.15]">
            رفيقُك
            <br />
            <span className="text-gild">للاستمرار.</span>
          </h1>

          <p className="quote-seed sky-muted mt-4 max-w-[300px] text-lg leading-relaxed">
            سبعُ عاداتٍ فقط، تكفيك عامَك كلَّه. لا قوائمَ مرهقة، ولا تشتّت — بل ما يبني استمرارَك، بهدوء.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <Link href="/login" className="btn-clay press px-8 py-3.5 text-lg font-bold">
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
          <h2 className="shrink-0 font-[family-name:var(--font-display)] text-3xl font-extrabold">
            لماذا <span className="text-gild">سبعٌ</span> فقط؟
          </h2>
          <span aria-hidden className="ornament-line rev" />
        </div>
        <p className="mx-auto mt-4 max-w-[340px] text-sm leading-relaxed text-[--color-muted]">
          لأن الاستمرار لا يولد من القوائم الطويلة، بل من قِلّةٍ تُتقنها. سبعُ عاداتٍ
          تغطّي أركان يومك دون أن تُثقلك — فتبقى معك عامًا كاملًا.
        </p>
        <div className="mt-8 grid gap-4 text-right sm:grid-cols-3">
          {PILLARS.map((p, i) => (
            <div key={p.title} className={`card relative overflow-hidden p-4 ${i % 2 === 0 ? "tilt-1" : "tilt-2"}`}>
              {/* همسة فقاعات عجينٍ خلف البطاقة */}
              <div aria-hidden className="pattern-khatam pointer-events-none absolute inset-0 opacity-[0.06]" />
              <div className="relative">
                {/* خرزةٌ طينية مدوّرة تتمايل بمهل، بلون حلوى وحبرٍ مطابق */}
                <span
                  aria-hidden
                  className="icon-chip animate-bob mb-4 mt-1 grid h-11 w-11 place-items-center rounded-full"
                  style={{
                    background: CHIP_TONES[i % CHIP_TONES.length].bg,
                    color: CHIP_TONES[i % CHIP_TONES.length].ink,
                    animationDelay: `${i * -1.2}s`,
                  }}
                >
                  <Icon name={p.icon} size={16} />
                </span>
                <h3 className="text-sm font-bold text-[--color-ink]">{p.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[--color-muted]">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <OrnamentDivider className="mt-16" />

      {/* دعوة أخيرة — بطاقةٌ طينية بإطارٍ مُذهّب */}
      <section className="mt-10 w-full max-w-md">
        <div className="card gild-frame relative overflow-hidden p-8">
          <div aria-hidden className="pattern-khatam pointer-events-none absolute inset-0 opacity-[0.06]" />
          <div className="relative flex flex-col items-center text-center">
            <FlowerMark size={52} className="mb-3" />
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold">
              ابدأ عامك <span className="text-gild">بهدوء</span>
            </h2>
            <p className="quote-seed mt-2.5 max-w-[300px] text-base leading-relaxed text-[--color-muted]">
              سبعُ عاداتٍ، حديقةٌ تنمو معك، ورفيقٌ لا يزحمك. مجّانًا بلا حدٍّ زمنيّ.
            </p>
            <Link href="/login" className="btn-clay press mt-6 px-8 py-3.5 text-base font-bold">
              ابدأ رحلتك
            </Link>
          </div>
        </div>
      </section>

      {/* التذييل — همسةٌ خافتة بلا ضجيج */}
      <footer className="mb-10 mt-14 w-full max-w-md text-center">
        <p className="text-xs text-[--color-faint]">عون — رفيقُك للاستمرار · صُنع بعناية</p>
      </footer>
    </main>
  );
}
