"use client";
// عون — صفحة الاشتراك «عون بلس»: ورقة اشتراكٍ بروح iOS — صفوف مزايا بفواصل شعرية،
// تسعيرٌ بارز، وزرٌّ معبّأ واحد (دون بوّابة دفع فعلية بعد).
import Link from "next/link";
import { useState } from "react";
import FlowerMark from "./FlowerMark";
import Icon from "./ui/Icon";
import { ar } from "@/lib/numerals";

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
    <main className="mx-auto w-full max-w-lg px-5 pb-16 pt-5">
      {/* شريط علوي */}
      <div className="flex h-10 items-center justify-between">
        <Link
          href="/settings"
          className="press grid h-9 w-9 place-items-center rounded-full bg-[--color-surface] text-[--color-muted] shadow-[var(--shadow-1)]"
          aria-label="رجوع"
        >
          <Icon name="chevron" size={18} className="scale-x-[-1]" />
        </Link>
      </div>

      {/* الهيرو */}
      <div className="mt-4 flex flex-col items-center text-center">
        <FlowerMark size={72} className="mb-3" />
        <h1 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-[28px] font-bold text-[--color-ink]">
          عون
          <span className="rounded-full bg-[--color-accent] px-3 py-1 text-base font-bold text-white">
            بلس
          </span>
        </h1>
        <p className="mt-3 max-w-[320px] text-sm leading-relaxed text-[--color-muted]">
          كلُّ ما تستخدمه اليوم مجانيٌّ ويبقى كذلك. «بلس» القادم سيضيف عمقاً اختيارياً — لمن أراد دعم التطوير.
        </p>
      </div>

      {/* المجاني — قائمة مجموعةٍ بصفوفٍ مفصولة بخطوطٍ شعرية */}
      <section className="mt-7">
        <h2 className="mb-2 px-1 text-[13px] font-medium text-[--color-faint]">
          مجانيٌّ اليوم — ويبقى مجانياً
        </h2>
        <div className="card divide-y overflow-hidden">
          {FREE.map((f) => (
            <div key={f} className="flex items-center gap-3 px-4 py-3 text-sm text-[--color-ink]">
              <Icon name="check" size={16} className="shrink-0 text-[--color-accent]" />
              {f}
            </div>
          ))}
        </div>
      </section>

      {/* بلس */}
      <section className="mt-6">
        <h2 className="mb-2 px-1 text-[13px] font-medium text-[--color-faint]">
          قريباً في «بلس»
        </h2>
        <div className="card divide-y overflow-hidden">
          {PLUS.map((f) => (
            <div
              key={f}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[--color-ink]"
            >
              <Icon name="spark" size={16} className="shrink-0 text-[--color-accent]" />
              {f}
            </div>
          ))}
        </div>
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
        className="btn-clay press mt-4 flex w-full items-center justify-center gap-2 rounded-[12px] py-3.5 text-center text-base font-bold"
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
      aria-pressed={active}
      className={`press relative flex flex-col items-center rounded-[--radius-card] bg-[--color-surface] p-4 text-center transition-shadow duration-150 ${
        active
          ? "shadow-[0_0_0_2px_var(--color-accent),var(--shadow-1)]"
          : "shadow-[var(--shadow-1)]"
      }`}
    >
      {badge && (
        <span className="absolute -top-2.5 rounded-full bg-[--color-accent-soft] px-2.5 py-0.5 text-xs font-bold text-[--color-accent-ink]">
          {badge}
        </span>
      )}
      <span className="mt-1 text-sm font-semibold text-[--color-ink]">{title}</span>
      <span className="score tabular mt-1.5 text-[28px] font-bold leading-tight text-[--color-ink]">
        {price}
      </span>
      <span className="text-xs text-[--color-muted]">{unit}</span>
      <span className="mt-2 text-xs text-[--color-faint]">{hint}</span>
    </button>
  );
}
