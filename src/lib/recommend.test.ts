// عون — اختبارات محرك التوصية. تُشغَّل عبر: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { recommendHabits, personalizeTimes, addMinutes, scoreTemplate } from "./recommend";
import { HABIT_LIBRARY } from "./constants";
import type { DiagnosticAnswers } from "./types";

function answers(partial: Partial<DiagnosticAnswers>): DiagnosticAnswers {
  return {
    lifestyle: "طالب",
    energyLevel: "medium",
    focusArea: [],
    wakeTime: "06:00",
    mainStruggle: "التشتّت",
    ...partial,
  };
}

test("recommendHabits: يُرجع 7 دائماً بلا تكرار", () => {
  const out = recommendHabits(answers({ focusArea: ["mental"] }));
  assert.equal(out.length, 7);
  assert.equal(new Set(out.map((h) => h.key)).size, 7, "بلا تكرار");
});

test("recommendHabits: يغطّي المجالات المختارة", () => {
  const out = recommendHabits(answers({ focusArea: ["spiritual", "physical", "mental"] }));
  for (const area of ["spiritual", "physical", "mental"]) {
    assert.ok(
      out.some((h) => h.focus.includes(area)),
      `يجب أن يغطّي ${area}`
    );
  }
});

test("recommendHabits: الطاقة المنخفضة تفضّل العادات اللطيفة", () => {
  const low = recommendHabits(answers({ energyLevel: "low", focusArea: ["sleep"] }));
  assert.ok(low.some((h) => h.key === "sleep_7"));
});

test("scoreTemplate: التقاطع يرفع الدرجة", () => {
  const walk = HABIT_LIBRARY.find((h) => h.key === "walk_30")!;
  const withPhysical = scoreTemplate(walk, answers({ focusArea: ["physical"] }));
  const without = scoreTemplate(walk, answers({ focusArea: ["mental"] }));
  assert.ok(withPhysical > without);
});

test("addMinutes: حساب صحيح مع الالتفاف", () => {
  assert.equal(addMinutes("06:00", 20), "06:20");
  assert.equal(addMinutes("23:50", 20), "00:10");
  assert.equal(addMinutes("00:10", -20), "23:50");
});

test("personalizeTimes: يقدّم الصباحية لوقت الاستيقاظ", () => {
  const templates = HABIT_LIBRARY.filter((h) => h.key === "meditate");
  const out = personalizeTimes(templates, "05:30");
  assert.equal(out[0].scheduledAt, "05:50"); // 05:30 + 20د
  // لا يطال المكتبة الأصلية
  assert.equal(HABIT_LIBRARY.find((h) => h.key === "meditate")!.scheduledAt, "06:30");
});

test("personalizeTimes: وقت استيقاظ غير صالح يُبقي الأصل", () => {
  const templates = HABIT_LIBRARY.filter((h) => h.key === "meditate");
  const out = personalizeTimes(templates, "bad");
  assert.equal(out[0].scheduledAt, "06:30");
});
