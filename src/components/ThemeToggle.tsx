"use client";
// عون — مبدّل الوضع النهاري/الليلي (يُحفظ محلياً).
import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dusk">("light");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(current === "dusk" ? "dusk" : "light");
  }, []);

  const toggle = () => {
    const next = theme === "dusk" ? "light" : "dusk";
    setTheme(next);
    if (next === "dusk") document.documentElement.setAttribute("data-theme", "dusk");
    else document.documentElement.removeAttribute("data-theme");
    document.cookie = `aoun-theme=${next}; path=/; max-age=31536000; samesite=lax`;
  };

  const isDusk = theme === "dusk";

  return (
    <button
      type="button"
      onClick={toggle}
      className="press card flex w-full items-center justify-between p-4 text-start"
      aria-label="تبديل الوضع الليلي"
    >
      <span className="flex items-center gap-3">
        <span
          className="icon-chip h-11 w-11 text-[--color-accent-ink]"
          style={{ background: "var(--color-accent-soft)" }}
        >
          <Icon name={isDusk ? "moon" : "sun"} size={22} />
        </span>
        <span>
          <span className="block font-semibold text-[--color-ink]">المظهر</span>
          <span className="block text-xs text-[--color-muted]">
            {isDusk ? "الوضع الليلي مُفعّل" : "الوضع النهاري"}
          </span>
        </span>
      </span>
      <span
        aria-hidden
        className="flex items-center gap-1 rounded-[--radius-pill] bg-[--color-surface-2] p-1"
      >
        <span
          className={`grid h-8 w-9 place-items-center rounded-[--radius-pill] transition-colors ${
            isDusk ? "text-[--color-faint]" : "bg-[--color-accent-soft] text-[--color-accent-ink]"
          }`}
        >
          <Icon name="sun" size={18} />
        </span>
        <span
          className={`grid h-8 w-9 place-items-center rounded-[--radius-pill] transition-colors ${
            isDusk ? "bg-[--color-accent-soft] text-[--color-accent-ink]" : "text-[--color-faint]"
          }`}
        >
          <Icon name="moon" size={18} />
        </span>
      </span>
    </button>
  );
}
