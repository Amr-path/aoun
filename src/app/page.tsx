import Link from "next/link";
import FlowerMark from "@/components/FlowerMark";
import Icon, { type IconName } from "@/components/ui/Icon";

// دورة ألوانٍ فاقعة لرقاقات الأيقونات — ياسمينيّ / سماويّ / كهرمانيّ.
const CHIP_BGS = ["var(--color-sage-soft)", "var(--color-sky-soft)", "var(--color-amber-soft)"];

const PILLARS: { icon: IconName; title: string; body: string }[] = [
  { icon: "spark", title: "تركيزٌ لا تشتّت", body: "قلّةٌ تُتقنها خيرٌ من قائمةٍ تُرهقك وتتركها." },
  { icon: "leaf", title: "مداومةٌ تنمو", body: "كل يومٍ يضيف بتلةً؛ حديقتك تحكي رحلتك بصمت." },
  { icon: "sun", title: "هدوءٌ يوميّ", body: "تذكيراتٌ لطيفة ولحظاتُ احتفاءٍ صغيرة، بلا ضجيج." },
];

// فاصلٌ صاخب: خطّان سميكان حول معيّنٍ أصفر بحدٍّ صريح — لا شفافية ولا ذوبان.
function OrnamentDivider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`flex w-full max-w-xs items-center gap-3 ${className}`}>
      <span className="ornament-line" />
      <span
        className="h-2.5 w-2.5 shrink-0 rotate-45 bg-[--color-accent]"
        style={{ border: "2px solid var(--color-border)", borderRadius: 1 }}
      />
      <span className="ornament-line rev" />
    </div>
  );
}

// سماء الفجر خلف الترويسة: أشكالٌ بروتالية مقصوصة — أستِرِسك ضخمة، دوائر مفرّغة، ومتعرّج.
function HeroSky() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 170"
      preserveAspectRatio="xMidYMin slice"
      className="pointer-events-none absolute inset-x-0 top-0 h-[170px] w-full"
    >
      {/* أستِرِسك ✳ كبيرة في صدر السماء */}
      <g className="tw" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
        <path d="M200 14v36M183 23l34 18M217 23l-34 18" />
      </g>
      {/* دوائر مفرّغة بحدٍّ سميك */}
      <g fill="none" stroke="currentColor" strokeWidth="4">
        <circle className="tw" cx="352" cy="50" r="18" style={{ animationDelay: "-2.4s" }} />
        <circle cx="34" cy="112" r="11" />
      </g>
      {/* متعرّجٌ حادّ */}
      <polyline
        points="22,44 36,26 50,44 64,26 78,44"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* نجمتان رباعيّتان مصمَتتان */}
      <g fill="currentColor">
        <path className="tw" d="M318 96l6 16 16 6-16 6-6 16-6-16-16-6 16-6z" style={{ animationDelay: "-0.8s" }} />
        <path className="tw" d="M108 96l4.5 12 12 4.5-12 4.5-4.5 12-4.5-12-12-4.5 12-4.5z" style={{ animationDelay: "-1.6s" }} />
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
      className="lp-peek tilt-1 mt-8 w-[302px] rounded-t-[--radius-xl] border-b-0 bg-[--color-surface] px-4 pt-4"
      style={{ border: "2.5px solid var(--color-border)", borderBottom: 0, boxShadow: "var(--shadow-lg)" }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="font-[family-name:var(--font-display)] text-base font-extrabold text-[--color-ink]">
          صباح الخير
        </span>
        <span className="text-xs text-[--color-faint]">الخميس ٢٤ يوليو</span>
      </div>

      <div
        className="mb-2.5 flex items-center gap-3 rounded-[--radius-md] bg-[--color-bg] p-2.5"
        style={{ border: "2px solid var(--color-border)" }}
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
          className="mb-2 flex items-center gap-2.5 rounded-[--radius-sm] p-2.5"
          style={{
            background: r.done ? "var(--color-sage-soft)" : "var(--color-surface)",
            border: "2px solid var(--color-border)",
          }}
        >
          <span
            className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[--radius-xs] text-sm"
            style={{ background: r.soft, border: "2px solid var(--color-border)" }}
          >
            {r.emoji}
          </span>
          <span className="flex-1 text-xs font-bold text-[--color-ink]">{r.name}</span>
          <span
            className="grid h-[19px] w-[19px] shrink-0 place-items-center rounded-full"
            style={{
              border: r.done ? "2px solid var(--color-border)" : `2px solid ${r.ring}`,
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
      {/* ─── الترويسة: ملصقٌ بروتاليّ على بنفسجيٍّ مسطّح ─── */}
      <section className="sky-panel sky-fajr relative w-full overflow-hidden rounded-[--radius-xl] px-6 pt-10">
        {/* همسة نقش الخاتم الثمانيّ على السماء */}
        <div aria-hidden className="pattern-khatam pointer-events-none absolute inset-0 opacity-[0.05]" />
        <HeroSky />

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
            <Link
              href="/login"
              className="brut press rounded-full bg-[--color-accent] px-6 py-3 text-base font-bold text-[#141414]"
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
              {/* نقاط بولكا خلف البطاقة */}
              <div aria-hidden className="pattern-khatam pointer-events-none absolute inset-0 opacity-[0.06]" />
              <div className="relative">
                {/* معيّنٌ صاخب: خلفية لونٍ فاقع وحدٌّ أسود سميك */}
                <span
                  aria-hidden
                  className="mx-1.5 mb-4 mt-1.5 grid h-9 w-9 rotate-45 place-items-center"
                  style={{
                    borderRadius: 6,
                    border: "2px solid var(--color-border)",
                    background: CHIP_BGS[i % CHIP_BGS.length],
                    boxShadow: "var(--shadow-1)",
                  }}
                >
                  <span className="grid -rotate-45 place-items-center text-[--color-ink]">
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

      {/* دعوة أخيرة — ملصقٌ مائل بظلٍّ قاسٍ */}
      <section className="mt-10 w-full max-w-md">
        <div className="card tilt-2 relative overflow-hidden p-8 shadow-[var(--shadow-2)]">
          <div aria-hidden className="pattern-khatam pointer-events-none absolute inset-0 opacity-[0.06]" />
          <div className="relative flex flex-col items-center text-center">
            <FlowerMark size={52} className="mb-3" />
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold">
              ابدأ عامك <span className="text-gild">بهدوء</span>
            </h2>
            <p className="quote-seed mt-2.5 max-w-[300px] text-base leading-relaxed text-[--color-muted]">
              سبعُ عاداتٍ، حديقةٌ تنمو معك، ورفيقٌ لا يزحمك. مجّانًا بلا حدٍّ زمنيّ.
            </p>
            <Link
              href="/login"
              className="brut press mt-6 rounded-full bg-[--color-accent] px-7 py-3 text-base font-bold text-[#141414]"
            >
              ابدأ رحلتك
            </Link>
          </div>
        </div>
      </section>

      {/* التذييل — شريطٌ ملصق رفيع بحدٍّ وظلٍّ قاسيين */}
      <footer className="mb-10 mt-14 flex w-full max-w-md justify-center">
        <p className="brut tilt-1 rounded-[--radius-sm] bg-[--color-surface] px-5 py-2.5 text-xs font-bold text-[--color-ink]">
          عون — رفيقُك للاستمرار · صُنع بعناية
        </p>
      </footer>
    </main>
  );
}
