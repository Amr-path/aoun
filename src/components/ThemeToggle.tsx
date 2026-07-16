"use client";
// عون — مبدّل الوضع النهاري/الليلي (يُحفظ محلياً).
import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";

// مفتاح iOS: مسارٌ 51×31 وإبهامٌ أبيض 27 بحركةٍ قصيرة.
function Switch({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      className={`relative block h-[31px] w-[51px] shrink-0 rounded-full transition-colors duration-200 ${
        on ? "bg-[--color-accent]" : "bg-[--color-surface-3]"
      }`}
    >
      <span
        className={`absolute top-[2px] block h-[27px] w-[27px] rounded-full bg-white shadow-[var(--shadow-1)] transition-all duration-200 ${
          on ? "start-[22px]" : "start-[2px]"
        }`}
      />
    </span>
  );
}

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
      role="switch"
      aria-checked={isDusk}
      onClick={toggle}
      className="press card flex w-full items-center justify-between gap-3 p-4 text-start"
      aria-label="تبديل الوضع الليلي"
    >
      <span className="flex min-w-0 items-center gap-3">
        <span
          className="icon-chip h-8 w-8 shrink-0 rounded-[8px] text-[--color-accent-ink]"
          style={{ background: "var(--color-accent-soft)" }}
        >
          <Icon name={isDusk ? "moon" : "sun"} size={17} />
        </span>
        <span className="min-w-0">
          <span className="block font-semibold text-[--color-ink]">الوضع الليلي</span>
          <span className="block text-[13px] text-[--color-muted]">
            {isDusk ? "مُفعّل — سكينةُ الغسق" : "متوقف — الوضع النهاري"}
          </span>
        </span>
      </span>
      <Switch on={isDusk} />
    </button>
  );
}
