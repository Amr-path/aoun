"use client";
// عون — عرض سؤال تشخيصي واحد بحركة دخول لطيفة.
import type { DiagnosticAnswers, FocusArea } from "@/lib/types";
import type { Question } from "@/lib/onboarding-questions";
import Icon from "@/components/ui/Icon";

interface Props {
  question: Question;
  answers: DiagnosticAnswers;
  onChange: (patch: Partial<DiagnosticAnswers>) => void;
  onAdvance: () => void;
}

export default function DiagnosticFlow({ question, answers, onChange, onAdvance }: Props) {
  const selectSingle = (value: string) => {
    onChange({ [question.id]: value } as Partial<DiagnosticAnswers>);
    // مهلةٌ أطول (400ms) تترك فرصةً للتراجع عن لمسةٍ خاطئة قبل التقدّم التلقائي.
    window.setTimeout(onAdvance, 400);
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
      <p className="mt-3 text-[--color-muted]">{question.subtitle}</p>

      <div className="mt-8">
        {question.kind === "time" ? (
          <input
            type="time"
            value={answers.wakeTime}
            onChange={(e) => onChange({ wakeTime: e.target.value })}
            className="tabular w-full rounded-[--radius-md] border border-[--color-border] bg-[--color-surface] px-5 py-4 text-center text-2xl text-[--color-ink] shadow-[var(--shadow-1)] outline-none transition-colors focus:border-[--color-accent]"
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
                  className={`press card flex items-center gap-3.5 p-4 text-start transition-all ${
                    selected
                      ? "border-[--color-accent] ring-1 ring-[--color-accent]"
                      : "lift"
                  }`}
                  style={
                    selected
                      ? { background: "var(--color-accent-soft)" }
                      : undefined
                  }
                >
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-[--radius-md] text-xl transition-colors"
                    style={{
                      background: selected
                        ? "var(--color-surface)"
                        : "var(--color-surface-2)",
                    }}
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
                      className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[--color-accent-ink]"
                      style={{ background: "var(--color-accent)" }}
                      aria-hidden
                    >
                      <Icon name="check" size={14} className="text-[--color-cream]" strokeWidth={2.4} />
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
