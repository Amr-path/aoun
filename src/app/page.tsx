import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserId } from "@/lib/auth";
import FlowerMark from "@/components/FlowerMark";
import Icon, { type IconName } from "@/components/ui/Icon";

const PILLARS: { icon: IconName; title: string; body: string }[] = [
  { icon: "spark", title: "قِلّةٌ تُتقَن", body: "سبعُ عاداتٍ حدّاً لا يُتجاوز. ما تُتقنه يبقى، وما يزدحم يُهجَر." },
  { icon: "leaf", title: "أثرٌ يتراكم", body: "كلُّ يومٍ تفي فيه لنفسك يضيف إلى حديقتك — سجلٌّ حيٌّ يشهد لرحلتك بصمت." },
  { icon: "sun", title: "صحبةٌ لا تزحم", body: "تذكيرٌ في وقته، وكلمةٌ في محلّها. لا إلحاح، ولا ضجيج، ولا شعورٌ بالذنب." },
];

// سماء الترويسة: شمسٌ هادئة وغيمةٌ رقيقة واحدة — لا أكثر.
function HeroSky() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 170"
      preserveAspectRatio="xMidYMin slice"
      className="pointer-events-none absolute inset-x-0 top-0 h-[170px] w-full"
    >
      <circle className="sun-glow" cx="326" cy="54" r="38" fill="var(--color-amber)" opacity="0.22" />
      <circle cx="326" cy="54" r="23" fill="var(--color-amber)" opacity="0.9" />
      <g fill="var(--color-surface)" opacity="0.6">
        <ellipse cx="80" cy="58" rx="32" ry="9" />
        <ellipse cx="103" cy="52" rx="17" ry="7" />
      </g>
    </svg>
  );
}

// تلّةٌ خضراء خافتة تستقرّ أسفل اللوحة.
function HeroHill() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 overflow-hidden">
      <svg viewBox="0 0 400 64" preserveAspectRatio="none" className="h-full w-full">
        <ellipse cx="120" cy="92" rx="240" ry="62" fill="var(--color-sage)" opacity="0.25" />
        <ellipse cx="310" cy="100" rx="220" ry="66" fill="var(--color-sage)" opacity="0.4" />
      </svg>
    </div>
  );
}

