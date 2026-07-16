"use client";
// عون — إدارة العادات (تُفتح من الإعدادات فقط): هنا وحدها تُعدَّل العادة أو تُحذف.
// الأصل في العادات الثبات — فأبعدنا أدوات التغيير عن لوحة الإنجاز اليومية.
import { useEffect, useState } from "react";
import { useDashboard } from "@/store/dashboard";
import { EMOJI_CHOICES } from "@/lib/constants";
import { COLOR_KEYS } from "@/lib/types";
import { accentOf, accentSoftOf } from "@/lib/colors";
import { ar } from "@/lib/numerals";
import { formatTime12 } from "@/lib/time";
import Icon from "./ui/Icon";
import Spinner from "./ui/Spinner";
import FrequencyToggle from "./FrequencyToggle";

// حقل iOS: إدراجٌ رماديّ هادئ بلا حدودٍ ولا ظلالٍ غائرة.
const FIELD_CLASS =
  "rounded-[10px] border-0 bg-[--color-surface-2] outline-none focus:ring-2 focus:ring-[--color-accent]";

export default function HabitManager() {
  const habits = useDashboard((s) => s.habits);
  const loading = useDashboard((s) => s.loading);
  const refresh = useDashboard((s) => s.refresh);
  const setFrequency = useDashboard((s) => s.setFrequency);
  const setSchedule = useDashboard((s) => s.setSchedule);
  const patchHabit = useDashboard((s) => s.patchHabit);
  const archiveHabit = useDashboard((s) => s.archiveHabit);
  const removeHabit = useDashboard((s) => s.removeHabit);

  const [openId, setOpenId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [titleDraft, setTitleDraft] = useState("");
  const [timeDraft, setTimeDraft] = useState("");

  useEffect(() => {
    refresh();
  }, [refresh]);

  const open = (id: string, title: string, scheduledAt: string) => {
    setOpenId((cur) => (cur === id ? null : id));
    setConfirmId(null);
    setTitleDraft(title);
    setTimeDraft(scheduledAt);
  };

  const commitTitle = (id: string, current: string) => {
    const t = titleDraft.trim();
    if (t && t !== current) patchHabit(id, { title: t });
    else setTitleDraft(current);
  };

  // يُثبَّت الوقت عند مغادرة الحقل فقط (لا PATCH مع كل ضغطة مفتاح).
  const commitTime = (id: string, current: string) => {
    if (timeDraft && timeDraft !== current) setSchedule(id, timeDraft);
    else setTimeDraft(current);
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
    <section
      className="card divide-y divide-[--color-hairline-soft] overflow-hidden"
      aria-label="إدارة العادات"
    >
      {habits.map((h) => {
        const soft = accentSoftOf(h.colorKey);
        const opened = openId === h.id;
        return (
          <div key={h.id}>
            {/* صفّ العادة — قائمة iOS مجمّعة */}
            <button
              type="button"
              onClick={() => open(h.id, h.title, h.scheduledAt)}
              aria-expanded={opened}
              className="flex w-full items-center gap-3 px-4 py-3 text-start transition-colors hover:bg-[--color-surface-2]"
            >
              <span
                className="icon-chip h-8 w-8 shrink-0 rounded-[8px] text-base"
                style={{ background: soft }}
              >
                {h.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-semibold text-[--color-ink]">
                  {h.title}
                </span>
                <span className="tabular block text-[13px] text-[--color-faint]">
                  {formatTime12(h.scheduledAt)} · {h.frequency === "daily" ? "يومي" : "أيام محدّدة"}
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

            {/* لوحة التعديل — تحت الصفّ داخل القسم نفسه، بفاصلٍ شعري */}
            {opened && (
              <div className="flex flex-col gap-4 border-t border-[--color-hairline-soft] px-4 pb-4 pt-3.5">
                {/* العنوان */}
                <label className="flex flex-col gap-1.5">
                  <span className="text-[13px] text-[--color-muted]">العنوان</span>
                  <input
                    value={titleDraft}
                    onChange={(e) => setTitleDraft(e.target.value)}
                    onBlur={() => commitTitle(h.id, h.title)}
                    onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                    className={`${FIELD_CLASS} px-3.5 py-2.5 text-[--color-ink]`}
                  />
                </label>

                {/* الرمز */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[13px] text-[--color-muted]">الرمز</span>
                  <div className="flex flex-wrap gap-1">
                    {EMOJI_CHOICES.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => patchHabit(h.id, { emoji: e })}
                        aria-label={`الرمز ${e}`}
                        aria-pressed={h.emoji === e}
                        className="grid h-11 w-11 place-items-center rounded-[10px] transition-transform active:scale-95"
                      >
                        <span
                          className={`grid h-9 w-9 place-items-center rounded-[10px] bg-[--color-surface-2] text-lg transition-all ${
                            h.emoji === e
                              ? "ring-2 ring-[--color-accent]"
                              : "opacity-80 hover:opacity-100"
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
                  <span className="text-[13px] text-[--color-muted]">اللون</span>
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
                                ? `0 0 0 2px var(--color-surface), 0 0 0 4px ${accentOf(c)}`
                                : "none",
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
                    value={timeDraft}
                    onChange={(e) => setTimeDraft(e.target.value)}
                    onBlur={() => commitTime(h.id, h.scheduledAt)}
                    onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                    className={`tabular ${FIELD_CLASS} px-3.5 py-2 text-[--color-ink]`}
                  />
                </label>

                {/* التذكير قبل الموعد */}
                <label className="flex items-center justify-between gap-3">
                  <span className="text-sm text-[--color-muted]">التذكير قبل الموعد</span>
                  <select
                    value={h.reminderOffsetMin ?? 0}
                    onChange={(e) =>
                      patchHabit(h.id, { reminderOffsetMin: Number(e.target.value) })
                    }
                    className={`${FIELD_CLASS} px-3.5 py-2 text-sm text-[--color-ink]`}
                  >
                    <option value={0}>بدون تذكير</option>
                    <option value={15}>١٥ دقيقة</option>
                    <option value={30}>٣٠ دقيقة</option>
                    <option value={60}>٦٠ دقيقة</option>
                  </select>
                </label>

                {/* التكرار */}
                <FrequencyToggle
                  frequency={h.frequency}
                  weekdays={h.weekdays}
                  onChange={(f, w) => setFrequency(h.id, f, w)}
                />

                {/* أرشفة (الخيار الأساسي الهادئ) — تُخفي العادة وتحفظ سجلّها كاملاً */}
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => archiveHabit(h.id)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[--color-muted] transition-colors hover:text-[--color-ink]"
                  >
                    <Icon name="moon" size={15} />
                    أرشفة
                  </button>

                  {/* حذفٌ نهائي — خيارٌ ثانوي أصغر خلف تأكيدٍ صريح */}
                  {confirmId !== h.id ? (
                    <button
                      type="button"
                      onClick={() => setConfirmId(h.id)}
                      className="inline-flex items-center gap-1 text-[13px] text-[--color-danger] transition-opacity hover:opacity-70"
                    >
                      <Icon name="trash" size={13} />
                      حذف نهائي
                    </button>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-sm text-[--color-danger-ink]">
                        حذفٌ نهائيّ لا رجعة فيه — يمسح العادة وسجلّ مداومتها كاملاً. الأرشفة تحفظ السجلّ.
                      </span>
                      <button
                        type="button"
                        onClick={() => removeHabit(h.id)}
                        className="press pill bg-[--color-danger] px-4 py-1.5 text-sm font-semibold text-white"
                      >
                        نعم، احذف نهائياً
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
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
