// عون — ثوابت العلامة والمعرفة الأساسية
import type { ColorKey, Frequency, Weekday } from "./types";

/** هوية العلامة. */
export const BRAND = {
  name: "عون",
  tagline: "رفيقك للاستمرار.",
  philosophy: "توازنٌ وثبات، لا ازدحام",
  maxHabits: 7,
} as const;

/** قالب عادة افتراضية يُقترح في الـOnboarding. */
export interface HabitTemplate {
  key: string;
  title: string;
  emoji: string;
  frequency: Frequency;
  weekdays: Weekday[];
  scheduledAt: string;
  /** الخطوات الصغيرة — تبدأ دائماً بأصغر خطوة لا تُرفَض. */
  microSteps: string[];
  colorKey: ColorKey;
  /** مجالات التركيز التي تناسبها — يستخدمها محرك التوصية. */
  focus: string[];
  /** جملة هوية: «أنت من...» — تربط العادة بمن يريد المستخدم أن يصير. */
  identity?: string;
  /** ملاحظة اختيارية. */
  note?: string;
}

/**
 * مكتبة عادات مؤسِّسة عامّة يختار منها محرك التوصية 7 عادات متوازنة.
 * كل عادة: خطوة صغرى لا تُرفَض + جملة هوية تحفيزية.
 */
export const HABIT_LIBRARY: HabitTemplate[] = [
  {
    key: "gratitude",
    title: "تدوين الامتنان",
    emoji: "🙏",
    frequency: "daily",
    weekdays: [0, 1, 2, 3, 4, 5, 6],
    scheduledAt: "21:30",
    microSteps: ["استحضر لحظةً جميلة", "اكتب ثلاثة أشياء ممتنٌّ لها", "تنفّس بامتنان"],
    colorKey: "blush",
    focus: ["mental", "spiritual"],
    identity: "أنت من يرى الجميل فيقدّره.",
  },
  {
    key: "walk_30",
    title: "مشي 30 دقيقة",
    emoji: "🚶",
    frequency: "daily",
    weekdays: [0, 1, 2, 3, 4, 5, 6],
    scheduledAt: "17:30",
    microSteps: ["البس حذاءك واخرج", "امشِ خمس دقائق للبداية", "أكمِل بخطىً هادئة"],
    colorKey: "sage",
    focus: ["physical"],
    identity: "أنت من يعتني بجسده كل يوم.",
  },
  {
    key: "water_2l",
    title: "ترطيب الجسم",
    emoji: "💧",
    frequency: "daily",
    weekdays: [0, 1, 2, 3, 4, 5, 6],
    scheduledAt: "10:00",
    microSteps: ["اشرب كوباً الآن", "ضع قارورةً بجانبك", "ارشُف بانتظام حتى المساء"],
    colorKey: "sky",
    focus: ["physical"],
    identity: "أنت من يصون صحته بعادةٍ بسيطة.",
  },
  {
    key: "sleep_7",
    title: "نومٌ مبكّر ومنتظم",
    emoji: "😴",
    frequency: "daily",
    weekdays: [0, 1, 2, 3, 4, 5, 6],
    scheduledAt: "22:45",
    microSteps: ["أطفئ الشاشة قبل النوم بساعة", "خفّف الإضاءة", "نَم في الموعد نفسه"],
    colorKey: "sky",
    focus: ["sleep", "physical"],
    identity: "أنت من يبدأ غده من ليلته.",
  },
  {
    key: "deep_focus",
    title: "جلسة تركيز عميق",
    emoji: "🎯",
    frequency: "daily",
    weekdays: [0, 1, 2, 3, 4, 5, 6],
    scheduledAt: "09:00",
    microSteps: ["اختر مهمةً واحدة", "أبعِد الهاتف عنك", "امنحها 25 دقيقة بلا مقاطعة"],
    colorKey: "clay",
    focus: ["mental"],
    identity: "أنت من يُتقن عمله بحضورٍ كامل.",
  },
  {
    key: "read_book",
    title: "قراءة هادئة",
    emoji: "📚",
    frequency: "daily",
    weekdays: [0, 1, 2, 3, 4, 5, 6],
    scheduledAt: "21:00",
    microSteps: ["افتح كتابك", "اقرأ صفحةً واحدة", "دوّن فكرةً أعجبتك"],
    colorKey: "clay",
    focus: ["mental"],
    identity: "أنت قارئٌ يكبر بما يقرأ.",
  },
  {
    key: "move_body",
    title: "إطالة وتمرين خفيف",
    emoji: "🤸",
    frequency: "weekly",
    weekdays: [0, 2, 4],
    scheduledAt: "07:00",
    microSteps: ["افرش سجادتك", "أحمِ عضلاتك دقيقة", "أطِل جسمك بلطف"],
    colorKey: "sage",
    focus: ["physical"],
    identity: "أنت من يحرّك جسده فيشكره.",
  },
  {
    key: "no_phone_morning",
    title: "صباحٌ بلا هاتف",
    emoji: "🌤️",
    frequency: "daily",
    weekdays: [0, 1, 2, 3, 4, 5, 6],
    scheduledAt: "06:00",
    microSteps: ["لا تفتح الهاتف فور استيقاظك", "اشرب ماءً", "ابدأ يومك بنيّةٍ لا بإشعار"],
    colorKey: "amber",
    focus: ["mental"],
    identity: "أنت من يملك صباحه.",
  },
  {
    key: "connect",
    title: "تواصل مع من تحبّ",
    emoji: "🤍",
    frequency: "daily",
    weekdays: [0, 1, 2, 3, 4, 5, 6],
    scheduledAt: "19:30",
    microSteps: ["اختر شخصاً عزيزاً", "اطمئنّ عليه بصدق", "أنصت أكثر مما تتكلّم"],
    colorKey: "blush",
    focus: ["social"],
    identity: "أنت من يصل من يحبّ.",
  },
  {
    key: "sunlight",
    title: "دقائق تحت الشمس",
    emoji: "☀️",
    frequency: "daily",
    weekdays: [0, 1, 2, 3, 4, 5, 6],
    scheduledAt: "08:00",
    microSteps: ["اخرج إلى ضوء الصباح", "امكث خمس دقائق", "تنفّس بعمق"],
    colorKey: "amber",
    focus: ["physical", "mental"],
    identity: "أنت من يمنح جسده حقّه من النور.",
  },
  {
    key: "plan_day",
    title: "خطّط ليومك",
    emoji: "🗒️",
    frequency: "daily",
    weekdays: [0, 1, 2, 3, 4, 5, 6],
    scheduledAt: "08:30",
    microSteps: ["اكتب أهم ثلاث مهامّ", "رتّبها بالأولوية", "ابدأ بالأصعب"],
    colorKey: "clay",
    focus: ["mental"],
    identity: "أنت من يقود يومه لا يتبعه.",
  },
  {
    key: "learn",
    title: "تعلّم شيئاً جديداً",
    emoji: "🧠",
    frequency: "daily",
    weekdays: [0, 1, 2, 3, 4, 5, 6],
    scheduledAt: "20:00",
    microSteps: ["اختر موضوعاً يشغفك", "تعلّم خمس عشرة دقيقة", "لخّص ما فهمته"],
    colorKey: "sage",
    focus: ["mental"],
    identity: "أنت من ينمو كل يومٍ قليلاً.",
  },
];