// لقطة منتجٍ من داخل التطبيق — بطاقةٌ بيضاء بصفوفٍ مفصولةٍ بخطوطٍ شعرية.
function ProductPeek() {
  const rows = [
    { emoji: "🚶", name: "المشي", soft: "var(--color-lavender-soft)", ring: "var(--color-lavender)", done: false },
    { emoji: "📖", name: "القراءة", soft: "var(--color-sky-soft)", ring: "var(--color-sky)", done: false },
    { emoji: "💧", name: "شرب الماء", soft: "var(--color-sage-soft)", ring: "var(--color-sage)", done: true },
  ];
  return (
    <div className="lp-peek card mt-8 w-[302px] rounded-t-[--radius-xl] rounded-b-none px-4 pt-4 text-start shadow-[var(--shadow-lg)]">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-[family-name:var(--font-display)] text-base font-bold text-[--color-ink]">
          صباح الخير
        </span>
        <span className="text-xs text-[--color-faint]">الخميس ٢٤ يوليو</span>
      </div>

      {/* ملخّص اليوم — إدراجٌ رماديّ هادئ */}
      <div className="flex items-center gap-3 rounded-[10px] bg-[--color-surface-2] p-2.5">
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
          <b className="score absolute font-[family-name:var(--font-display)] text-sm font-bold text-[--color-ink]">
            ٣/٧
          </b>
        </div>
        <div className="min-w-0 flex-1 text-right">
          <div className="text-[13px] font-semibold text-[--color-ink]">يومُك يكتمل</div>
          <div className="mt-0.5 text-xs text-[--color-muted]">بقيت أربعُ عاداتٍ ليكتمل يومك</div>
          <div className="thread mt-2" aria-hidden>
            <i style={{ width: "43%" }} />
          </div>
        </div>
      </div>

      {/* صفوف العادات — قائمة iOS مفصولة بخطوطٍ شعرية */}
      <div className="mt-1 divide-y divide-[--color-hairline-soft]">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center gap-2.5 py-2.5">
            <span
              className="icon-chip h-8 w-8 shrink-0 rounded-[8px] text-sm"
              style={{ background: r.soft }}
            >
              {r.emoji}
            </span>
            <span className="flex-1 text-[13px] font-semibold text-[--color-ink]">{r.name}</span>
            <span
              className="grid h-[19px] w-[19px] shrink-0 place-items-center rounded-full"
              style={{
                border: r.done ? "none" : `2px solid ${r.ring}`,
                background: r.done ? "var(--color-accent)" : "transparent",
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
    </div>
  );
}

export default async function Home() {
  // المسجَّل دخوله لا يحتاج صفحة التسويق — إلى لوحته مباشرة.
  const userId = await getUserId();
  if (userId) redirect("/dashboard");

  return (
    <main className="relative mx-auto flex w-full max-w-lg flex-1 flex-col items-center overflow-hidden px-6 pb-0 pt-5 text-center">
      {/* ─── الترويسة: لوحةُ فجرٍ هادئة بشمسٍ وتلّة ─── */}
      <section className="sky-panel sky-fajr relative w-full overflow-hidden rounded-[--radius-xl] px-6 pt-10">
        <HeroSky />
        <HeroHill />

        <div className="relative flex flex-col items-center">
          <FlowerMark size={72} className="mb-4" />

          <h1 className="font-[family-name:var(--font-display)] text-5xl font-bold leading-[1.15]">
            الثباتُ،
            <br />
            <span className="text-gild">لا الحماس.</span>
          </h1>

          <p className="sky-muted mt-4 max-w-[300px] text-[17px] leading-relaxed">
            سبعُ عاداتٍ تكفيك، ورفيقٌ هادئ لا يزحم يومك. فالذي يصل ليس الأكثر حماسةً، بل الأكثر عودة.
          </p>

          <div className="mt-6 flex items-center gap-5">
            <Link
              href="/login?mode=register"
              className="btn-clay press rounded-full px-8 py-3.5 text-[17px] font-semibold"
            >
              ابدأ رحلتك
            </Link>
            <a href="#why" className="press text-[17px] font-semibold text-[--color-accent-ink]">
              تعرّف أكثر ›
            </a>
          </div>

          <p className="sky-muted mt-4 text-sm">
            لديك حساب؟{" "}
            <Link href="/login" className="font-semibold underline underline-offset-4 hover:opacity-80">
              سجّل الدخول
            </Link>
          </p>

          <ProductPeek />
        </div>
      </section>

      {/* لماذا سبعٌ فقط — الفلسفة */}
      <section id="why" className="mt-16 w-full max-w-md scroll-mt-8">
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold">
          لماذا <span className="text-gild">سبعٌ</span> فقط؟
        </h2>
        <p className="mx-auto mt-3 max-w-[340px] text-[15px] leading-relaxed text-[--color-muted]">
          لأن عدوَّ الاستمرار هو الازدحام. سبعُ عاداتٍ تغطّي أركان يومك — جسدَك
          وذهنَك وسكينتَك — وتترك لك متّسعًا لتعيش. وما زاد على ذلك حماسةٌ تستهلك نفسها.
        </p>

        {/* الأركان الثلاثة — قائمة iOS داخل بطاقةٍ واحدة */}
        <div className="card mt-8 divide-y divide-[--color-hairline-soft] text-start">
          {PILLARS.map((p) => (
            <div key={p.title} className="flex items-start gap-3 p-4">
              <span
                aria-hidden
                className="icon-chip mt-0.5 h-8 w-8 shrink-0 rounded-[8px] text-[--color-accent-ink]"
                style={{ background: "var(--color-accent-soft)" }}
              >
                <Icon name={p.icon} size={15} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-[--color-ink]">{p.title}</span>
                <span className="mt-0.5 block text-[13px] leading-relaxed text-[--color-muted]">
                  {p.body}
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* دعوة أخيرة — بطاقةٌ بيضاء نظيفة */}
      <section className="mt-16 w-full max-w-md">
        <div className="card p-8">
          <div className="flex flex-col items-center text-center">
            <FlowerMark size={52} className="mb-3" />
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold">
              ابدأ عامك <span className="text-gild">بهدوء</span>
            </h2>
            <p className="mt-2.5 max-w-[300px] text-[15px] leading-relaxed text-[--color-muted]">
              سبعُ عاداتٍ تختارها، وحديقةٌ تنمو باسمك، ورفيقٌ يحترم وقتك. مجّانًا، بلا حدٍّ زمنيّ.
            </p>
            <Link
              href="/login?mode=register"
              className="btn-clay press mt-6 rounded-full px-8 py-3.5 text-[17px] font-semibold"
            >
              ابدأ رحلتك
            </Link>
          </div>
        </div>
      </section>

      {/* التذييل — همسةٌ خافتة بلا ضجيج */}
      <footer className="mb-10 mt-14 w-full max-w-md text-center">
        <p className="text-xs text-[--color-faint]">عون — رفيقُ الثبات · صُنع بعناية</p>
      </footer>
    </main>
  );
}
