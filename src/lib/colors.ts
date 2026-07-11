// عون — خرائط ألوان اللكنة (accent) — نقيّة وصالحة على العميل.
import type { ColorKey } from "./types";

export const ACCENT: Record<ColorKey, string> = {
  sage: "var(--color-sage)",
  teal: "var(--color-teal)",
  sky: "var(--color-sky)",
  lavender: "var(--color-lavender)",
  blush: "var(--color-blush)",
  clay: "var(--color-clay)",
  amber: "var(--color-amber)",
};

export const ACCENT_SOFT: Record<ColorKey, string> = {
  sage: "var(--color-sage-soft)",
  teal: "var(--color-teal-soft)",
  sky: "var(--color-sky-soft)",
  lavender: "var(--color-lavender-soft)",
  blush: "var(--color-blush-soft)",
  clay: "var(--color-clay-soft)",
  amber: "var(--color-amber-soft)",
};

export const ACCENT_INK: Record<ColorKey, string> = {
  sage: "var(--color-sage-ink)",
  teal: "var(--color-teal-ink)",
  sky: "var(--color-sky-ink)",
  lavender: "var(--color-lavender-ink)",
  blush: "var(--color-blush-ink)",
  clay: "var(--color-clay-ink)",
  amber: "var(--color-amber-ink)",
};

/** لون آمن افتراضي عند قيمة غير معروفة. */
export function accentOf(key: string): string {
  return ACCENT[key as ColorKey] ?? ACCENT.sage;
}
export function accentSoftOf(key: string): string {
  return ACCENT_SOFT[key as ColorKey] ?? ACCENT_SOFT.sage;
}
export function accentInkOf(key: string): string {
  return ACCENT_INK[key as ColorKey] ?? ACCENT_INK.sage;
}
