"use client";
// عون — الشاشة الرئيسية: شريطٌ علويّ نحيف + هيرو «زهرة اليوم» + قائمةٌ تفرز نفسها + شريطٌ سفليّ.
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { DashboardData } from "@/lib/habits";
import { useDashboard } from "@/store/dashboard";
import { levelFromXp } from "@/lib/scoring";
import { BRAND } from "@/lib/constants";
import { ar } from "@/lib/numerals";
import Logo from "./Logo";
import Icon from "./ui/Icon";
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
        {/* شريط علوي نحيف */}
        <div className="flex h-10 items-center justify-between">
          <Logo size={30} withWordmark />
          <Link
            href="/settings"
            aria-label="الإعدادات"
            className="press grid h-9 w-9 place-items-center rounded-[--radius-md] border border-[--color-hairline-soft] bg-[--color-surface] text-[--color-muted] shadow-[var(--shadow-top),var(--shadow-1)]"
          >
            <Icon name="settings" size={19} />
          </Link>
        </div>

        {/* الترويسة */}
        <div className="mt-3 flex items-baseline justify-between gap-3">
          <h1 className="font-[family-name:var(--font-display)] text-[24px] font-bold leading-tight text-[--color-ink]">
            {greeting}
            {userName ? `، ${userName}` : ""}
          </h1>
          <span className="shrink-0 text-[12px] font-medium text-[--color-faint]">{dateLabel}</span>
        </div>

        {/* هيرو «زهرة اليوم» */}
        <BloomHero done={doneCount} due={dueCount} streak={s.streakCount} level={level} />

        {/* بذرةُ اليوم — سطرٌ هامسٌ صغير */}
        <p className="mt-2.5 truncate text-center text-[12px] italic text-[--color-faint]">
          {seed}
        </p>

        {/* رسالة تعافٍ عند العودة بعد انقطاع */}
        {recovery && (
          <div
            className="mt-3 flex items-start gap-2.5 rounded-[--radius-card] p-3.5"
            style={{ background: "var(--color-accent-soft)" }}
          >
            <Icon name="leaf" size={17} className="mt-0.5 shrink-0 text-[--color-accent-ink]" />
            <p className="text-[13px] leading-relaxed text-[--color-accent-ink]">{recovery}</p>
          </div>
        )}

        {/* قسم العادات */}
        <div className="mb-2.5 mt-5 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-[16px] font-bold text-[--color-ink]">
            عاداتك اليوم
          </h2>
          <span className="tabular text-[12.5px] font-semibold text-[--color-muted]">
            {ar(doneCount)} / {ar(dueCount)}
          </span>
        </div>

        <section className="flex flex-col gap-2.5">
          {pending.map((h, i) => (
            <div key={h.id} className="animate-rise" style={{ animationDelay: `${i * 45}ms` }}>
              <HabitCard habit={h} />
            </div>
          ))}

          {view.length < BRAND.maxHabits && <AddHabit />}

          {doneList.length > 0 && (
            <div className="my-1 flex items-center gap-3 px-1 text-[12px] font-semibold text-[--color-faint]">
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

        {view.length === 0 && (
          <p className="mt-16 text-center text-[--color-muted]">لا عادات بعد.</p>
        )}

        <AmbientPulse />
        <RewardPop />
      </main>

      <BottomNav />
    </>
  );
}
