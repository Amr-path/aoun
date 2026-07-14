// عون — منطق نافذة التذكيرات النقيّ (بلا server-only/Prisma) ليكون قابلاً للاختبار.

/** يحوّل "HH:mm" إلى دقائق منذ منتصف الليل. */
export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

/** هل «الآن» ضمن نافذة [target, target+window) مع الالتفاف حول منتصف الليل؟ */
export function inWindow(now: number, target: number, windowMin: number): boolean {
  const t = ((target % 1440) + 1440) % 1440;
  let diff = now - t;
  if (diff < 0) diff += 1440;
  return diff < windowMin;
}
