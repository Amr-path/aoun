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
import BloomHero, { type Daypart } from "./BloomHero";
import HabitCard from "./HabitCard";
import AddHabit from "./AddHabit";
import BottomNav from "./BottomNav";
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

        {/* الترويسة — تحية أكبر واسمٌ مُذهّب */}
        <div className="mt-3 flex items-end justify-between gap-3">
          <h1 className="font-[family-name:var(--font-display)] text-[1.65rem] font-black leading-tight text-[--color-ink]">
            {greeting}
            {userName ? (
              <>
                {"، "}
                <span className="text-gild">{userName}</span>
              </>
            ) : null}
          </h1>
          <span className="shrink-0 rounded-full border border-[--color-hairline-soft] bg-[--color-surface] px-2.5 py-1 text-xs font-semibold text-[--color-muted]">
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

        {/* بذرةُ اليوم — حكمةٌ بخطّ المخطوطات بين زخرفتين */}
        <div className="mt-3.5 flex items-center gap-3 px-2">
          <span className="ornament-line" aria-hidden />
          <p className="quote-seed max-w-[17rem] text-center text-[15px] leading-relaxed text-[--color-muted]">
            {seed}
          </p>
          <span className="ornament-line rev" aria-hidden />
        </div>

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

        {/* قسم العادات + خيط اليوم الذهبي */}
        <div className="mb-1.5 mt-5 flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-base font-bold text-[--color-ink]">
            عاداتك اليوم
          </h2>
          <span className="tabular text-xs font-semibold text-[--color-muted]">
            {ar(doneCount)} / {ar(dueCount)}
          </span>
        </div>
        <div className="thread mb-3" role="progressbar" aria-label="تقدّم اليوم"
          aria-valuemin={0} aria-valuemax={dueCount} aria-valuenow={doneCount}>
          <i style={{ width: dueCount ? `${(doneCount / dueCount) * 100}%` : "0%" }} />
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
              <span className="ornament-line" aria-hidden />
              <span className="inline-flex items-center gap-1.5">
                <svg width="8" height="8" viewBox="0 0 10 10" aria-hidden className="text-[--color-accent]">
                  <rect x="2" y="2" width="6" height="6" transform="rotate(45 5 5)" fill="currentColor" />
                </svg>
                مكتمل اليوم
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

      <BottomNav />
    </>
  );
}
