"use client";
// عون — منسّق رحلة الإعداد: 5 أسئلة ← توصية 7 عادات ← تثبيت وانطلاق.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS, EMPTY_ANSWERS, isAnswered } from "@/lib/onboarding-questions";
import { recommendHabits, personalizeTimes } from "@/lib/recommend";
import type { DiagnosticAnswers, RefineHabitResponse } from "@/lib/types";
import { HABIT_META, type HabitTemplate } from "@/lib/constants";
import type { OnboardingHabitInput } from "@/lib/habits";
import DiagnosticFlow from "./DiagnosticFlow";
import ReviewStep, { type DraftHabit } from "./ReviewStep";
import Icon from "@/components/ui/Icon";

const REVIEW = QUESTIONS.length;

function uid(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

function templateToDraft(t: HabitTemplate): DraftHabit {
  return {
    uid: uid(),
    title: t.title,
    emoji: t.emoji,
    frequency: t.frequency,
    weekdays: t.weekdays,
    scheduledAt: t.scheduledAt,
    microSteps: t.microSteps,
    colorKey: t.colorKey,
    apiRefined: false,
    identity: t.identity,
    note: t.note,
    why: HABIT_META[t.key]?.why,
  };
}

export default function OnboardingClient() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<DiagnosticAnswers>(EMPTY_ANSWERS);
  const [drafts, setDrafts] = useState<DraftHabit[]>([]);
  const [finishing, setFinishing] = useState(false);

  const onChange = (patch: Partial<DiagnosticAnswers>) =>
    setAnswers((a) => ({ ...a, ...patch }));

  const goReview = () => {
    const recommended = personalizeTimes(recommendHabits(answers), answers.wakeTime);
    setDrafts(recommended.map(templateToDraft));
    setStep(REVIEW);
  };

  const advance = () => {
    if (step < REVIEW - 1) setStep((s) => s + 1);
    else goReview();
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const addCustom = async (text: string) => {
    const res = await fetch("/api/refine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rawText: text,
        context: { focusAreas: answers.focusArea, wakeTime: answers.wakeTime, locale: "ar" },
      }),
    });
    if (!res.ok) return;
    const r = (await res.json()) as RefineHabitResponse;
    setDrafts((d) => [
      ...d,
      {
        uid: uid(),
        title: r.title,
        emoji: r.emoji,
        frequency: r.frequency,
        weekdays: r.weekdays,
        scheduledAt: r.suggestedTimes[0] ?? "08:00",
        microSteps: r.microSteps,
        colorKey: r.colorKey,
        apiRefined: true,
      },
    ]);
  };

  const finish = async () => {
    setFinishing(true);
    try {
      const habits: OnboardingHabitInput[] = drafts.map((d) => ({
        title: d.title,
        emoji: d.emoji,
        frequency: d.frequency,
        weekdays: d.weekdays,
        scheduledAt: d.scheduledAt,
        microSteps: d.microSteps,
        colorKey: d.colorKey,
        apiRefined: d.apiRefined,
      }));
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diagnostic: answers, habits }),
      });
      if (!res.ok) throw new Error("failed");
      router.push("/dashboard");
    } catch {
      setFinishing(false);
    }
  };

  const q = QUESTIONS[step];
  const inReview = step === REVIEW;
  const progress = Math.round(((inReview ? REVIEW + 1 : step) / (REVIEW + 1)) * 100);
  const canAdvance = !inReview && isAnswered(q, answers);
  const showNext = !inReview && (q.kind === "multi" || q.kind === "time");

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-6 py-8">
      {/* الرأس: تقدّم ورجوع */}
      <div className="flex items-center gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={back}
            aria-label="رجوع"
            className="press card grid h-10 w-10 shrink-0 place-items-center rounded-full text-[--color-muted] transition-colors hover:text-[--color-ink]"
          >
            <Icon name="chevron" size={18} />
          </button>
        )}
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[--color-surface-2] shadow-[inset_0_1px_2px_rgba(35,28,20,0.06)]">
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{
              width: `${progress}%`,
              background: "var(--grad-sunrise)",
            }}
          />
        </div>
      </div>

      {/* المحتوى */}
      <div className="mt-10 flex-1">
        {inReview ? (
          <ReviewStep
            habits={drafts}
            onRemove={(id) => setDrafts((d) => d.filter((x) => x.uid !== id))}
            onAddCustom={addCustom}
            onFinish={finish}
            finishing={finishing}
          />
        ) : (
          <DiagnosticFlow
            question={q}
            answers={answers}
            onChange={onChange}
            onAdvance={advance}
          />
        )}
      </div>

      {/* زرّ التالي للأسئلة متعدّدة/الوقت */}
      {showNext && (
        <button
          type="button"
          onClick={advance}
          disabled={!canAdvance}
          className="press mt-8 flex items-center justify-center gap-2 rounded-[--radius-pill] bg-[--color-ink] py-3.5 text-center font-bold text-[--color-cream] shadow-[var(--shadow-2)] disabled:opacity-40"
        >
          التالي
          <Icon name="chevron" size={18} />
        </button>
      )}
    </main>
  );
}
