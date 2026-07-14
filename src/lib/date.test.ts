import { test } from "node:test";
import assert from "node:assert/strict";
import { todayKey, dateKeyOffset, weekdayOf, isDueOn, lastNDays } from "./date";

test("dateKeyOffset: إزاحة الأيام مع عبور الحدود", () => {
  assert.equal(dateKeyOffset("2026-07-14", 0), "2026-07-14");
  assert.equal(dateKeyOffset("2026-07-14", -1), "2026-07-13");
  assert.equal(dateKeyOffset("2026-07-14", 1), "2026-07-15");
  assert.equal(dateKeyOffset("2026-07-01", -1), "2026-06-30"); // عبور الشهر
  assert.equal(dateKeyOffset("2026-01-01", -1), "2025-12-31"); // عبور السنة
  assert.equal(dateKeyOffset("2024-02-28", 1), "2024-02-29"); // سنة كبيسة
});

test("weekdayOf: 0=الأحد .. 6=السبت", () => {
  assert.equal(weekdayOf("2026-07-14"), 2); // الثلاثاء
  assert.equal(weekdayOf("2026-07-12"), 0); // الأحد
});

test("isDueOn: اليومي مستحقٌّ دائماً", () => {
  assert.equal(isDueOn("daily", [], "2026-07-14"), true);
});

test("isDueOn: الأسبوعي حسب أيامه", () => {
  assert.equal(isDueOn("weekly", [2], "2026-07-14"), true); // الثلاثاء ضمن الأيام
  assert.equal(isDueOn("weekly", [1, 3], "2026-07-14"), false);
});

test("todayKey: صيغة YYYY-MM-DD بتوقيت المستخدم", () => {
  const k = todayKey("Asia/Riyadh", new Date("2026-07-14T00:00:00Z"));
  assert.match(k, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(k, "2026-07-14"); // منتصف ليل UTC + الرياض (+3) = نفس اليوم

  // قبيل منتصف ليل نيويورك يكون التاريخ ما زال اليوم السابق
  const ny = todayKey("America/New_York", new Date("2026-07-14T03:00:00Z"));
  assert.equal(ny, "2026-07-13");
});

test("lastNDays: تصاعدي شامل اليوم", () => {
  const days = lastNDays(3, "Asia/Riyadh");
  assert.equal(days.length, 3);
  assert.ok(days[0] < days[1] && days[1] < days[2]);
});
