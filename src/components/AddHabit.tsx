"use client";
// عون — إضافة عادة: اختر من المكتبة (بحث + تصنيف + «لماذا تهمّ») أو أنشئ مخصّصة.
import { useMemo, useState } from "react";
import { useDashboard } from "@/store/dashboard";
import { EMOJI_CHOICES, HABIT_LIBRARY, HABIT_META } from "@/lib/constants";
import { COLOR_KEYS, type ColorKey } from "@/lib/types";
import { accentOf, accentSoftOf } from "@/lib/colors";
import type { OnboardingHabitInput } from "@/lib/habits";

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
        className="grid place-items-center rounded-[--radius-card] border-2 border-dashed border-[--color-hairline] p-6 text-[--color-muted] transition-colors hover:border-[--color-sage] hover:text-[--color-sage-ink]"
      >
        <span className="text-2xl">＋</span>
        <span className="mt-1 text-sm font-medium">أضف عادة</span>
      </button>
    );
  }

  return (
    <div className="card flex flex-col gap-3 p-4 sm:col-span-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[--color-ink]">أضف عادة</h3>
        <button
          type="button"
          onClick={() => {
            reset();
            setOpen(false);
          }}
          className="text-sm text-[--color-faint] hover:text-[--color-muted]"
        >
          إغلاق
        </button>
      </div>

      {!custom ? (
        <>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث عن عادة… (مثال: تركيز، نوم)"
            className="rounded-2xl border border-[--color-hairline] bg-[--color-surface] px-4 py-2.5 text-[--color-ink] outline-none placeholder:text-[--color-faint] focus:border-[--color-sage]"
          />
          <div className="flex max-h-72 flex-col gap-2 overflow-y-auto pe-1">
            {results.map((h) => {
              const meta = HABIT_META[h.key];
              return (
                <button
                  key={h.key}
                  type="button"
                  onClick={() => addFromLibrary(h.key)}
                  disabled={busy}
                  className="lift card flex items-center gap-3 p-3 text-start disabled:opacity-60"
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
                        <span className="pill bg-[--color-surface-2] px-2 py-0.5 text-[10px] text-[--color-muted]">
                          {meta.category}
                        </span>
                      )}
                    </span>
                    {meta && (
                      <span className="block truncate text-[11px] text-[--color-faint]">
                        {meta.why}
                      </span>
                    )}
                  </span>
                  <span className="text-lg text-[--color-sage-ink]">＋</span>
                </button>
              );
            })}
            {results.length === 0 && (
              <p className="py-4 text-center text-sm text-[--color-faint]">
                لا نتائج — جرّب عادةً مخصّصة.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setCustom(true)}
            className="self-start text-sm font-medium text-[--color-sage-ink] hover:underline"
          >
            أو أنشئ عادةً مخصّصة ←
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
              placeholder="اسم العادة…"
              className="flex-1 rounded-xl border border-[--color-hairline] bg-[--color-surface] px-3 py-2 text-[--color-ink] outline-none placeholder:text-[--color-faint] focus:border-[--color-sage]"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {EMOJI_CHOICES.slice(0, 18).map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={`grid h-8 w-8 place-items-center rounded-lg text-base transition-all active:scale-90 ${
                  emoji === e ? "bg-[--color-surface-3] ring-2 ring-[--color-sage]" : "bg-[--color-surface-2]"
                }`}
              >
                {e}
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
                  className="h-7 w-7 rounded-full transition-transform active:scale-90"
                  style={{
                    background: accentOf(c),
                    boxShadow: color === c ? "0 0 0 2px var(--color-surface), 0 0 0 4px " + accentOf(c) : "none",
                  }}
                />
              ))}
            </div>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="tabular rounded-lg border border-[--color-hairline] bg-[--color-surface] px-3 py-1.5 text-[--color-ink] outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={submitCustom}
              disabled={busy || !title.trim()}
              className="pill flex-1 py-2.5 font-semibold text-white transition-transform active:scale-95 disabled:opacity-50"
              style={{ background: "var(--color-sage)" }}
            >
              {busy ? "…يُضاف" : "إضافة"}
            </button>
            <button
              type="button"
              onClick={() => setCustom(false)}
              className="pill bg-[--color-surface-2] px-5 font-medium text-[--color-muted] transition-colors hover:bg-[--color-surface-3]"
            >
              رجوع
            </button>
          </div>
        </>
      )}
    </div>
  );
}
