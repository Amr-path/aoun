"use client";
// عون — غلاف لوحة التحكم: رأس دافئ متكيّف + شبكة العادات + إضافة + مكافأة.
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { DashboardData } from "@/lib/habits";
import { useDashboard } from "@/store/dashboard";
import { levelFromXp } from "@/lib/scoring";
import { BRAND } from "@/lib/constants";
import { streakStage } from "@/lib/messages";
import { ar } from "@/lib/numerals";
import Logo from "./Logo";
import FlowerScore from "./FlowerScore";
import CompanionSprout from "./CompanionSprout";
import HabitCard from "./HabitCard";
import AddHabit from "./AddHabit";
import NotificationsToggle from "./NotificationsToggle";
import AmbientPulse from "./AmbientPulse";
import RewardPop from "./RewardPop";

function subtitle(done: number, due: number): string {
  if (due === 0) return "لا عادات مستحقّة اليوم — خذ قسطاً من الراحة.";
  if (done >= due) return "يومٌ مكتمل — أحسنت صنعاً.";
  const left = due - done;
  if (left === 1) return "بقيت عادةٌ واحدة على اكتمال يومك.";
  if (left === 2) return "بقيت عادتان على اكتمال يومك.";
  return `بقيت ${ar(left)} عادات على اكتمال يومك.`;
}

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
  const { level, intoLevel, span } = levelFromXp(s.totalXp);
  const doneCount = view.filter((h) => h.dueToday && h.completedToday).length;
  const dueCount = view.filter((h) => h.dueToday).length;
  const stage = streakStage(s.streakCount);

  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-28 pt-6">
      {/* شريط العلامة */}
      <div className="mb-6 flex items-center justify-between">
        <Logo size={30} withWordmark />
        <div className="flex items-center gap-2">
          <Link
            href="/analytics"
            className="pill inline-flex items-center gap-1.5 border border-[--color-border] bg-[--color-surface] px-4 py-2 text-sm font-medium text-[--color-ink] transition-colors hover:bg-[--color-surface-2]"
          >
            🌿 رحلتك
          </Link>
          <Link
            href="/settings"
            aria-label="الإعدادات"
            className="pill inline-flex h-10 w-10 items-center justify-center border border-[--color-border] bg-[--color-surface] text-[--color-ink] transition-colors hover:bg-[--color-surface-2]"
          >
            ⚙
          </Link>
        </div>
      </div>

      <header className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-[--color-muted]">{dateLabel}</p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-black text-[--color-ink]">
            {greeting}
          </h1>
          <p className="mt-1.5 text-sm text-[--color-muted]">{subtitle(doneCount, dueCount)}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span className="streak inline-flex items-center gap-1 text-[--color-sage-ink]">
              {stage.emoji || "🌱"} {ar(s.streakCount)}{" "}
              <span className="text-[--color-muted]">مداومة</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[--color-lavender-ink]">
              ✦ مستوى {ar(level)}
            </span>
            <span className="tabular text-[--color-muted]">
              {ar(doneCount)}/{ar(dueCount)} اليوم
            </span>
          </div>
        </div>
        <FlowerScore habits={view} score={s.currentScore} />
      </header>

      {/* بذرةُ اليوم */}
      <p className="mt-4 border-r-2 border-[--color-sage] pr-3 text-sm italic text-[--color-muted]">
        {seed}
      </p>

      {/* رسالة التعافي عند العودة بعد انقطاع */}
      {recovery && (
        <div
          className="mt-4 flex items-start gap-3 rounded-[--radius-card] p-4"
          style={{ background: "var(--color-blush-soft)" }}
        >
          <span className="text-xl">🤍</span>
          <p className="text-sm leading-relaxed text-[--color-blush-ink]">{recovery}</p>
        </div>
      )}

      {/* شريط تقدّم المستوى */}
      <div
        className="mt-5 h-2.5 overflow-hidden rounded-full bg-[--color-surface-2]"
        style={{ boxShadow: "inset 0 1px 2px rgba(60,50,40,0.09)" }}
      >
        <div
          className="h-full rounded-full transition-[width] duration-700"
          style={{
            width: `${Math.round((intoLevel / span) * 100)}%`,
            background: "linear-gradient(90deg, var(--color-lavender), var(--color-sage))",
          }}
        />
      </div>

      {/* الرفيق الحيّ */}
      <div className="mt-4">
        <CompanionSprout done={doneCount} due={dueCount} />
      </div>

      {/* شبكة العادات */}
      <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {view.map((h, i) => (
          <div key={h.id} className="animate-rise" style={{ animationDelay: `${i * 55}ms` }}>
            <HabitCard habit={h} />
          </div>
        ))}
        {view.length < BRAND.maxHabits && (
          <div className="animate-rise" style={{ animationDelay: `${view.length * 55}ms` }}>
            <AddHabit />
          </div>
        )}
      </section>

      {view.length === 0 && (
        <p className="mt-16 text-center text-[--color-muted]">لا عادات بعد.</p>
      )}

      {/* طقس المساء */}
      <Link
        href="/reflect"
        className="card lift mt-4 flex items-center gap-3 p-4"
      >
        <span
          className="icon-chip h-11 w-11 shrink-0 text-xl"
          style={{ background: "var(--color-lavender-soft)" }}
        >
          🌙
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-[--color-ink]">طقس المساء</span>
          <span className="block text-xs text-[--color-muted]">
            راجع يومك بلطف قبل النوم.
          </span>
        </span>
        <span className="text-[--color-faint]">←</span>
      </Link>

      <NotificationsToggle />

      <AmbientPulse />
      <RewardPop />
    </main>
  );
}
