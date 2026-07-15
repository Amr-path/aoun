// عون — تنسيق وقتٍ موحّد للعرض: ١٢ ساعة بأرقامٍ عربية ولاحقة ص/م
// (بدل ٢١:٣٠ الغريبة على جمهورنا). يُستخدم في البطاقات والإدارة والإشعارات.
import { ar } from "./numerals";

export function formatTime12(hhmm: string): string {
  const [hs, ms = "00"] = hhmm.split(":");
  const h24 = Number(hs);
  if (Number.isNaN(h24)) return ar(hhmm);
  const suffix = h24 >= 12 ? "م" : "ص";
  const h12 = h24 % 12 || 12;
  return `${ar(h12)}:${ar(ms)} ${suffix}`;
}
