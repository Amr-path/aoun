"use client";
// عون — الشاشة الرئيسية: شريطٌ علويّ نحيف + هيرو «زهرة اليوم» + قائمةٌ تفرز نفسها.
// الشريط السفليّ يأتي من app/(app)/layout.tsx — لا يُركَّب هنا.
import { useEffect, useRef } from "react";
import Link from "next/link";
import type { DashboardData } from "@/lib/habits";
import { useDashboard } from "@/store/dashboard";
import { levelFromXp } from "@/lib/scoring";
import { BRAND } from "@/lib/constants";
import { ar } from "@/lib/numerals";
import { todayKey } from "@/lib/date";
import Logo from "./Logo";
import Icon from "./ui/Icon";
import FlowerMark from "./FlowerMark";
import BloomHero, { type Daypart } from "./BloomHero";
import HabitCard from "./HabitCard";
import AddHabit from "./AddHabit";
import AmbientPulse from "./AmbientPulse";
import RewardPop from "./RewardPop";

interface Props {
  initial: DashboardData;
  greeting: string;
  daypart: Daypart;
  dateLabel: string;
  seed: string;
  userName: string | null;
  recovery: string | null;
}

export default function DashboardClient({
  initial,
  greeting,
  daypart,
  dateLabel,
  seed,
  userName,
  recovery,
}: Props) {
  const hydrate = useDashboard((s) => s.hydrate);
  const setUserName = useDashboard((s) => s.setUserName);
  const habits = useDashboard((s) => s.habits);
  const score = useDashboard((s) => s.score);
  const loading = useDashboard((s) => s.loading);

  const hydrated = useRef(false);
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    hydrate(initial);
    setUserName(userName);
  }, [hydrate, initial, setUserName, userName]);

  // انقلاب منتصف الليل: في PWA مفتوحة يتجمّد dateKey عند التحميل،
  // فنقارن تاريخ اليوم المحلّي بمفتاح المتجر عند عودة الظهور وكلّ دقيقة.
  useEffect(() => {
    const check = () => {
      const { dateKey, loading: stillLoading, refresh } = useDashboard.getState();
      if (stillLoading || !dateKey) return;
      const localToday = todayKey(Intl.DateTimeFormat().resolvedOptions().timeZone);
      if (localToday !== dateKey) void refresh();
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisible);
    const interval = window.setInterval(check, 60_000);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.clearInterval(interval);
    };
  }, []);

  // مصدرُ حقيقةٍ واحد: بعد الترطيب نعتمد المتجر دائماً — حتى لو كان فارغاً.
  const view = habits;
  const s = score;
  const { level } = levelFromXp(s.totalXp);
  const doneCount = view.filter((h) => h.dueToday && h.completedToday).length;
  const dueCount = view.filter((h) => h.dueToday).length;

  // فرزٌ تلقائي: غير المكتملة أعلى (المستحقّة أولاً)، والمكتملة تنزل أسفل.
  const ordered = [...view].sort((a, b) => {
    const ad = a.completedToday ? 1 : 0;
    const bd = b.completedToday ? 1 : 0;
    if (ad !== bd) return ad - bd;
    const au = a.dueToday ? 0 : 1;
    const bu = b.dueToday ? 0 : 1;
    if (au !== bu) return au - bu;
    return a.position - b.position;
  });
  const pending = ordered.filter((h) => !h.completedToday);
  const doneList = ordered.filter((h) => h.completedToday);

  return (
    <main className="mx-auto w-full max-w-lg px-5 pb-32 pt-3">
      {/* شريط علوي نحيف — الإعدادات تُفتح من الشريط السفليّ (أُزيل الترس المكرّر). */}
      <div className="flex h-10 items-center">
        <Logo size={30} withWordmark />
      </div>

      {/* الترويسة — عنوانٌ كبير بروح iOS وتاريخٌ ثانويّ هادئ */}
      <div className="mt-3 flex items-end justify-between gap-3">
        <h1 className="font-[family-name:var(--font-display)] text-[28px] font-bold leading-tight text-[--color-ink]">
          {greeting}
          {userName ? (
            <>
              {"، "}
              <span className="text-gild">{userName}</span>
            </>
          ) : null}
        </h1>
        <span className="shrink-0 pb-1 text-[13px] font-medium text-[--color-faint]">
          {dateLabel}
        </span>
      </div>

      {/* «سماء اليوم» — لوحة حيّة تتبدّل مع وقتك */}
      <BloomHero
        habits={view.filter((h) => h.dueToday)}
        streak={s.streakCount}
        level={level}
        daypart={daypart}
      />

      {/* بذرةُ اليوم — سطرٌ واحد هادئ بين فاصلين شعريين */}
      <div className="mt-3.5 flex items-center gap-3 px-2">
        <span className="ornament-line" aria-hidden />
        <p className="quote-seed max-w-[17rem] text-center text-[15px] leading-relaxed text-[--color-muted]">
          {seed}
        </p>
        <span className="ornament-line rev" aria-hidden />
      </div>

      {/* رسالة تعافٍ عند العودة بعد انقطاع */}
      {recovery && (
        <div className="card mt-3 flex items-start gap-3 p-3.5">
          <span className="icon-chip h-8 w-8 shrink-0 bg-[--color-accent-soft] text-[--color-accent-ink]">
            <Icon name="leaf" size={16} />
          </span>
          <p className="text-sm leading-relaxed text-[--color-ink]">{recovery}</p>
        </div>
      )}

      {/* ترويسة القسم — بأسلوب ترويسات مجموعات iOS */}
      <div className="mb-1.5 mt-5 flex items-center justify-between px-1">
        <h2 className="text-[13px] font-semibold text-[--color-faint]">عاداتك اليوم</h2>
        <span className="tabular text-[13px] font-medium text-[--color-faint]">
          {ar(doneCount)} / {ar(dueCount)}
        </span>
      </div>
      {/* «خرزات اليوم» — تقدّمٌ مقسّم بروح iOS: شريحةٌ لكلّ عادةٍ مستحقّة */}
      <div
        className="mb-3 flex min-h-4 items-center gap-1 px-1"
        role="progressbar"
        aria-label="خرزات اليوم"
        aria-valuemin={0}
        aria-valuemax={dueCount}
        aria-valuenow={doneCount}
      >
        {Array.from({ length: dueCount }, (_, i) => {
          const filled = i < doneCount;
          return (
            <span
              key={i}
              aria-hidden
              className="h-1.5 flex-1 rounded-full transition-colors duration-300"
              style={{
                background: filled ? "var(--color-accent)" : "var(--color-surface-3)",
              }}
            />
          );
        })}
      </div>

      <section className="flex flex-col gap-2">
        {/* هيكلٌ نابض قبل اكتمال الترطيب — بطاقاتٌ طينية صامتة */}
        {loading && (
          <div aria-hidden className="flex flex-col gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-[--radius-card] bg-[--color-surface-2] px-3 py-2"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="flex items-center gap-3 py-1">
                  <span className="h-10 w-10 shrink-0 rounded-full bg-[--color-surface-3]" />
                  <span className="flex min-w-0 flex-1 flex-col gap-2">
                    <span className="h-3.5 w-2/5 rounded-full bg-[--color-surface-3]" />
                    <span className="h-2.5 w-1/4 rounded-full bg-[--color-surface-3]" />
                  </span>
                  <span className="h-7 w-7 shrink-0 rounded-full bg-[--color-surface-3]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* حالة فارغة حقيقية بدل سطرٍ رماديّ باهت */}
        {!loading && view.length === 0 && (
          <div className="mb-1 flex flex-col items-center gap-3 rounded-[--radius-card] border-2 border-dashed border-[--color-hairline] px-6 py-9 text-center">
            <FlowerMark size={56} />
            <p className="text-base font-semibold text-[--color-ink]">هنا تبدأ حديقتك</p>
            <p className="max-w-[16rem] text-sm leading-relaxed text-[--color-muted]">
              أضِف عادتك الأولى، واجعلها أصغرَ ممّا تظنّ — فالصغيرةُ هي التي تبقى.
            </p>
          </div>
        )}

        {pending.map((h, i) => (
          <div key={h.id} className="animate-rise" style={{ animationDelay: `${i * 45}ms` }}>
            <HabitCard habit={h} />
          </div>
        ))}

        <div id="add-habit" className="scroll-mt-24">
          {!loading &&
            (view.length < BRAND.maxHabits ? (
              <AddHabit />
            ) : (
              // اكتمل العقد: بطاقةٌ هادئة بدل مرساةٍ فارغة يقفز إليها زرّ +
              <div className="card flex flex-col items-center gap-2 px-5 py-6 text-center">
                <h3 className="font-[family-name:var(--font-display)] text-base font-bold text-[--color-ink]">
                  اكتملت سبعتُك
                </h3>
                <p className="max-w-[19rem] text-sm leading-relaxed text-[--color-muted]">
                  سبعٌ تُتقنها خيرٌ من عشرٍ تثقلك — عدّل أو استبدل من الإعدادات
                </p>
                <Link
                  href="/settings"
                  className="press mt-1 text-sm font-semibold text-[--color-accent]"
                >
                  إلى الإعدادات
                </Link>
              </div>
            ))}
        </div>

        {doneList.length > 0 && (
          <div className="my-1 flex items-center gap-3 px-1 text-xs font-semibold text-[--color-faint]">
            <span className="ornament-line" aria-hidden />
            <span className="inline-flex items-center gap-1.5">
              <svg width="8" height="8" viewBox="0 0 10 10" aria-hidden className="text-[--color-accent]">
                <circle cx="5" cy="5" r="3.5" fill="currentColor" />
              </svg>
              اكتملت اليوم
            </span>
            <span className="ornament-line rev" aria-hidden />
          </div>
        )}

        {doneList.map((h) => (
          <div key={h.id}>
            <HabitCard habit={h} />
          </div>
        ))}
      </section>

      <AmbientPulse />
      <RewardPop />
    </main>
  );
}
