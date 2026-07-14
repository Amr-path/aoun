"use client";
// عون — إدارة العادات (تُفتح من الإعدادات فقط): هنا وحدها تُعدَّل العادة أو تُحذف.
// الأصل في العادات الثبات — فأبعدنا أدوات التغيير عن لوحة الإنجاز اليومية.
import { useEffect, useState } from "react";
import { useDashboard } from "@/store/dashboard";
import { EMOJI_CHOICES } from "@/lib/constants";
import { COLOR_KEYS } from "@/lib/types";
import { accentOf, accentSoftOf } from "@/lib/colors";
import { ar } from "@/lib/numerals";
import Icon from "./ui/Icon";
import Spinner from "./ui/Spinner";
import FrequencyToggle from "./FrequencyToggle";

export default function HabitManager() {
  const habits = useDashboard((s) => s.habits);
  const loading = useDashboard((s) => s.loading);
  const refresh = useDashboard((s) => s.refresh);
  const setFrequency = useDashboard((s) => s.setFrequency);
  const setSchedule = useDashboard((s) => s.setSchedule);
  const patchHabit = useDashboard((s) => s.patchHabit);
  const removeHabit = useDashboard((s) => s.removeHabit);

  const [openId, setOpenId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [titleDraft, setTitleDraft] = useState("");

  useEffect(() => {
    refresh();
  }, [refresh]);

  const open = (id: string, title: string) => {
    setOpenId((cur) => (cur === id ? null : id));
    setConfirmId(null);
    setTitleDraft(title);
  };

  const commitTitle = (id: string, current: string) => {
    const t = titleDraft.trim();
    if (t && t !== current) patchHabit(id, { title: t });
    else setTitleDraft(current);
  };

  if (loading && habits.length === 0) {
    return (
      <div className="card grid place-items-center p-6 text-[--color-muted]">
        <Spinner />
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="card p-5 text-center text-sm leading-relaxed text-[--color-muted]">
        لا عادات بعد — أضِف أولى عاداتك من اللوحة الرئيسية.
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-2" aria-label="إدارة العادات">
      {habits.map((h) => {
        const soft = accentSoftOf(h.colorKey);
        const opened = openId === h.id;
        return (
          <div key={h.id} className="card overflow-hidden">
            {/* صفّ العادة */}
            <button
              type="button"
              onClick={() => open(h.id, h.title)}
              aria-expanded={opened}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-start"
            >
              <span className="icon-chip h-9 w-9 shrink-0 rounded-full text-base" style={{ background: soft }}>
                {h.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-semibold text-[--color-ink]">
                  {h.title}
                </span>
                <span className="tabular block text-xs text-[--color-muted]">
                  {ar(h.scheduledAt)} · {h.frequency === "daily" ? "يومي" : "أيام محدّدة"}
                  {h.streak > 0 ? ` · مداومة ${ar(h.streak)}` : ""}
                </span>
              </span>
              <Icon
                name="chevron"
                size={17}
                className={`shrink-0 text-[--color-faint] transition-transform duration-200 ${
                  opened ? "rotate-90" : "-rotate-90"
                }`}
              />
            </button>

            {/* لوحة التعديل */}
            {opened && (
              <div className="flex flex-col gap-4 border-t border-[--color-hairline-soft] px-3.5 pb-4 pt-3.5">
                {/* العنوان */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs text-[--color-muted]">العنوان</span>
                  <input
                    value={titleDraft}
                    onChange={(e) => setTitleDraft(e.target.value)}
                    onBlur={() => commitTitle(h.id, h.title)}
                    onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                    className="rounded-2xl border-0 bg-[--color-surface-2] px-3.5 py-2.5 text-[--color-ink] shadow-[inset_0_2px_3px_rgba(96,66,30,0.14)] outline-none transition-shadow focus:shadow-[inset_0_2px_3px_rgba(96,66,30,0.14),0_0_0_2.5px_var(--color-accent)]"
                  />
                </label>

                {/* الرمز */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-[--color-muted]">الرمز</span>
                  <div className="flex flex-wrap gap-1">
                    {EMOJI_CHOICES.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => patchHabit(h.id, { emoji: e })}
                        aria-label={`الرمز ${e}`}
                        aria-pressed={h.emoji === e}
                        className="grid h-11 w-11 place-items-center rounded-xl transition-transform active:scale-95"
                      >
                        <span
                          className={`grid h-9 w-9 place-items-center rounded-xl text-lg transition-all ${
                            h.emoji === e
                              ? "scale-105 bg-[--color-surface-2] ring-2 ring-[--color-accent]"
                              : "bg-[--color-surface-2] opacity-80 hover:opacity-100"
                          }`}
                        >
                          {e}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* اللون */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-[--color-muted]">اللون</span>
                  <div className="flex flex-wrap gap-1.5">
                    {COLOR_KEYS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        aria-label={`اللون ${c}`}
                        aria-pressed={h.colorKey === c}
                        onClick={() => patchHabit(h.id, { colorKey: c })}
                        className="grid h-11 w-11 place-items-center rounded-full transition-transform active:scale-95"
                      >
                        <span
                          className={`h-7 w-7 rounded-full transition-transform ${
                            h.colorKey === c ? "scale-110" : ""
                          }`}
                          style={{
                            background: accentOf(c),
                            boxShadow:
                              h.colorKey === c
                                ? `0 0 0 2.5px var(--color-surface), 0 0 0 5px ${accentOf(c)}`
                                : "inset 0 1.5px 0 rgba(255,255,255,.4)",
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* الوقت */}
                <label className="flex items-center justify-between">
                  <span className="text-sm text-[--color-muted]">وقت التذكير</span>
                  <input
                    type="time"
                    value={h.scheduledAt}
                    onChange={(e) => setSchedule(h.id, e.target.value)}
                    className="tabular rounded-2xl border-0 bg-[--color-surface-2] px-3.5 py-2 text-[--color-ink] shadow-[inset_0_2px_3px_rgba(96,66,30,0.14)] outline-none"
                  />
                </label>

                {/* التكرار */}
                <FrequencyToggle
                  frequency={h.frequency}
                  weekdays={h.weekdays}
                  onChange={(f, w) => setFrequency(h.id, f, w)}
                />

                {/* حذف — بتأكيدٍ يحمي سجلّ المداومة */}
                {confirmId !== h.id ? (
                  <button
                    type="button"
                    onClick={() => setConfirmId(h.id)}
                    className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-[--color-danger-ink] transition-opacity hover:opacity-70"
                  >
                    <Icon name="trash" size={15} />
                    حذف العادة
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center gap-2.5 self-start">
                    <span className="text-sm text-[--color-danger-ink]">
                      حذفٌ نهائيّ؟ يمسح سجلّ المداومة كاملاً.
                    </span>
                    <button
                      type="button"
                      onClick={() => removeHabit(h.id)}
                      className="press pill bg-[--color-danger] px-4 py-1.5 text-sm font-bold text-white shadow-[0_3px_0_0_var(--edge)]"
                    >
                      نعم، احذف
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmId(null)}
                      className="press pill bg-[--color-surface-2] px-4 py-1.5 text-sm font-medium text-[--color-muted]"
                    >
                      إلغاء
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
