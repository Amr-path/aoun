// عون — صفحة «رحلتك»: جدارُ الأثر — أرقامٌ ضخمة بخطّ العرض، شبكة السنة، الاتساق الأسبوعي، والشارات.
import Link from "next/link";
import { requireUserId } from "@/lib/auth";
import { getAnalytics } from "@/lib/analytics";
import { prisma } from "@/lib/db";
import { ar } from "@/lib/numerals";
import { weeklyNarrative } from "@/lib/narrative";
import YearView from "@/components/YearView";
import WeeklyChart from "@/components/WeeklyChart";
import BadgesSection from "@/components/BadgesSection";
import BottomNav from "@/components/BottomNav";
import Icon, { type IconName } from "@/components/ui/Icon";
import { earnedCount } from "@/lib/badges";

export const dynamic = "force-dynamic";
export const metadata = { title: "رحلتك" };

// عنوان قسمٍ بين زخرفتين — على طراز فواصل المخطوطات.
function SectionTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="ornament-line" aria-hidden />
      <div className="flex flex-col items-center">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-black text-[--color-ink]">
          {title}
        </h2>
        {hint ? <span className="mt-0.5 text-xs text-[--color-faint]">{hint}</span> : null}
      </div>
      <span className="ornament-line rev" aria-hidden />
    </div>
  );
}

// بطاقة إحصاءٍ بروتالية: إطارٌ سميك بظلٍّ قاسٍ، ملصقٌ مائل، ورقمٌ ضخمٌ مُظلَّل بالفسفوري.
function Stat({
  label,
  value,
  icon,
  tint,
  tilt,
}: {
  label: string;
  value: number;
  icon: IconName;
  tint: string;
  tilt?: string;
}) {
  return (
    <div
      className={`gild-frame relative overflow-hidden rounded-[--radius-card] bg-[--color-surface] p-4 ${tilt ?? ""}`}
    >
      <div
        aria-hidden
        className="pattern-khatam pointer-events-none absolute inset-0 opacity-[0.06]"
      />
      <div className="relative">
        <span
          className="icon-chip mb-2 grid h-8 w-8"
          style={{
            background: `var(--color-${tint}-soft)`,
            color: `var(--color-${tint}-ink)`,
          }}
        >
          <Icon name={icon} size={16} />
        </span>
        <p className="text-sm text-[--color-muted]">{label}</p>
        <p className="score tabular text-gild mt-1 font-[family-name:var(--font-display)] text-4xl font-black">
          {ar(value)}
        </p>
      </div>
    </div>
  );
}

export default async function AnalyticsPage() {
  const userId = await requireUserId();
  const [a, user] = await Promise.all([
    getAnalytics(userId),
    prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
  ]);
  const name = (user as { name?: string | null } | null)?.name ?? null;
  const narrative = weeklyNarrative(a.days, name);

  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-32 pt-8">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="icon-chip h-11 w-11 bg-[--color-accent-soft] text-[--color-accent-ink] shadow-[var(--shadow-top),var(--shadow-1)]">
            <Icon name="garden" size={22} />
          </span>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-black text-[--color-ink]">
            رحلتك
          </h1>
        </div>
        <Link
          href="/dashboard"
          className="press pill inline-flex items-center gap-1 border-2 border-[--color-border] bg-[--color-surface] px-4 py-2 text-sm font-medium text-[--color-ink] shadow-[2.5px_2.5px_0_0_var(--color-border)] transition-colors hover:bg-[--color-surface-2]"
        >
          <Icon name="chevron" size={16} className="scale-x-[-1]" />
          اللوحة
        </Link>
      </div>

      {/* سطرُ الافتتاح — كلمةٌ مُظلَّلة بالفسفوري بين خطّين حازمين */}
      <div className="mb-6 flex items-center gap-3 px-2">
        <span className="ornament-line" aria-hidden />
        <p className="quote-seed whitespace-nowrap text-center text-[15px] text-[--color-muted]">
          مخطوطةُ <span className="text-gild font-bold">أثرك</span>، يوماً بيوم
        </p>
        <span className="ornament-line rev" aria-hidden />
      </div>

      {/* ملخّصٌ كجدار ملصقات — بطاقاتٌ مائلة بالتناوب */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="مداومة حالية" value={a.currentStreak} icon="leaf" tint="sage" tilt="tilt-1" />
        <Stat label="أفضل مداومة" value={a.bestStreak} icon="spark" tint="amber" tilt="tilt-2" />
        <Stat label="أيام نشطة" value={a.activeDays} icon="check" tint="sky" tilt="tilt-2" />
        <Stat label="أيام مثالية" value={a.perfectDays} icon="sun" tint="clay" tilt="tilt-1" />
      </section>

      {/* لمحة أسبوعك — سطرٌ بخطّ المخطوطات */}
      <section className="card mt-6 p-5">
        <SectionTitle title="لمحة أسبوعك" />
        <p className="quote-seed text-center text-[15px] leading-relaxed text-[--color-muted]">
          {narrative}
        </p>
      </section>

      {/* حديقة/شبكة السنة */}
      <section className="card mt-6 p-5">
        <SectionTitle title="سنتك تُزهر" hint="آخر ٣٦٥ يوماً" />
        <YearView days={a.days} />
      </section>

      {/* الاتساق الأسبوعي */}
      <section className="card mt-6 p-5">
        <SectionTitle title="اتساقك الأسبوعي" hint="آخر ٨ أسابيع" />
        <WeeklyChart weeks={a.weeks} />
      </section>

      {/* الشارات */}
      <section className="card mt-6 p-5">
        <SectionTitle title="شاراتك" hint={`${ar(earnedCount(a))} مفتوحة`} />
        <BadgesSection stats={a} />
      </section>

      {/* مشاركة الحصاد */}
      <Link
        href="/harvest"
        className="press pill mt-6 flex items-center justify-center gap-2 border-[2.5px] border-[--color-border] bg-[--color-accent] py-3.5 text-center font-bold text-[#141414] shadow-[var(--shadow-2)]"
      >
        <Icon name="spark" size={20} />
        شارك حصادك
      </Link>

      <p className="mt-6 text-center text-sm text-[--color-muted]">
        أتممتَ <span className="text-gild tabular font-bold">{ar(a.totalCompletions)}</span>{" "}
        عادةً حتى الآن. واصِل، فالمداومة تُثمر.
      </p>

      <BottomNav />
    </main>
  );
}
