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

// لقطة منتجٍ مصغّرة من داخل التطبيق تطفو أسفل الصفحة.
function ProductPeek() {
  const rows = [
    { emoji: "🚶", name: "المشي", soft: "var(--color-lavender-soft)", ring: "var(--color-lavender)", done: false },
    { emoji: "📖", name: "القراءة", soft: "var(--color-sky-soft)", ring: "var(--color-sky)", done: false },
    { emoji: "💧", name: "شرب الماء", soft: "var(--color-surface)", ring: "var(--color-sage)", done: true },
  ];
  return (
    <div
      className="lp-peek mt-7 w-[302px] rounded-t-[26px] border border-b-0 border-[--color-hairline-soft] bg-[--color-surface] px-4 pt-4"
      style={{
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,.7), 0 30px 60px -24px rgba(60,44,26,.4), 0 12px 28px -16px rgba(60,44,26,.3)",
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="font-[family-name:var(--font-display)] text-[15px] font-extrabold text-[--color-ink]">
          صباح الخير
        </span>
        <span className="text-[10px] text-[--color-faint]">الخميس ٢٤ يوليو</span>
      </div>

      <div
        className="mb-2.5 flex items-center gap-3 rounded-[16px] border border-[--color-hairline-soft] p-2.5"
        style={{ background: "linear-gradient(180deg,#fffdf9,#f4eee4)" }}
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
          <b className="score absolute font-[family-name:var(--font-display)] text-[14px] font-extrabold text-[--color-ink]">
            ٣/٧
          </b>
        </div>
        <div className="min-w-0 text-right">
          <div className="text-[12px] font-bold text-[--color-ink]">أنت في الطريق</div>
          <div className="mt-0.5 text-[10.5px] text-[--color-muted]">بقيت أربع عادات على اكتماله</div>
        </div>
      </div>

      {rows.map((r) => (
        <div
          key={r.name}
          className="mb-2 flex items-center gap-2.5 rounded-[14px] border p-2.5"
          style={{
            background: r.done ? "var(--color-sage-soft)" : "var(--color-surface)",
            borderColor: r.done ? "transparent" : "var(--color-hairline-soft)",
          }}
        >
          <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[10px] text-[14px]" style={{ background: r.soft }}>
            {r.emoji}
          </span>
          <span className="flex-1 text-[11.5px] font-bold text-[--color-ink]">{r.name}</span>
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

      <FlowerMark size={72} className="mb-3" />

      <h1 className="font-[family-name:var(--font-display)] text-[29px] font-extrabold leading-[1.2] text-[--color-ink]">
        رفيقُك
        <br />
        <span className="text-[--color-accent-ink]">للاستمرار.</span>
      </h1>

      <p className="mt-3 max-w-[288px] text-[15px] leading-relaxed text-[--color-muted]">
        سبعُ عاداتٍ فقط، تكفيك عامَك كلَّه. لا قوائمَ مرهقة، ولا تشتّت — بل ما يبني استمرارَك، بهدوء.
      </p>

      <div className="mt-5 flex items-center gap-2.5">
        <Link
          href="/login"
          className="press rounded-full px-6 py-3 text-[15px] font-bold text-[--color-cream]"
          style={{
            background: "var(--grad-cta)",
            boxShadow: "0 10px 22px -8px rgba(200,122,40,.5), inset 0 1px 0 rgba(255,255,255,.35)",
          }}
        >
          ابدأ رحلتك
        </Link>
        <a
          href="#why"
          className="press rounded-full border border-[--color-hairline-soft] bg-[--color-surface] px-6 py-3 text-[15px] font-bold text-[--color-ink] shadow-[var(--shadow-1)]"
        >
          تعرّف أكثر
        </a>
      </div>

      <p className="mt-3 text-[13px] text-[--color-muted]">
        لديك حساب؟{" "}
        <Link href="/login" className="font-semibold text-[--color-accent-ink] hover:underline">
          سجّل الدخول
        </Link>
      </p>

      <ProductPeek />

      {/* لماذا سبعٌ فقط — الفلسفة */}
      <section id="why" className="mt-20 w-full max-w-md scroll-mt-8">
        <h2 className="font-[family-name:var(--font-display)] text-[22px] font-extrabold text-[--color-ink]">
          لماذا سبعٌ فقط؟
        </h2>
        <p className="mx-auto mt-3 max-w-[340px] text-[14px] leading-relaxed text-[--color-muted]">
          لأن الاستمرار لا يولد من القوائم الطويلة، بل من قِلّةٍ تُتقنها. سبعُ عاداتٍ
          تغطّي أركان يومك دون أن تُثقلك — فتبقى معك عامًا كاملًا.
        </p>
        <div className="mt-8 grid gap-3 text-right sm:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.title} className="card p-4">
              <span className="icon-chip mb-2.5 grid h-9 w-9 bg-[--color-accent-soft] text-[--color-accent-ink]">
                <Icon name={p.icon} size={18} />
              </span>
              <h3 className="text-[14px] font-bold text-[--color-ink]">{p.title}</h3>
              <p className="mt-1 text-[12.5px] leading-relaxed text-[--color-muted]">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* دعوة أخيرة */}
      <section className="mt-16 w-full max-w-md">
        <div className="card flex flex-col items-center p-8 text-center">
          <FlowerMark size={52} className="mb-3" />
          <h2 className="font-[family-name:var(--font-display)] text-[20px] font-extrabold text-[--color-ink]">
            ابدأ عامك بهدوء
          </h2>
          <p className="mt-2 max-w-[300px] text-[13.5px] leading-relaxed text-[--color-muted]">
            سبعُ عاداتٍ، حديقةٌ تنمو معك، ورفيقٌ لا يزحمك. مجّانًا بلا حدٍّ زمنيّ.
          </p>
          <Link
            href="/login"
            className="press mt-5 rounded-full px-7 py-3 text-[15px] font-bold text-[--color-cream]"
            style={{
              background: "var(--grad-cta)",
              boxShadow: "0 10px 22px -8px rgba(200,122,40,.5), inset 0 1px 0 rgba(255,255,255,.35)",
            }}
          >
            ابدأ رحلتك
          </Link>
        </div>
      </section>

      <footer className="mb-4 mt-12 pb-8 text-center text-[12px] text-[--color-faint]">
        عون — رفيقُك للاستمرار · صُنع بعناية
      </footer>
    </main>
  );
}
