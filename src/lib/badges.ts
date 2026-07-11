// عون — نظام الشارات: إنجازاتٌ تُفتح مع نموّ مداومتك (لغة نباتية متّسقة).

export interface BadgeStats {
  bestStreak: number;
  activeDays: number;
  perfectDays: number;
  totalCompletions: number;
}

export interface BadgeDef {
  key: string;
  label: string;
  desc: string;
  /** رمز نباتيّ يمثّل مرحلة النموّ. */
  icon: string;
  /** لكنة اللون. */
  colorKey: "sage" | "clay" | "lavender" | "sky" | "amber" | "blush";
  /** شرط الفتح. */
  earned: (s: BadgeStats) => boolean;
}

export const BADGES: BadgeDef[] = [
  {
    key: "seed",
    label: "أول بذرة",
    desc: "أتممتَ أوّل عادة",
    icon: "🌱",
    colorKey: "sage",
    earned: (s) => s.activeDays >= 1,
  },
  {
    key: "sprout",
    label: "برعم",
    desc: "٧ أيام مداومة",
    icon: "🌿",
    colorKey: "sage",
    earned: (s) => s.bestStreak >= 7,
  },
  {
    key: "plant",
    label: "نبتة راسخة",
    desc: "٣٠ يوم مداومة",
    icon: "🪴",
    colorKey: "sky",
    earned: (s) => s.bestStreak >= 30,
  },
  {
    key: "tree",
    label: "شجرة",
    desc: "١٠٠ يوم مداومة",
    icon: "🌳",
    colorKey: "clay",
    earned: (s) => s.bestStreak >= 100,
  },
  {
    key: "orchard",
    label: "بستان العام",
    desc: "٣٦٥ يوم مداومة",
    icon: "🌴",
    colorKey: "amber",
    earned: (s) => s.bestStreak >= 365,
  },
  {
    key: "perfect_week",
    label: "أسبوعٌ مثاليّ",
    desc: "٧ أيام مكتملة",
    icon: "⭐",
    colorKey: "amber",
    earned: (s) => s.perfectDays >= 7,
  },
  {
    key: "hundred",
    label: "مئة إتمام",
    desc: "١٠٠ عادة مُنجزة",
    icon: "💯",
    colorKey: "lavender",
    earned: (s) => s.totalCompletions >= 100,
  },
  {
    key: "devoted",
    label: "مواظِب",
    desc: "٥٠ يوماً نشطاً",
    icon: "🌸",
    colorKey: "blush",
    earned: (s) => s.activeDays >= 50,
  },
];

/** عدد الشارات المفتوحة. */
export function earnedCount(s: BadgeStats): number {
  return BADGES.filter((b) => b.earned(s)).length;
}
