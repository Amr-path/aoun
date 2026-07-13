"use client";
// عون — صفحة الاشتراك «عون بلس»: مزايا مجاني↔بلس + تسعير + دعوة ترقية (دون بوّابة دفع فعلية بعد).
import Link from "next/link";
import { useState } from "react";
import FlowerMark from "./FlowerMark";
import Icon from "./ui/Icon";
import { ar } from "@/lib/numerals";

const GLOW =
  "radial-gradient(95% 40% at 50% -8%, rgba(224,145,58,.13), transparent 62%)," +
  "radial-gradient(70% 34% at 82% 8%, rgba(226,166,133,.10), transparent 64%)," +
  "radial-gradient(70% 40% at 12% 16%, rgba(124,127,208,.07), transparent 62%)";

const FREE = [
  "العادات السبع الأساسية",
  "الإتمام اليومي والمداومة",
  "تذكيراتٌ أساسية",
  "حديقةُ آخر الأسابيع",
  "بذرةُ اليوم",
];

const PLUS = [
  "الحديقة السنوية الكاملة والتحليلات العميقة",
  "الرسالة الأسبوعية السردية",
  "الوضع الليلي والثيمات والألوان",
  "تنقيح العادات بالذكاء وتذكيراتٌ مخصّصة",
  "بطاقات الحصاد والتصدير",
  "شاراتٌ أغنى ورفيقٌ أعمق",
  "نسخٌ احتياطي وتعدّد أجهزة",
];

type Plan = "annual" | "lifetime";

export default function PlusClient() {
  const [plan, setPlan] = useState<Plan>("annual");
  const [note, setNote] = useState(false);

  return (
    <main className="relative mx-auto w-full max-w-lg overflow-hidden px-5 pb-16 pt-5">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ background: GLOW }} />

      {/* شريط علوي */}
      <div className="flex h-10 items-center justify-between">
        <Link
          href="/settings"
          className="press grid h-9 w-9 place-items-center rounded-[--radius-md] border border-[--color-hairline-soft] bg-[--color-surface] text-[--color-muted] shadow-[var(--shadow-top),var(--shadow-1)]"
          aria-label="رجوع"
        >
          <Icon name="chevron" size={18} />
        </Link>
      </div>

      {/* الهيرو */}
      <div className="mt-4 flex flex-col items-center text-center">
        <FlowerMark size={72} className="mb-3" />
        <h1 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-[30px] font-extrabold text-[--color-ink]">
          عون
          <span
            className="rounded-full px-3 py-1 text-[15px] font-bold text-[--color-cream]"
            style={{ background: "linear-gradient(180deg,#eba04c,#e0913a 60%,#cf7f2c)" }}
          >
            بلس
          </span>
        </h1>
        <p className="mt-3 max-w-[320px] text-[14.5px] leading-relaxed text-[--color-muted]">
          النواةُ السبع تبقى مجانيّةً دائماً. «بلس» يفتح العُمق والجمال والذكاء — لمن أراد أن يزهرَ عامُه كاملاً.
        </p>
      </div>

      {/* المجاني */}
      <section className="card mt-7 p-5">
        <h2 className="mb-3 text-[15px] font-bold text-[--color-ink]">المجاني يكفيك للبدء</h2>
        <ul className="flex flex-col gap-2.5">
          {FREE.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-[13.5px] text-[--color-muted]">
              <Icon name="check" size={15} className="shrink-0 text-[--color-faint]" />
              {f}
            </li>
          ))}
        </ul>
      </section>

      {/* بلس */}
      <section
        className="mt-4 rounded-[--radius-card] border p-5"
        style={{ borderColor: "var(--color-accent)", background: "var(--color-accent-soft)" }}
      >
        <h2 className="mb-3 flex items-center gap-2 text-[15px] font-bold text-[--color-accent-ink]">
          <Icon name="spark" size={17} />
          «عون بلس» يضيف
        </h2>
        <ul className="flex flex-col gap-2.5">
          {PLUS.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-[13.5px] font-medium text-[--color-accent-ink]">
              <Icon name="check" size={15} className="mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </section>

      {/* التسعير */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <PlanCard
          active={plan === "annual"}
          onClick={() => setPlan("annual")}
          badge="الأفضل قيمة"
          title="سنويّ"
          price={`﷼${ar(49)}`}
          unit="/ سنة"
          hint={`≈ ﷼${ar(4)} شهرياً`}
        />
        <PlanCard
          active={plan === "lifetime"}
          onClick={() => setPlan("lifetime")}
          title="مدى الحياة"
          price={`﷼${ar(129)}`}
          unit="مرّة واحدة"
          hint="بلا اشتراكٍ متكرّر"
        />
      </div>

      <button
        type="button"
        onClick={() => setNote(true)}
        className="press mt-4 w-full rounded-full py-3.5 text-center text-[15.5px] font-bold text-[--color-cream]"
        style={{
          background: "linear-gradient(180deg,#eba04c,#e0913a 60%,#cf7f2c)",
          boxShadow: "0 10px 22px -8px rgba(200,122,40,.5), inset 0 1px 0 rgba(255,255,255,.35)",
        }}
      >
        {plan === "annual" ? `اشترك سنوياً — ﷼${ar(49)}` : `احصل عليه مدى الحياة — ﷼${ar(129)}`}
      </button>

      {note && (
        <p className="mt-3 flex items-center justify-center gap-2 text-center text-[13px] text-[--color-muted]">
          <Icon name="clock" size={15} className="text-[--color-accent-ink]" />
          الدفع سيُفعّل قريباً عبر وسائل محليّة (مدى / STC Pay / Apple Pay). شكراً لدعمك عون.
        </p>
      )}

      <p className="mt-5 text-center text-[12px] leading-relaxed text-[--color-faint]">
        يمكنك الاستمتاع بعون مجاناً بلا حدودٍ زمنيّة. الترقية اختياريّة لدعم التطوير وفتح المزايا الإضافية.
      </p>
    </main>
  );
}

function PlanCard({
  active,
  onClick,
  badge,
  title,
  price,
  unit,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  badge?: string;
  title: string;
  price: string;
  unit: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="press relative flex flex-col items-center rounded-[--radius-card] bg-[--color-surface] p-4 text-center transition-colors"
      style={{
        border: active ? "2px solid var(--color-accent)" : "1px solid var(--color-hairline-soft)",
        boxShadow: active ? "var(--shadow-2)" : "var(--shadow-top), var(--shadow-1)",
      }}
    >
      {badge && (
        <span
          className="absolute -top-2.5 rounded-full px-2.5 py-0.5 text-[10.5px] font-bold text-[--color-accent-ink]"
          style={{ background: "var(--color-accent-soft)", border: "1px solid var(--color-accent)" }}
        >
          {badge}
        </span>
      )}
      <span className="mt-1 text-[13px] font-bold text-[--color-ink]">{title}</span>
      <span className="score mt-1.5 font-[family-name:var(--font-display)] text-[26px] font-extrabold text-[--color-ink]">
        {price}
      </span>
      <span className="text-[11.5px] text-[--color-muted]">{unit}</span>
      <span className="mt-2 text-[11px] text-[--color-faint]">{hint}</span>
    </button>
  );
}
