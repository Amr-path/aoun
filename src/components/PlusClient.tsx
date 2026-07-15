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

// صدقٌ كامل: كل ما هو متاحٌ اليوم يبقى مجانياً — لا نَعِد بما تملكه أصلاً.
const FREE = [
  "العادات السبع الأساسية والإتمام اليومي والمداومة",
  "التذكيرات اللطيفة",
  "الحديقة السنوية الكاملة",
  "الوضع الليلي",
  "تنقيح العادات بالذكاء",
  "بطاقة الحصاد والمشاركة",
  "بذرةُ اليوم",
];

// ما لم يُبنَ بعد — يُعرض بوضوح تحت «قريباً» لا كميزةٍ حاضرة.
const PLUS = [
  "إحصاءاتٌ متقدّمة ورؤى أعمق",
  "نسخٌ احتياطي وتصدير البيانات",
  "ثيماتٌ إضافية",
  "تذكيراتٌ ذكية",
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
          <Icon name="chevron" size={18} className="scale-x-[-1]" />
        </Link>
      </div>

      {/* الهيرو */}
      <div className="mt-4 flex flex-col items-center text-center">
        <FlowerMark size={72} className="mb-3" />
        <h1 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-3xl font-extrabold text-[--color-ink]">
          عون
          <span
            className="rounded-full px-3 py-1 text-base font-bold text-[--color-cream]"
            style={{ background: "var(--grad-cta)" }}
          >
            بلس
          </span>
        </h1>
        <p className="mt-3 max-w-[320px] text-sm leading-relaxed text-[--color-muted]">
          كلُّ ما تستخدمه اليوم مجانيٌّ ويبقى كذلك. «بلس» القادم سيضيف عمقاً اختيارياً — لمن أراد دعم التطوير.
        </p>
      </div>

      {/* المجاني */}
      <section className="card mt-7 p-5">
        <h2 className="mb-3 text-base font-bold text-[--color-ink]">مجانيٌّ اليوم — ويبقى مجانياً</h2>
        <ul className="flex flex-col gap-2.5">
          {FREE.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-sm text-[--color-muted]">
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
        <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-[--color-accent-ink]">
          <Icon name="spark" size={17} />
          قريباً في «بلس»
        </h2>
        <ul className="flex flex-col gap-2.5">
          {PLUS.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm font-medium text-[--color-accent-ink]">
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
          price={`${ar(49)} ﷼`}
          unit="/ سنة"
          hint={`≈ ${ar(4)} ﷼ شهرياً`}
        />
        <PlanCard
          active={plan === "lifetime"}
          onClick={() => setPlan("lifetime")}
          title="مدى الحياة"
          price={`${ar(129)} ﷼`}
          unit="مرّة واحدة"
          hint="بلا اشتراكٍ متكرّر"
        />
      </div>

      {/* الدفع غير مُفعّل بعد — زرٌّ صادق «أعلِمني» بدل «اشترك» الموهم. */}
      <button
        type="button"
        onClick={() => setNote(true)}
        className="press mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-center text-base font-bold text-[--color-cream]"
        style={{
          background: "var(--grad-cta)",
          boxShadow: "0 10px 22px -8px rgba(200,122,40,.5), inset 0 1px 0 rgba(255,255,255,.35)",
        }}
      >
        <Icon name="bell" size={18} />
        أعلِمني عند الإطلاق
      </button>

      {note && (
        <p className="mt-3 flex items-center justify-center gap-2 text-center text-sm text-[--color-muted]">
          <Icon name="check" size={15} className="text-[--color-success-ink]" />
          الدفع لم يُفعّل بعد. استمتع بعون مجّانًا الآن، وسنعلن عن «بلس» قريبًا عبر وسائل محليّة (مدى / STC Pay / Apple Pay).
        </p>
      )}

      <p className="mt-5 text-center text-xs leading-relaxed text-[--color-faint]">
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
          className="absolute -top-2.5 rounded-full px-2.5 py-0.5 text-xs font-bold text-[--color-accent-ink]"
          style={{ background: "var(--color-accent-soft)", border: "1px solid var(--color-accent)" }}
        >
          {badge}
        </span>
      )}
      <span className="mt-1 text-sm font-bold text-[--color-ink]">{title}</span>
      <span className="score mt-1.5 font-[family-name:var(--font-display)] text-2xl font-extrabold text-[--color-ink]">
        {price}
      </span>
      <span className="text-xs text-[--color-muted]">{unit}</span>
      <span className="mt-2 text-xs text-[--color-faint]">{hint}</span>
    </button>
  );
}