/** الاختيار الافتراضي المتوازن: 7 عادات تغطّي الجسد والذهن والصفاء والنوم. */
export const DEFAULT_SEVEN_KEYS = [
  "no_phone_morning",
  "walk_30",
  "water_2l",
  "deep_focus",
  "read_book",
  "gratitude",
  "sleep_7",
] as const;

/** أسماء أيام الأسبوع بالعربية (0=الأحد). */
export const WEEKDAY_LABELS_AR = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
] as const;

export const WEEKDAY_SHORT_AR = ["ح", "ن", "ث", "ر", "خ", "ج", "س"] as const;

/** بيانات إثرائية لكل عادة: التصنيف و«لماذا تهمّ» (علميّ عام). */
export const HABIT_META: Record<string, { category: string; why: string }> = {
  gratitude: { category: "الصفاء", why: "تدوين الامتنان يرفع الرضا والمزاج الإيجابي." },
  walk_30: { category: "الجسد", why: "المشي اليومي يقوّي القلب والمزاج والطاقة." },
  water_2l: { category: "الجسد", why: "الترطيب الكافي يحسّن التركيز والطاقة." },
  sleep_7: { category: "النوم", why: "النوم المنتظم أساس الصحة والإنتاجية." },
  deep_focus: { category: "الإنتاجية", why: "جلسات التركيز العميق ترفع جودة إنجازك." },
  read_book: { category: "الذهن", why: "القراءة اليومية توسّع معرفتك وهدوءك." },
  move_body: { category: "الجسد", why: "الإطالة تقلّل الشدّ وتحسّن المرونة." },
  no_phone_morning: { category: "الذهن", why: "بدايةٌ بلا شاشة تحمي تركيزك ومزاجك." },
  connect: { category: "العلاقات", why: "التواصل الدافئ يعزّز السعادة والانتماء." },
  sunlight: { category: "الجسد", why: "ضوء الصباح يضبط ساعتك البيولوجية ونومك." },
  plan_day: { category: "الإنتاجية", why: "تخطيط اليوم يقلّل التشتّت ويرفع الإنجاز." },
  learn: { category: "الذهن", why: "التعلّم المستمر يبقي عقلك نشطاً ومتجدّداً." },
};

/** لوحة إيموجي مقترحة عند إنشاء/تعديل عادة. */
export const EMOJI_CHOICES = [
  "🙏", "🚶", "💧", "😴", "🎯", "📚", "🤸", "🌤️", "🤍", "🕊️",
  "✍️", "☀️", "🗒️", "🧠", "🌿", "🏃", "🥗", "🎧", "☕", "🧹",
  "⭐", "🌱", "💪", "🌊", "🎨", "🎸", "💰", "🌷", "🔥", "📵",
] as const;
