"use client";
// عون — بطاقة العادة: إتمامٌ لطيف بهالةٍ واحدة + تعديل كامل (عنوان، رمز، لون، وقت، تكرار، حذف).
import { useState } from "react";
import type { HabitWithStatus } from "@/lib/types";
import { useDashboard } from "@/store/dashboard";
import { EMOJI_CHOICES } from "@/lib/constants";
import { COLOR_KEYS } from "@/lib/types";
import { accentOf, accentSoftOf, accentInkOf } from "@/lib/colors";
import { streakStage } from "@/lib/messages";
import { ar } from "@/lib/numerals";
import Icon from "./ui/Icon";
import FrequencyToggle from "./FrequencyToggle";

export default function HabitCard({ habit }: { habit: HabitWithStatus }) {
  const toggle = useDashboard((s) => s.toggle);
  const setFrequency = useDashboard((s) => s.setFrequency);
  const setSchedule = useDashboard((s) => s.setSchedule);
  const patchHabit = useDashboard((s) => s.patchHabit);
  const removeHabit = useDashboard((s) => s.removeHabit);

  const [editing, setEditing] = useState(false);
  const [burst, setBurst] = useState(false);
  const [title, setTitle] = useState(habit.title);

  const accent = accentOf(habit.colorKey);
  const soft = accentSoftOf(habit.colorKey);
  const ink = accentInkOf(habit.colorKey);
  const done = habit.completedToday;
  const inactive = !habit.dueToday;

  const onCheck = () => {
    if (!done) {
      setBurst(true);
      window.setTimeout(() => setBurst(false), 600);
    }
    toggle(habit.id);
  };

  const commitTitle = () => {
    const t = title.trim();
    if (t && t !== habit.title) patchHabit(habit.id, { title: t });
    else setTitle(habit.title);
  };

  return (
    <div
      className={`press card relative p-3.5 ${inactive ? "opacity-55" : ""}`}
      style={done ? { background: soft, borderColor: "transparent" } : undefined}
    >
      {/* شريطٌ جانبيّ عند الإتمام */}
      {done && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-3.5 start-0 w-[3px] rounded-full"
          style={{ background: accent }}
        />
      )}

      <div className="flex items-center gap-3.5">
        {/* رمز العادة (اختيار المستخدم) */}
        <span
          className="icon-chip h-11 w-11 shrink-0 text-2xl"
          style={{ background: done ? "var(--color-surface)" : soft }}
        >
          {habit.emoji}
        </span>

        {/* العنوان والوصف */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[16.5px] font-semibold text-[--color-ink]">{habit.title}</h3>
          <div className="mt-1 flex items-center gap-1.5 text-[12.5px] text-[--color-muted]">
            <span className="tabular inline-flex items-center gap-1">
              <Icon name="clock" size={12} className="text-[--color-faint]" />
              {habit.scheduledAt}
            </span>
            <span aria-hidden>·</span>
            <span>{habit.frequency === "daily" ? "يومي" : "أيام محدّدة"}</span>
            {habit.streak > 0 && (
              <span
                className="streak inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold"
                style={{ background: soft, color: ink }}
                title={`مداومة ${streakStage(habit.streak).label}`}
              >
                <Icon name="leaf" size={11} />
                {ar(habit.streak)}
              </span>
            )}
          </div>
        </div>

        {/* زرّ الإتمام + هالة */}
        <button
          type="button"
          onClick={onCheck}
          aria-pressed={done}
          aria-label={done ? "إلغاء الإتمام" : "تحديد كمُنجز"}
          className={`relative grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full border-2 transition-transform active:scale-90 ${
            done ? "animate-pop" : ""
          }`}
          style={{
            borderColor: accent,
            background: done ? accent : "transparent",
            color: done ? "#fff" : accent,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M20 6 9 17l-5-5"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 26,
                strokeDashoffset: done ? 0 : 26,
                transition: "stroke-dashoffset 0.35s var(--ease-soft)",
              }}
            />
          </svg>
          {burst && (
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-2 rounded-full"
              style={{ background: accent, animation: "halo-pulse 0.55s var(--ease-soft) forwards" }}
            />
          )}
        </button>
      </div>

      {/* الخطوات الصغيرة */}
      {habit.microSteps.length > 0 && !editing && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {habit.microSteps.map((step, i) => (
            <span
              key={i}
              className="pill bg-[--color-surface-2] px-2.5 py-1 text-[11px] text-[--color-muted]"
            >
              {step}
            </span>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setEditing((v) => !v)}
        className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-[--color-faint] transition-colors hover:text-[--color-muted]"
      >
        <Icon name={editing ? "close" : "edit"} size={13} />
        {editing ? "إغلاق" : "تعديل"}
      </button>

      {editing && (
        <div className="mt-3 flex flex-col gap-4 border-t border-[--color-hairline-soft] pt-4">
          {/* العنوان */}
          <label className="flex flex-col gap-1.5">
            <span className="text-xs text-[--color-muted]">العنوان</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
              className="rounded-[--radius-sm] border border-[--color-hairline] bg-[--color-surface] px-3 py-2 text-[--color-ink] outline-none focus:border-[--color-accent]"
            />
          </label>

          {/* الرمز */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-[--color-muted]">الرمز</span>
            <div className="flex flex-wrap gap-1.5">
              {EMOJI_CHOICES.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => patchHabit(habit.id, { emoji: e })}
                  className={`grid h-9 w-9 place-items-center rounded-[--radius-sm] text-lg transition-all active:scale-90 ${
                    habit.emoji === e
                      ? "bg-[--color-surface-3] ring-2 ring-[--color-accent]"
                      : "bg-[--color-surface-2] hover:bg-[--color-surface-3]"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* اللون */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-[--color-muted]">اللون</span>
            <div className="flex flex-wrap gap-2.5">
              {COLOR_KEYS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`اللون ${c}`}
                  onClick={() => patchHabit(habit.id, { colorKey: c })}
                  className="h-8 w-8 rounded-full transition-transform active:scale-90"
                  style={{
                    background: accentOf(c),
                    boxShadow:
                      habit.colorKey === c
                        ? "0 0 0 2px var(--color-surface), 0 0 0 4px " + accentOf(c)
                        : "none",
                  }}
                />
              ))}
            </div>
          </div>

          {/* الوقت */}
          <label className="flex items-center justify-between">
            <span className="text-sm text-[--color-muted]">الوقت</span>
            <input
              type="time"
              value={habit.scheduledAt}
              onChange={(e) => setSchedule(habit.id, e.target.value)}
              className="tabular rounded-[--radius-sm] border border-[--color-hairline] bg-[--color-surface] px-3 py-1.5 text-[--color-ink] outline-none"
            />
          </label>

          {/* التكرار */}
          <FrequencyToggle
            frequency={habit.frequency}
            weekdays={habit.weekdays}
            onChange={(f, w) => setFrequency(habit.id, f, w)}
          />

          {/* حذف */}
          <button
            type="button"
            onClick={() => removeHabit(habit.id)}
            className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-[--color-danger-ink] transition-opacity hover:opacity-70"
          >
            <Icon name="trash" size={15} />
            حذف العادة
          </button>
        </div>
      )}
    </div>
  );
}
