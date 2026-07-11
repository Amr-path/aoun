// عون — أسئلة التشخيص (بيانات نقيّة، صالحة على العميل).
// صياغة أعمق وأكثر دفئاً لتنتج توصيةً أنسب وأقل سطحية.
import type { DiagnosticAnswers } from "./types";

export type QuestionId = keyof DiagnosticAnswers;
export type QuestionKind = "single" | "multi" | "time";

export interface QuestionOption {
  value: string;
  label: string;
  hint?: string;
  emoji: string;
}

export interface Question {
  id: QuestionId;
  kind: QuestionKind;
  title: string;
  subtitle: string;
  options?: QuestionOption[];
}

export const QUESTIONS: Question[] = [
  {
    id: "lifestyle",
    kind: "single",
    title: "كيف يبدو إيقاع يومك؟",
    subtitle: "لنفهم واقعك قبل أن نقترح أي شيء.",
    options: [
      { value: "student", label: "دراسة", hint: "أيامي حول المحاضرات والمذاكرة", emoji: "🎓" },
      { value: "employee", label: "وظيفة", hint: "دوامٌ ثابت أغلب الأسبوع", emoji: "💼" },
      { value: "freelancer", label: "عمل حرّ", hint: "أنا من يرتّب وقته", emoji: "🧑‍💻" },
      { value: "homemaker", label: "بيت وأسرة", hint: "يومي حول من أحب", emoji: "🏡" },
      { value: "other", label: "مرحلة انتقالية", hint: "أبحث عن نظامٍ جديد", emoji: "🌱" },
    ],
  },
  {
    id: "energyLevel",
    kind: "single",
    title: "كيف طاقتك هذه الأيام؟",
    subtitle: "سنبدأ من حيث أنت، لا من حيث «يجب» أن تكون.",
    options: [
      { value: "low", label: "منخفضة", hint: "أحتاج بداياتٍ لطيفة", emoji: "🌙" },
      { value: "medium", label: "متوسّطة", hint: "أقدر على القليل الثابت", emoji: "🌤️" },
      { value: "high", label: "عالية", hint: "مستعدّ لتحدٍّ حقيقي", emoji: "☀️" },
    ],
  },
  {
    id: "focusArea",
    kind: "multi",
    title: "ما الذي تودّ أن يعتني به عون معك؟",
    subtitle: "اختر ما يلامسك هذا العام (واحد أو أكثر).",
    options: [
      { value: "spiritual", label: "صفاءٌ داخلي", hint: "امتنانٌ وسكينةٌ وهدوء", emoji: "🕊️" },
      { value: "physical", label: "حيوية الجسد", hint: "حركةٌ وماءٌ وطاقة", emoji: "🌿" },
      { value: "mental", label: "صفاء الذهن", hint: "تركيزٌ وقراءةٌ وهدوء", emoji: "🧠" },
      { value: "sleep", label: "راحةٌ ونوم", hint: "ليلٌ هادئ ونهارٌ نشط", emoji: "😴" },
      { value: "social", label: "دفء العلاقات", hint: "قربٌ ممن تحبّ", emoji: "🤍" },
    ],
  },
  {
    id: "wakeTime",
    kind: "time",
    title: "متى يبدأ صباحك عادةً؟",
    subtitle: "لنوقّت عاداتك الأولى حول استيقاظك، بلا إزعاج.",
  },
  {
    id: "mainStruggle",
    kind: "single",
    title: "ما الذي يقطع استمرارك غالباً؟",
    subtitle: "لنراعيه بلطف في رحلتك.",
    options: [
      { value: "distraction", label: "التشتّت", hint: "أبدأ ثم يسحبني شيء", emoji: "🌀" },
      { value: "consistency", label: "الانقطاع", hint: "أحمس ثم أتوقّف", emoji: "📉" },
      { value: "time", label: "ضيق الوقت", hint: "يومي مزدحم", emoji: "⏳" },
      { value: "motivation", label: "فتور الحافز", hint: "أفقد الدافع بسرعة", emoji: "🪫" },
      { value: "overwhelm", label: "الإرهاق", hint: "الكثير يثقلني", emoji: "😮‍💨" },
    ],
  },
];

/** قيمة ابتدائية فارغة للإجابات. */
export const EMPTY_ANSWERS: DiagnosticAnswers = {
  lifestyle: "",
  energyLevel: "medium",
  focusArea: [],
  wakeTime: "06:30",
  mainStruggle: "",
};

/** هل السؤال مُجاب عليه (صالح للانتقال)؟ */
export function isAnswered(q: Question, a: DiagnosticAnswers): boolean {
  if (q.id === "focusArea") return a.focusArea.length > 0;
  if (q.id === "wakeTime") return /^\d{2}:\d{2}$/.test(a.wakeTime);
  const v = a[q.id];
  return typeof v === "string" && v.length > 0;
}
