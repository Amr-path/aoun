"use client";
// عون — مبدّل الوضع النهاري/الليلي (يُحفظ محلياً).
import { useEffect, useState } from "react";

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

  return (
    <button
      type="button"
      onClick={toggle}
      className="card flex w-full items-center justify-between p-4 text-start"
      aria-label="تبديل الوضع الليلي"
    >
      <span className="flex items-center gap-3">
        <span
          className="icon-chip h-11 w-11 text-xl"
          style={{ background: "var(--color-lavender-soft)" }}
        >
          {theme === "dusk" ? "🌙" : "☀️"}
        </span>
        <span>
          <span className="block font-semibold text-[--color-ink]">المظهر</span>
          <span className="block text-xs text-[--color-muted]">
            {theme === "dusk" ? "الوضع الليلي مُفعّل" : "الوضع النهاري"}
          </span>
        </span>
      </span>
      <span
        className="pill px-4 py-2 text-sm font-medium"
        style={{ background: "var(--color-surface-2)", color: "var(--color-ink)" }}
      >
        {theme === "dusk" ? "تحويل للنهاري" : "تحويل لليلي"}
      </span>
    </button>
  );
}
