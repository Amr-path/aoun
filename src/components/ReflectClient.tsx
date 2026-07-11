"use client";
// عون — طقس المساء: مراجعةٌ لطيفة لليوم (مزاج + امتنان/نيّة).
import { useState } from "react";
import Link from "next/link";
import { ar } from "@/lib/numerals";

const MOODS = [
  { v: 1, e: "😔", l: "صعب" },
  { v: 2, e: "😐", l: "عادي" },
  { v: 3, e: "🙂", l: "جيّد" },
  { v: 4, e: "😊", l: "جميل" },
  { v: 5, e: "🤩", l: "رائع" },
];

interface Props {
  doneCount: number;
  dueCount: number;
  score: number;
  initialMood: number | null;
  initialNote: string;
}

export default function ReflectClient({
  doneCount,
  dueCount,
  score,
  initialMood,
  initialNote,
}: Props) {
  const [mood, setMood] = useState<number | null>(initialMood);
  const [note, setNote] = useState(initialNote);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const save = async () => {
    if (!mood || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, note }),
      });
      if (res.ok) setDone(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-md px-5 pb-24 pt-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-black text-[--color-ink]">
          طقس المساء 🌙
        </h1>
        <Link
          href="/dashboard"
          className="pill border border-[--color-border] bg-[--color-surface] px-4 py-2 text-sm font-medium text-[--color-ink] transition-colors hover:bg-[--color-surface-2]"
        >
          ← اللوحة
        </Link>
      </div>

      {done ? (
        <div className="card animate-cheer flex flex-col items-center gap-3 p-8 text-center">
          <span className="text-4xl">🌸</span>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-black text-[--color-ink]">
            دُوّنت مراجعتك
          </h2>
          <p className="text-sm text-[--color-muted]">نَم مرتاحاً — غدٌ صفحةٌ جديدة.</p>
          <Link
            href="/dashboard"
            className="pill mt-2 px-6 py-2.5 font-semibold text-white"
            style={{ background: "var(--color-sage)" }}
          >
            تمام
          </Link>
        </div>
      ) : (
        <>
          {/* ملخّص اليوم */}
          <div className="card mb-4 flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-[--color-muted]">أنجزتَ اليوم</p>
              <p className="tabular mt-0.5 text-lg font-bold text-[--color-ink]">
                {ar(doneCount)} من {ar(dueCount)}
              </p>
            </div>
            <div
              className="grid h-14 w-14 place-items-center rounded-full text-lg font-black"
              style={{ background: "var(--color-sage-soft)", color: "var(--color-sage-ink)" }}
            >
              {ar(score)}
            </div>
          </div>

          {/* المزاج */}
          <div className="card p-5">
            <h2 className="mb-4 font-semibold text-[--color-ink]">كيف كان يومك؟</h2>
            <div className="flex justify-between">
              {MOODS.map((m) => (
                <button
                  key={m.v}
                  type="button"
                  onClick={() => setMood(m.v)}
                  className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 transition-all active:scale-90 ${
                    mood === m.v ? "bg-[--color-sage-soft] ring-2 ring-[--color-sage]" : ""
                  }`}
                >
                  <span className="text-3xl">{m.e}</span>
                  <span className="text-[11px] text-[--color-muted]">{m.l}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ملاحظة */}
          <div className="card mt-4 p-5">
            <h2 className="mb-3 font-semibold text-[--color-ink]">
              ما الذي تفخر به، أو نيّتك للغد؟
            </h2>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="اكتب بضع كلمات… (اختياري)"
              className="w-full resize-none rounded-2xl border border-[--color-hairline] bg-[--color-surface] px-4 py-3 text-[--color-ink] outline-none placeholder:text-[--color-faint] focus:border-[--color-sage]"
            />
          </div>

          <button
            type="button"
            onClick={save}
            disabled={!mood || busy}
            className="pill mt-6 w-full py-3.5 text-center font-bold text-white transition-transform active:scale-95 disabled:opacity-50"
            style={{ background: "var(--color-sage)" }}
          >
            {busy ? "…" : "احفظ مراجعتي"}
          </button>
        </>
      )}
    </main>
  );
}
