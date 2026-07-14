"use client";
// عون — الشاشة الرئيسية: شريطٌ علويّ نحيف + هيرو «زهرة اليوم» + قائمةٌ تفرز نفسها + شريطٌ سفليّ.
import { useEffect, useRef } from "react";
import type { DashboardData } from "@/lib/habits";
import { useDashboard } from "@/store/dashboard";
import { levelFromXp } from "@/lib/scoring";
import { BRAND } from "@/lib/constants";
import { ar } from "@/lib/numerals";
import Logo from "./Logo";
import Icon from "./ui/Icon";
import FlowerMark from "./FlowerMark";
import BloomHero from "./BloomHero";
import HabitCard from "./HabitCard";
import AddHabit from "./AddHabit";
import BottomNav from "./BottomNav";
import AmbientPulse from "./AmbientPulse";
import RewardPop from "./RewardPop";

interface Props {
  initial: DashboardData;
  greeting: string;
  dateLabel: string;
  seed: string;
  userName: string | null;
  recovery: string | null;
}

export default function DashboardClient({
  initial,
  greeting,
  dateLabel,
  seed,
  userName,
  recovery,
}: Props) {
  const hydrate = useDashboard((s) => s.hydrate);
  const setUserName = useDashboard((s) => s.setUserName);
  const habits = useDashboard((s) => s.habits);
  const score = useDashboard((s) => s.score);

  const hydrated = useRef(false);
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    hydrate(initial);
    setUserName(userName);
  }, [hydrate, initial, setUserName, userName]);

  const view = habits.length ? habits : initial.habits;
  const s = habits.length ? score : initial.score;
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
    <>
      <main className="mx-auto w-full max-w-lg px-5 pb-32 pt-3">
        {/* شريط علوي نحيف — الإعدادات تُفتح من الشريط السفليّ (أُزيل الترس المكرّر). */}
        <div className="flex h-10 items-center">
          <Logo size={30} withWordmark />
        </div>

        {/* الترويسة */}
        <div className="mt-3 flex items-baseline justify-between gap-3">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold leading-tight text-[--color-ink]">
            {greeting}
            {userName ? `، ${userName}` : ""}
          </h1>
          <span className="shrink-0 text-xs font-medium text-[--color-faint]">{dateLabel}</span>
        </div>

        {/* هيرو «زهرة اليوم» */}
        <BloomHero habits={view.filter((h) => h.dueToday)} streak={s.streakCount} level={level} />

        {/* بذرةُ اليوم — داخل قُلادةٍ لطيفة بتباينٍ أوضح (بلا قصّ). */}
        <p className="mt-2.5 text-center">
          <span className="inline-block rounded-full bg-[--color-surface-2] px-3 py-1 text-sm italic text-[--color-muted]">
            {seed}
          </span>
        </p>

        {/* رسالة تعافٍ عند العودة بعد انقطاع */}
        {recovery && (
          <div
            className="mt-3 flex items-start gap-2.5 rounded-[--radius-card] p-3.5"
            style={{ background: "var(--color-accent-soft)" }}
          >
            <Icon name="leaf" size={17} className="mt-0.5 shrink-0 text-[--color-accent-ink]" />
            <p className="text-sm leading-relaxed text-[--color-accent-ink]">{recovery}</p>
          </div>
        )}

        {/* قسم العادات */}
        <div className="mb-2.5 mt-5 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-base font-bold text-[--color-ink]">
            عاداتك اليوم
          </h2>
          <span className="tabular text-xs font-semibold text-[--color-muted]">
            {ar(doneCount)} / {ar(dueCount)}
          </span>
        </div>

        <section className="flex flex-col gap-2">
          {/* حالة فارغة حقيقية بدل سطرٍ رماديّ باهت */}
          {view.length === 0 && (
            <div className="mb-1 flex flex-col items-center gap-3 rounded-[--radius-card] border border-dashed border-[--color-hairline] px-6 py-9 text-center">
              <FlowerMark size={56} />
              <p className="text-base font-semibold text-[--color-ink]">ابدأ حديقتك اليوم</p>
              <p className="max-w-[16rem] text-sm leading-relaxed text-[--color-muted]">
                أضِف أوّل عادةٍ صغيرة — سطرٌ واحد يكفي، وسنحوّله إلى خطواتٍ لطيفة.
              </p>
            </div>
          )}

          {pending.map((h, i) => (
            <div key={h.id} className="animate-rise" style={{ animationDelay: `${i * 45}ms` }}>
              <HabitCard habit={h} />
            </div>
          ))}

          <div id="add-habit" className="scroll-mt-24">
            {view.length < BRAND.maxHabits && <AddHabit />}
          </div>

          {doneList.length > 0 && (
            <div className="my-1 flex items-center gap-3 px-1 text-xs font-semibold text-[--color-faint]">
              <span className="h-px flex-1 bg-[--color-hairline-soft]" />
              مكتمل اليوم
              <span className="h-px flex-1 bg-[--color-hairline-soft]" />
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

      <BottomNav />
    </>
  );
}
