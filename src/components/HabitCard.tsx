"use client";
// عون — بطاقة العادة: سطرٌ مدمجٌ للإنجاز اليوميّ فقط.
// لا تعديلَ هنا — الأصل في العادات الثبات، واللوحة مكان الفعل لا العبث.
// إدارة العادات (تعديل/حذف) انتقلت إلى الإعدادات.
import { useState } from "react";
import type { HabitWithStatus } from "@/lib/types";
import { useDashboard } from "@/store/dashboard";
import { accentOf, accentSoftOf, accentInkOf } from "@/lib/colors";
import { streakStage } from "@/lib/messages";
import { ar } from "@/lib/numerals";
import { formatTime12 } from "@/lib/time";
import Icon from "./ui/Icon";

export default function HabitCard({ habit }: { habit: HabitWithStatus }) {
  const toggle = useDashboard((s) => s.toggle);
  const [burst, setBurst] = useState(false);
  const [open, setOpen] = useState(false);

  const accent = accentOf(habit.colorKey);
  const soft = accentSoftOf(habit.colorKey);
  const ink = accentInkOf(habit.colorKey);
  const done = habit.completedToday;
  const inactive = !habit.dueToday;
  const hasSteps = habit.microSteps.length > 0;

  // جسم البطاقة يُفتح ويُغلق بالنقر أو Enter/Space — دون مزاحمة زرّ الإتمام.
  const toggleSteps = () => {
    if (hasSteps) setOpen((v) => !v);
  };
  const onBodyKeyDown = (e: React.KeyboardEvent) => {
    if (!hasSteps) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((v) => !v);
    }
  };

  const onCheck = () => {
    if (!done) {
      setBurst(true);
      window.setTimeout(() => setBurst(false), 600);
    }
    toggle(habit.id);
  };

  return (
    <div
      className={`card relative px-3 py-2 ${inactive ? "opacity-55" : ""}`}
      style={done ? { background: soft } : undefined}
    >
      {/* شريطٌ جانبيّ عند الإتمام */}
      {done && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-3 start-1.5 w-1 rounded-full"
          style={{ background: accent }}
        />
      )}

      <div className="flex items-center gap-3">
        {/* رمز العادة داخل حلقة مداومةٍ تكتمل نحو ٣٠ يوماً */}
        <span className="relative grid h-10 w-10 shrink-0 place-items-center">
          {habit.streak > 0 && (
            <svg
              className="pointer-events-none absolute inset-0"
              width="40"
              height="40"
              viewBox="0 0 40 40"
              aria-hidden
            >
              <circle cx="20" cy="20" r="18" fill="none" stroke={accent} strokeOpacity="0.2" strokeWidth="2.5" />
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke={accent}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 18}
                strokeDashoffset={2 * Math.PI * 18 * (1 - Math.min(habit.streak / 30, 1))}
                transform="rotate(-90 20 20)"
                style={{ transition: "stroke-dashoffset 0.7s var(--ease-soft)" }}
              />
            </svg>
          )}
          <span
            className={`icon-chip h-8 w-8 rounded-full text-base ${done ? "animate-jelly" : ""}`}
            style={{ background: done ? "var(--color-surface)" : soft }}
          >
            {habit.emoji}
          </span>
        </span>

        {/* العنوان وسطرُ معلوماتٍ واحد — قابلٌ للنقر لكشف الخطوات الصغرى */}
        <div
          className={`min-w-0 flex-1 ${hasSteps ? "cursor-pointer select-none" : ""}`}
          {...(hasSteps
            ? {
                role: "button",
                tabIndex: 0,
                "aria-expanded": open,
                "aria-label": open ? "إخفاء الخطوات الصغرى" : "إظهار الخطوات الصغرى",
                onClick: toggleSteps,
                onKeyDown: onBodyKeyDown,
              }
            : {})}
        >
          <h3
            className={`truncate text-[15px] font-semibold leading-snug text-[--color-ink] ${done ? "done-title" : ""}`}
          >
            {habit.title}
          </h3>
          <div className="mt-px flex items-center gap-1.5 text-xs text-[--color-muted]">
            {hasSteps && (
              <Icon
                name="chevron"
                size={11}
                className="shrink-0 text-[--color-faint] transition-transform duration-200"
                style={{ transform: open ? "rotate(-90deg)" : undefined }}
              />
            )}
            <span className="tabular inline-flex items-center gap-1">
              <Icon name="clock" size={11} className="text-[--color-faint]" />
              {formatTime12(habit.scheduledAt)}
            </span>
            <span aria-hidden>·</span>
            <span>{habit.frequency === "daily" ? "يومي" : "أيام محدّدة"}</span>
            {habit.streak > 0 && (
              <span
                className="streak inline-flex items-center gap-1 rounded-full px-2 py-px text-xs font-bold"
                style={
                  habit.streak >= 7
                    ? {
                        background: "var(--grad-sunrise)",
                        color: "var(--color-amber-ink)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,.5)",
                      }
                    : { background: soft, color: ink, boxShadow: "inset 0 1px 0 rgba(255,255,255,.5)" }
                }
                title={`مداومة ${streakStage(habit.streak).label}`}
              >
                <Icon name="leaf" size={11} />
                {ar(habit.streak)}
              </span>
            )}
          </div>
        </div>

        {/* زرّ الإتمام الطيني — هدف لمس ≥44px */}
        <button
          type="button"
          onClick={onCheck}
          aria-pressed={done}
          aria-label={done ? "إلغاء الإتمام" : "تحديد كمُنجز"}
          className="group grid h-11 w-11 shrink-0 place-items-center rounded-full"
        >
          <span
            className={`relative grid h-7 w-7 place-items-center rounded-full transition-transform group-active:translate-y-[2px] ${
              done ? "animate-pop" : ""
            }`}
            style={{
              background: done ? accent : "var(--color-surface)",
              color: done ? "#fff" : accent,
              boxShadow: done
                ? "inset 0 1.5px 0 rgba(255,255,255,.35), 0 3px 0 0 var(--edge)"
                : "inset 0 1.5px 0 rgba(255,255,255,.85), 0 3px 0 0 var(--edge)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M20 6 9 17l-5-5"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={
                  done
                    ? "[stroke-dashoffset:0]"
                    : "[stroke-dashoffset:26] group-hover:[stroke-dashoffset:0]"
                }
                style={{
                  strokeDasharray: 26,
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
          </span>
        </button>
      </div>

      {/* الخطوات الصغرى — حباتٌ غائرة تظهر عند بسط البطاقة */}
      {hasSteps && open && (
        <div className="animate-rise flex flex-wrap gap-1.5 px-1 pb-1.5 pt-2">
          {habit.microSteps.map((step) => (
            <span
              key={step}
              className="rounded-full bg-[--color-surface-2] px-2.5 py-1 text-xs leading-relaxed text-[--color-muted]"
              style={{ boxShadow: "inset 0 2px 3px rgba(96, 66, 30, .12)" }}
            >
              {step}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
