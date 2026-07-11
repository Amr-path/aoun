// عون — خرائط ألوان اللكنة (accent) — نقيّة وصالحة على العميل.
import type { ColorKey } from "./types";

export const ACCENT: Record<ColorKey, string> = {
  sage: "var(--color-sage)",
  clay: "var(--color-clay)",
  lavender: "var(--color-lavender)",
  sky: "var(--color-sky)",
  amber: "var(--color-amber)",
  blush: "var(--color-blush)",
};

export const ACCENT_SOFT: Record<ColorKey, string> = {
  sage: "var(--color-sage-soft)",
  clay: "var(--color-clay-soft)",
  lavender: "var(--color-lavender-soft)",
  sky: "var(--color-sky-soft)",
  amber: "var(--color-amber-soft)",
  blush: "var(--color-blush-soft)",
};

export const ACCENT_INK: Record<ColorKey, string> = {
  sage: "var(--color-sage-ink)",
  clay: "var(--color-clay-ink)",
  lavender: "var(--color-lavender-ink)",
  sky: "var(--color-sky-ink)",
  amber: "var(--color-amber-ink)",
  blush: "var(--color-blush-ink)",
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
