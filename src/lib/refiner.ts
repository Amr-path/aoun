// عون — طبقة خدمة تنقيح العادات المخصّصة عبر LLM.
// محوِّل قابل للتبديل: "mock" (استدلال محلّي بلا خادم) أو "http" (خادم/LLM حقيقي).
// يُضبط عبر متغيّرات البيئة HABIT_REFINER_* دون تغيير المُستهلِكين.
import "server-only";
import { COLOR_KEYS } from "./types";
import type { RefineHabitRequest, RefineHabitResponse, ColorKey, Weekday } from "./types";

const ALL_DAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6];

/** نقطة الدخول الموحّدة: تختار المحوّل بحسب البيئة. */
export async function refineHabit(
  req: RefineHabitRequest
): Promise<RefineHabitResponse> {
  const provider = process.env.HABIT_REFINER_PROVIDER ?? "mock";
  if (provider === "http") {
    try {
      return await refineViaHttp(req);
    } catch (err) {
      console.error("refiner http fallback → mock", err);
      return refineViaMock(req); // تراجع آمن حتى لا تنكسر التجربة
    }
  }
  return refineViaMock(req);
}

// ─── المحوّل الحقيقي (خادم/LLM) ────────────────────────────────
async function refineViaHttp(req: RefineHabitRequest): Promise<RefineHabitResponse> {
  const url = process.env.HABIT_REFINER_API_URL;
  if (!url) throw new Error("HABIT_REFINER_API_URL غير مضبوط");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.HABIT_REFINER_API_KEY
        ? { Authorization: `Bearer ${process.env.HABIT_REFINER_API_KEY}` }
        : {}),
    },
    body: JSON.stringify({
      task: "refine_habit",
      instruction:
        "حوّل النص الخام إلى عادة قابلة للتنفيذ: عنوان مختصر، خطوات صغيرة، أوقات مناسبة. أعِد JSON فقط.",
      input: req,
    }),
  });
  if (!res.ok) throw new Error(`refiner http ${res.status}`);

  const raw = (await res.json()) as Partial<RefineHabitResponse>;
  return normalize(raw, req.rawText);
}

// ─── المحوّل المحلّي (استدلال بالكلمات المفتاحية) ───────────────
interface Rule {
  match: RegExp;
  emoji: string;
  color: ColorKey;
  times: string[];
  steps: (title: string) => string[];
}

const RULES: Rule[] = [
  {
    match: /(ماء|أشرب|ترطيب|water)/i,
    emoji: "💧",
    color: "sky",
    times: ["10:00", "15:00"],
    steps: () => ["املأ قارورتك", "اشرب قبل الظهر", "أعد الملء للمساء"],
  },
  {
    match: /(مشي|جري|رياض|تمرين|جيم|walk|run|gym)/i,
    emoji: "🏃",
    color: "sage",
    times: ["17:30"],
    steps: (t) => ["جهّز ملابسك", "ابدأ بإحماء قصير", `أكمل ${t}`],
  },
  {
    match: /(قراءة|كتاب|أقرأ|read)/i,
    emoji: "📖",
    color: "clay",
    times: ["21:30"],
    steps: () => ["اختر مكاناً هادئاً", "اقرأ صفحة للبداية", "أكمل هدفك اليومي"],
  },
  {
    match: /(تأمل|تنفّس|تنفس|استرخاء|سكينة|هدوء|صفاء|meditat|breath|calm|yoga|يوغا)/i,
    emoji: "🧘",
    color: "lavender",
    times: ["06:30"],
    steps: () => ["اجلس بهدوء", "تنفّس بعمق", "أطلِق توتّرك برفق"],
  },
  {
    match: /(نوم|أنام|sleep)/i,
    emoji: "😴",
    color: "sky",
    times: ["23:00"],
    steps: () => ["أطفئ الشاشات", "خفّف الإضاءة", "استلقِ في موعد ثابت"],
  },
  {
    match: /(تركيز|مذاكرة|عمل|إنتاج|focus|deep work)/i,
    emoji: "🎯",
    color: "clay",
    times: ["09:00"],
    steps: () => ["أغلق المشتّتات", "شغّل مؤقّت 25 دقيقة", "مهمة واحدة فقط"],
  },
  {
    match: /(امتنان|شكر|تأمل|تنفس|gratitude|meditat)/i,
    emoji: "🕊️",
    color: "blush",
    times: ["22:00"],
    steps: () => ["اجلس بهدوء", "تنفّس بعمق", "دوّن ما تشكر عليه"],
  },
];

function refineViaMock(req: RefineHabitRequest): RefineHabitResponse {
  const text = req.rawText.trim();
  const rule = RULES.find((r) => r.match.test(text));

  const title = cleanTitle(text);
  const emoji = rule?.emoji ?? "✨";
  const color = rule?.color ?? "sage";
  const suggestedTimes = adjustTimes(rule?.times ?? ["08:00"], req.context?.wakeTime);
  const microSteps = (rule?.steps ?? defaultSteps)(title);

  return {
    title,
    emoji,
    microSteps,
    suggestedTimes,
    frequency: "daily",
    weekdays: ALL_DAYS,
    colorKey: color,
  };
}

function defaultSteps(title: string): string[] {
  return ["حدّد بداية صغيرة جداً", `خصّص وقتاً ثابتاً لـ${title}`, "احتفل بإتمامها"];
}

/** ينظّف النص إلى عنوان مختصر قابل للتنفيذ. */
function cleanTitle(text: string): string {
  const trimmed = text.replace(/\s+/g, " ").trim();
  const short = trimmed.length > 40 ? trimmed.slice(0, 40).trim() + "…" : trimmed;
  return short || "عادة جديدة";
}

/** إن توفّر وقت الاستيقاظ، يقدّم الأوقات الصباحية جداً إليه. */
function adjustTimes(times: string[], wakeTime?: string): string[] {
  if (!wakeTime || !/^\d{2}:\d{2}$/.test(wakeTime)) return times;
  return times.map((t) => (t < "07:00" ? wakeTime : t));
}

/** يوحّد استجابة الخادم الجزئية إلى الشكل الكامل مع قيم افتراضية آمنة. */
function normalize(raw: Partial<RefineHabitResponse>, fallbackText: string): RefineHabitResponse {
  return {
    title: raw.title?.trim() || cleanTitle(fallbackText),
    emoji: raw.emoji || "✨",
    microSteps:
      Array.isArray(raw.microSteps) && raw.microSteps.length
        ? raw.microSteps.slice(0, 5)
        : defaultSteps(cleanTitle(fallbackText)),
    suggestedTimes:
      Array.isArray(raw.suggestedTimes) && raw.suggestedTimes.length
        ? raw.suggestedTimes.slice(0, 3)
        : ["08:00"],
    frequency: raw.frequency === "weekly" ? "weekly" : "daily",
    weekdays: Array.isArray(raw.weekdays) && raw.weekdays.length ? raw.weekdays : ALL_DAYS,
    colorKey: COLOR_KEYS.includes(raw.colorKey as ColorKey)
      ? (raw.colorKey as ColorKey)
      : "sage",
  };
}
