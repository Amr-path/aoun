import { test } from "node:test";
import assert from "node:assert/strict";
import { toMinutes, inWindow } from "./timewindow";

test("toMinutes", () => {
  assert.equal(toMinutes("00:00"), 0);
  assert.equal(toMinutes("08:30"), 510);
  assert.equal(toMinutes("23:59"), 1439);
});

test("inWindow: داخل النافذة", () => {
  assert.equal(inWindow(510, 510, 5), true); // عند الهدف بالضبط
  assert.equal(inWindow(514, 510, 5), true); // ضمن 5 دقائق
  assert.equal(inWindow(515, 510, 5), false); // على الحافة = خارج
  assert.equal(inWindow(509, 510, 5), false); // قبل الهدف
});

test("inWindow: الالتفاف حول منتصف الليل", () => {
  // هدف 23:58 (1438)، والآن بعده بدقائق قليلة بعد منتصف الليل
  assert.equal(inWindow(1, 1438, 5), true); // فرق 3 دقائق
  assert.equal(inWindow(2, 1438, 5), true); // فرق 4 دقائق
  assert.equal(inWindow(3, 1438, 5), false); // فرق 5 دقائق = الحافة (خارج)
});

test("inWindow: تطبيع الهدف السالب (sched - offset)", () => {
  // 00:10 - 30 دقيقة = -20 ≡ 23:40 (1420)
  assert.equal(inWindow(1420, -20, 5), true);
  assert.equal(inWindow(1419, -20, 5), false);
});
