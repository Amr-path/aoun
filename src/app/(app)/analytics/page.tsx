// عون — صفحة «رحلتك»: ملخّص الأثر بروح iOS — عنوانٌ كبير، بطاقاتُ إحصاءٍ بيضاء هادئة، وأقسامٌ بعناوين خافتة.
import Link from "next/link";
import { requireUserId } from "@/lib/auth";
import { getAnalytics } from "@/lib/analytics";
import { prisma } from "@/lib/db";
import { ar } from "@/lib/numerals";
import { weeklyNarrative } from "@/lib/narrative";
import YearView from "@/components/YearView";
import WeeklyChart from "@/components/WeeklyChart";
import BadgesSection from "@/components/BadgesSection";
import Icon, { type IconName } from "@/components/ui/Icon";
import { earnedCount } from "@/lib/badges";

export const dynamic = "force-dynamic";
export const metadata = { title: "رحلتك" };

// عنوان قسمٍ بأسلوب iOS: سطرٌ صغير خافت فوق البطاقة — بلا زخرفة.
function SectionTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-2 flex items-baseline justify-between px-1">
      <h2 className="text-[13px] font-medium text-[--color-faint]">{title}</h2>
      {hint ? <span className="tabular text-[12px] text-[--color-faint]">{hint}</span> : null}
    </div>
  );
}

// بطاقة إحصاء: خليةٌ بيضاء، تسميةٌ خافتة مع رمزٍ صغير، ورقمٌ كبير بالحبر —
// والرقم البطل وحده يلبس لون النظام.
function Stat({
  label,
  value,
  icon,
  hero,
}: {
  label: string;
  value: number;
  icon: IconName;
  hero?: boolean;
}) {
  return (
    <div className="card p-4">
      <p className="flex items-center gap-1.5 text-[13px] text-[--color-faint]">
        <Icon name={icon} size={14} />
        {label}
      </p>
      <p
        className={`score tabular mt-1 text-[28px] font-bold leading-tight ${
          hero ? "text-[--color-accent]" : "text-[--color-ink]"
        }`}
      >
        {ar(value)}
      </p>
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
      {/* عنوانٌ كبير + رجوعٌ نصّي بلون النظام */}
      <div className="mb-1 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-[28px] font-bold text-[--color-ink]">
          رحلتك
        </h1>
        <Link
          href="/dashboard"
          className="press inline-flex items-center gap-1 px-1 text-[15px] font-medium text-[--color-accent]"
        >
          <Icon name="chevron" size={16} className="scale-x-[-1]" />
          اللوحة
        </Link>
      </div>
      <p className="mb-6 px-0.5 text-[15px] text-[--color-muted]">أثرك، يوماً بيوم</p>

      {/* ملخّص الأرقام — بطاقاتٌ بيضاء مستوية */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="مداومة حالية" value={a.currentStreak} icon="leaf" hero />
        <Stat label="أفضل مداومة" value={a.bestStreak} icon="spark" />
        <Stat label="أيام نشطة" value={a.activeDays} icon="check" />
        <Stat label="أيام مثالية" value={a.perfectDays} icon="sun" />
      </section>

      {/* لمحة أسبوعك */}
      <section className="mt-6">
        <SectionTitle title="لمحة أسبوعك" />
        <div className="card p-5">
          <p className="text-[15px] leading-relaxed text-[--color-muted]">{narrative}</p>
        </div>
      </section>

      {/* حديقة/شبكة السنة */}
      <section className="mt-6">
        <SectionTitle title="سنتك تُزهر" hint="آخر ٣٦٥ يوماً" />
        <div className="card p-5">
          <YearView days={a.days} />
        </div>
      </section>

      {/* الاتساق الأسبوعي */}
      <section className="mt-6">
        <SectionTitle title="اتساقك الأسبوعي" hint="آخر ٨ أسابيع" />
        <div className="card p-5">
          <WeeklyChart weeks={a.weeks} />
        </div>
      </section>

      {/* الشارات */}
      <section className="mt-6">
        <SectionTitle title="شاراتك" hint={`${ar(earnedCount(a))} مفتوحة`} />
        <div className="card p-5">
          <BadgesSection stats={a} />
        </div>
      </section>

      {/* مشاركة الحصاد */}
      <Link
        href="/harvest"
        className="btn-clay press mt-6 flex items-center justify-center gap-2 rounded-[12px] py-3.5 text-center font-bold"
      >
        <Icon name="spark" size={20} />
        شارك حصادك
      </Link>

      <p className="mt-6 text-center text-sm text-[--color-muted]">
        أتممتَ{" "}
        <span className="tabular font-semibold text-[--color-accent-ink]">
          {ar(a.totalCompletions)}
        </span>{" "}
        عادةً حتى الآن. واصِل، فالمداومة تُثمر.
      </p>
    </main>
  );
}
