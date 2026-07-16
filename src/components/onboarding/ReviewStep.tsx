"use client";
// عون — مراجعة العادات المقترحة: إزالة، وإضافة عادة مخصّصة عبر طبقة التنقيح.
import { useState } from "react";
import { BRAND } from "@/lib/constants";
import type { OnboardingHabitInput } from "@/lib/habits";
import { accentSoftOf, accentInkOf } from "@/lib/colors";
import { ar } from "@/lib/numerals";
import Icon from "@/components/ui/Icon";
import Spinner from "@/components/ui/Spinner";

export interface DraftHabit extends OnboardingHabitInput {
  uid: string;
  /** للعرض فقط (لا يُرسل للخادم). */
  identity?: string;
  note?: string;
  why?: string;
}

interface Props {
  habits: DraftHabit[];
  onRemove: (uid: string) => void;
  onAddCustom: (text: string) => Promise<void>;
  onFinish: () => Promise<void>;
  finishing: boolean;
}

export default function ReviewStep({
  habits,
  onRemove,
  onAddCustom,
  onFinish,
  finishing,
}: Props) {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const full = habits.length >= BRAND.maxHabits;

  const submitCustom = async () => {
    const t = text.trim();
    if (!t || full || adding) return;
    setAdding(true);
    try {
      await onAddCustom(t);
      setText("");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="animate-rise flex flex-col">
      <h2 className="font-[family-name:var(--font-display)] text-3xl font-black text-[--color-ink]">
        عاداتك السبع
      </h2>
      <p className="mt-3 text-[--color-muted]">
        اخترناها لك بعنايةٍ من إجاباتك. عدّلها كما تشاء — {habits.length}/
        {BRAND.maxHabits}.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {habits.map((h) => (
          <div key={h.uid} className="card flex items-center gap-3.5 p-4">
            <span
              className="grid h-12 w-12 shrink-0 place-items-center rounded-[10px] text-2xl"
              style={{ background: accentSoftOf(h.colorKey) }}
            >
              {h.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-semibold text-[--color-ink]">{h.title}</h3>
                {h.apiRefined && (
                  <span
                    className="pill inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold"
                    style={{ background: "var(--color-accent-soft)", color: "var(--color-accent-ink)" }}
                  >
                    <Icon name="spark" size={10} strokeWidth={2} />
                    منقّحة
                  </span>
                )}
              </div>
              {h.identity && (
                <p className="mt-0.5 text-xs" style={{ color: accentInkOf(h.colorKey) }}>{h.identity}</p>
              )}
              {h.why && (
                <p className="mt-0.5 text-xs italic text-[--color-faint]">{h.why}</p>
              )}
              <p className="tabular mt-1 flex items-center gap-1.5 text-xs text-[--color-faint]">
                <Icon name="clock" size={13} className="text-[--color-faint]" />
                {ar(h.scheduledAt)} · {h.frequency === "daily" ? "يومي" : "أيام محدّدة"}
              </p>
            </div>
            {confirmId === h.uid ? (
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onRemove(h.uid);
                    setConfirmId(null);
                  }}
                  aria-label={`تأكيد إزالة ${h.title}`}
                  className="press grid h-8 w-8 place-items-center rounded-full bg-[--color-danger-soft] text-[--color-danger-ink]"
                >
                  <Icon name="check" size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmId(null)}
                  aria-label="إلغاء"
                  className="press grid h-8 w-8 place-items-center rounded-full text-[--color-faint] hover:bg-[--color-surface-2]"
                >
                  <Icon name="close" size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmId(h.uid)}
                aria-label={`إزالة ${h.title}`}
                className="press grid h-8 w-8 shrink-0 place-items-center rounded-full text-[--color-faint] transition-colors hover:bg-[--color-danger-soft] hover:text-[--color-danger-ink]"
              >
                <Icon name="close" size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      {!full && (
        <div className="mt-4">
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitCustom()}
              placeholder="اكتب عادتك بكلماتك… مثال: أشرب ماءً أكثر"
              className="flex-1 rounded-[12px] bg-[--color-surface] px-4 py-3 text-[--color-ink] shadow-[var(--shadow-1)] outline-none transition-shadow placeholder:text-[--color-faint] focus:shadow-[0_0_0_2px_var(--color-accent),var(--shadow-1)]"
            />
            <button
              type="button"
              onClick={submitCustom}
              disabled={adding || !text.trim()}
              className="press inline-flex shrink-0 items-center gap-1.5 rounded-[12px] bg-[--color-accent-soft] px-5 font-semibold text-[--color-accent-ink] transition-colors disabled:opacity-50"
            >
              {adding ? (
                <span className="inline-flex items-center justify-center">
                  <Spinner size={16} />
                </span>
              ) : (
                <>
                  <Icon name="plus" size={16} strokeWidth={2.2} />
                  إضافة
                </>
              )}
            </button>
          </div>
          <p className="mt-1.5 text-xs text-[--color-faint]">
            سيحوّلها عون إلى عادةٍ قابلة للتنفيذ بخطواتٍ وأوقاتٍ مقترحة.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={onFinish}
        disabled={finishing || habits.length === 0}
        className="btn-clay press mt-8 flex items-center justify-center gap-2 rounded-[12px] py-4 text-center font-bold disabled:opacity-50"
      >
        {finishing ? (
          <span className="inline-flex items-center justify-center">
            <Spinner />
          </span>
        ) : (
          <>
            <Icon name="leaf" size={18} />
            ابدأ رحلتي
          </>
        )}
      </button>
    </div>
  );
}
