// عون — صفحة «رحلتك»: شبكة السنة + الاتساق الأسبوعي + ملخّص.
import Link from "next/link";
import { requireUserId } from "@/lib/auth";
import { getAnalytics } from "@/lib/analytics";
import { prisma } from "@/lib/db";
import { ar } from "@/lib/numerals";
import { weeklyNarrative } from "@/lib/narrative";
import YearView from "@/components/YearView";
import WeeklyChart from "@/components/WeeklyChart";
import BadgesSection from "@/components/BadgesSection";
import LogoutButton from "@/components/LogoutButton";
import { earnedCount } from "@/lib/badges";

export const dynamic = "force-dynamic";
export const metadata = { title: "رحلتك" };

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-4">
      <p className="text-xs text-[--color-muted]">{label}</p>
      <p className="score mt-1 font-[family-name:var(--font-display)] text-3xl font-black text-[--color-ink]">
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
    <main className="mx-auto w-full max-w-2xl px-5 pb-24 pt-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-black text-[--color-ink]">
          رحلتك
        </h1>
        <div className="flex items-center gap-2">
          <LogoutButton />
          <Link
            href="/dashboard"
            className="pill border border-[--color-border] bg-[--color-surface] px-4 py-2 text-sm font-medium text-[--color-ink] transition-colors hover:bg-[--color-surface-2]"
          >
            ← اللوحة
          </Link>
        </div>
      </div>

      {/* ملخّص */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="مداومة حالية" value={a.currentStreak} />
        <Stat label="أفضل مداومة" value={a.bestStreak} />
        <Stat label="أيام نشطة" value={a.activeDays} />
        <Stat label="أيام مثالية" value={a.perfectDays} />
      </section>

      {/* لمحة أسبوعك */}
      <section className="card mt-4 p-5">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-black text-[--color-ink]">
          لمحة أسبوعك
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[--color-muted]">{narrative}</p>
      </section>

      {/* حديقة/شبكة السنة */}
      <section className="card mt-4 p-5">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-black text-[--color-ink]">
            سنتك تُزهر
          </h2>
          <span className="text-xs text-[--color-faint]">آخر ٣٦٥ يوماً</span>
        </div>
        <YearView days={a.days} />
      </section>

      {/* الاتساق الأسبوعي */}
      <section className="card mt-4 p-5">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-black text-[--color-ink]">
            اتساقك الأسبوعي
          </h2>
          <span className="text-xs text-[--color-faint]">آخر ٨ أسابيع</span>
        </div>
        <WeeklyChart weeks={a.weeks} />
      </section>

      {/* الشارات */}
      <section className="card mt-4 p-5">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-black text-[--color-ink]">
            شاراتك
          </h2>
          <span className="text-xs text-[--color-faint]">
            {ar(earnedCount(a))} مفتوحة
          </span>
        </div>
        <BadgesSection stats={a} />
      </section>

      {/* مشاركة الحصاد */}
      <Link
        href="/harvest"
        className="pill mt-4 flex items-center justify-center gap-2 py-3.5 text-center font-semibold text-white transition-transform active:scale-95"
        style={{ background: "var(--color-sage)" }}
      >
        🌾 شارك حصادك
      </Link>

      <p className="mt-6 text-center text-sm text-[--color-muted]">
        أتممتَ {ar(a.totalCompletions)} عادةً حتى الآن. واصِل، فالمداومة تُثمر.
      </p>
    </main>
  );
}
