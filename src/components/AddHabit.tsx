"use client";
// عون — إضافة عادة: اختر من المكتبة (بحث + تصنيف + «لماذا تهمّ») أو أنشئ مخصّصة.
import { useMemo, useState } from "react";
import { useDashboard } from "@/store/dashboard";
import { EMOJI_CHOICES, HABIT_LIBRARY, HABIT_META } from "@/lib/constants";
import { COLOR_KEYS, type ColorKey } from "@/lib/types";
import { accentOf, accentSoftOf } from "@/lib/colors";
import type { OnboardingHabitInput } from "@/lib/habits";
import Icon from "@/components/ui/Icon";
import Spinner from "@/components/ui/Spinner";

export default function AddHabit() {
  const addHabit = useDashboard((s) => s.addHabit);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState("");
  const [custom, setCustom] = useState(false);

  // custom fields
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("🌿");
  const [color, setColor] = useState<ColorKey>("sage");
  const [time, setTime] = useState("08:00");

  const results = useMemo(() => {
    const term = q.trim();
    return HABIT_LIBRARY.filter((h) => {
      if (!term) return true;
      const cat = HABIT_META[h.key]?.category ?? "";
      return h.title.includes(term) || cat.includes(term);
    });
  }, [q]);

  const reset = () => {
    setQ("");
    setCustom(false);
    setTitle("");
    setEmoji("🌿");
    setColor("sage");
    setTime("08:00");
  };

  const addInput = async (input: OnboardingHabitInput) => {
    if (busy) return;
    setBusy(true);
    const ok = await addHabit(input);
    setBusy(false);
    if (ok) {
      reset();
      setOpen(false);
    }
  };

  const addFromLibrary = (key: string) => {
    const t = HABIT_LIBRARY.find((h) => h.key === key)!;
    addInput({
      title: t.title,
      emoji: t.emoji,
      frequency: t.frequency,
      weekdays: t.weekdays,
      scheduledAt: t.scheduledAt,
      microSteps: t.microSteps,
      colorKey: t.colorKey,
    });
  };

  const submitCustom = () => {
    const t = title.trim();
    if (!t) return;
    addInput({
      title: t,
      emoji,
      frequency: "daily",
      weekdays: [0, 1, 2, 3, 4, 5, 6],
      scheduledAt: time,
      microSteps: [],
      colorKey: color,
    });
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="card press flex w-full items-center gap-3 p-3 text-start"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-[--color-accent-soft] text-[--color-accent-ink]">
          <Icon name="plus" size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold text-[--color-ink]">إضافة عادة</span>
          <span className="block text-xs text-[--color-faint]">ابدأها أصغرَ ممّا تظنّ</span>
        </span>
        <Icon name="chevron" size={14} className="shrink-0 text-[--color-faint]" />
      </button>
    );
  }

  return (
    <div className="card flex flex-col gap-3 rounded-[--radius-xl] p-4 sm:col-span-2">
      <div className="flex items-center justify-between">
        <h3 className="font-[family-name:var(--font-display)] font-semibold text-[--color-ink]">
          أضِف عادة
        </h3>
        <button
          type="button"
          onClick={() => {
            reset();
            setOpen(false);
          }}
          aria-label="إغلاق"
          className="press grid h-8 w-8 place-items-center rounded-full text-[--color-faint] transition-colors hover:bg-[--color-surface-2] hover:text-[--color-muted]"
        >
          <Icon name="close" size={18} />
        </button>
      </div>

      {!custom ? (
        <>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 start-3 grid place-items-center text-[--color-faint]">
              <Icon name="search" size={18} />
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث عن عادة: تركيز، نوم، قراءة…"
              className="w-full rounded-[10px] border-0 bg-[--color-surface-2] py-2.5 pe-4 ps-10 text-[--color-ink] outline-none placeholder:text-[--color-faint]"
            />
          </div>
          <div className="max-h-72 overflow-y-auto pe-1">
            <div className="flex flex-col divide-y divide-[--color-hairline-soft]">
              {results.map((h) => {
                const meta = HABIT_META[h.key];
                return (
                  <button
                    key={h.key}
                    type="button"
                    onClick={() => addFromLibrary(h.key)}
                    disabled={busy}
                    className="press flex items-center gap-3 py-2.5 text-start disabled:opacity-60"
                  >
                    <span
                      className="icon-chip h-10 w-10 shrink-0 text-xl"
                      style={{ background: accentSoftOf(h.colorKey) }}
                    >
                      {h.emoji}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate font-semibold text-[--color-ink]">
                          {h.title}
                        </span>
                        {meta && (
                          <span className="shrink-0 text-xs text-[--color-faint]">
                            {meta.category}
                          </span>
                        )}
                      </span>
                      {meta && (
                        <span className="block truncate text-xs text-[--color-faint]">
                          {meta.why}
                        </span>
                      )}
                    </span>
                    <span className="grid h-8 w-8 shrink-0 place-items-center text-[--color-accent]">
                      <Icon name="plus" size={20} />
                    </span>
                  </button>
                );
              })}
            </div>
            {results.length === 0 && (
              <p className="py-4 text-center text-sm text-[--color-faint]">
                لا نتائج بهذا الاسم — أنشئها عادةً مخصّصة.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setCustom(true)}
            className="inline-flex items-center gap-1 self-start text-sm font-medium text-[--color-accent-ink] hover:underline"
          >
            أو أنشئ عادتك بنفسك
            <Icon name="chevron" size={14} />
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <span
              className="icon-chip h-11 w-11 shrink-0 text-2xl"
              style={{ background: "var(--color-surface-2)" }}
            >
              {emoji}
            </span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitCustom()}
              autoFocus
              placeholder="سمِّ عادتك…"
              className="min-w-0 flex-1 rounded-[10px] border-0 bg-[--color-surface-2] px-3 py-2 text-[--color-ink] outline-none placeholder:text-[--color-faint]"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {EMOJI_CHOICES.slice(0, 18).map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                aria-label={`الرمز ${e}`}
                className="press grid h-11 w-11 place-items-center rounded-[--radius-xs] transition-transform active:scale-[0.97]"
              >
                <span
                  className={`grid h-8 w-8 place-items-center rounded-[--radius-xs] text-base transition-all ${
                    emoji === e
                      ? "scale-105 bg-[--color-surface-3] ring-2 ring-[--color-accent]"
                      : "bg-[--color-surface-2]"
                  }`}
                >
                  {e}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {COLOR_KEYS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`اللون ${c}`}
                  onClick={() => setColor(c)}
                  className="grid h-11 w-11 place-items-center rounded-full transition-transform active:scale-[0.97]"
                >
                  <span
                    className={`h-7 w-7 rounded-full transition-transform ${color === c ? "scale-110" : ""}`}
                    style={{
                      background: accentOf(c),
                      boxShadow:
                        color === c
                          ? "0 0 0 2px var(--color-surface), 0 0 0 4px " + accentOf(c)
                          : "none",
                    }}
                  />
                </button>
              ))}
            </div>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="tabular rounded-[10px] border-0 bg-[--color-surface-2] px-3 py-1.5 text-[--color-ink] outline-none"
            />
          </div>

          <button
            type="button"
            onClick={submitCustom}
            disabled={busy || !title.trim()}
            className="btn-clay press w-full py-3 font-semibold disabled:opacity-50"
          >
            {busy ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Spinner size={16} />
                تُضاف…
              </span>
            ) : (
              "إضافة"
            )}
          </button>
          <button
            type="button"
            onClick={() => setCustom(false)}
            className="press self-center py-1 text-sm font-medium text-[--color-muted]"
          >
            رجوع
          </button>
        </>
      )}
    </div>
  );
}
