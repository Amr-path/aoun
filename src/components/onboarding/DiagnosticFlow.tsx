"use client";
// عون — عرض سؤال تشخيصي واحد بحركة دخول لطيفة.
import type { DiagnosticAnswers, FocusArea } from "@/lib/types";
import type { Question } from "@/lib/onboarding-questions";

interface Props {
  question: Question;
  answers: DiagnosticAnswers;
  onChange: (patch: Partial<DiagnosticAnswers>) => void;
  onAdvance: () => void;
}

export default function DiagnosticFlow({ question, answers, onChange, onAdvance }: Props) {
  const selectSingle = (value: string) => {
    onChange({ [question.id]: value } as Partial<DiagnosticAnswers>);
    window.setTimeout(onAdvance, 240);
  };

  const toggleMulti = (value: string) => {
    const cur = answers.focusArea;
    const next = cur.includes(value as FocusArea)
      ? cur.filter((v) => v !== value)
      : [...cur, value as FocusArea];
    onChange({ focusArea: next });
  };

  return (
    <div key={question.id} className="animate-rise flex flex-col">
      <h2 className="font-[family-name:var(--font-display)] text-3xl font-black leading-tight text-[--color-ink]">
        {question.title}
      </h2>
      <p className="mt-2 text-[--color-muted]">{question.subtitle}</p>

      <div className="mt-8">
        {question.kind === "time" ? (
          <input
            type="time"
            value={answers.wakeTime}
            onChange={(e) => onChange({ wakeTime: e.target.value })}
            className="tabular w-full rounded-2xl border border-[--color-hairline] bg-[--color-surface] px-5 py-4 text-center text-2xl text-[--color-ink] shadow-sm outline-none focus:border-[--color-sage]"
          />
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {question.options!.map((opt) => {
              const selected =
                question.kind === "multi"
                  ? answers.focusArea.includes(opt.value as FocusArea)
                  : answers[question.id] === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    question.kind === "multi"
                      ? toggleMulti(opt.value)
                      : selectSingle(opt.value)
                  }
                  aria-pressed={selected}
                  className={`card flex items-center gap-3.5 p-4 text-start transition-all active:scale-[0.98] ${
                    selected ? "ring-2 ring-[--color-sage]" : "hover:border-[--color-hairline]"
                  }`}
                  style={selected ? { background: "var(--color-sage-soft)" } : undefined}
                >
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-xl"
                    style={{ background: "var(--color-surface-2)" }}
                  >
                    {opt.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-[--color-ink]">{opt.label}</span>
                    {opt.hint && (
                      <span className="block text-xs text-[--color-muted]">{opt.hint}</span>
                    )}
                  </span>
                  {selected && (
                    <span
                      className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-sm text-white"
                      style={{ background: "var(--color-sage)" }}
                      aria-hidden
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
