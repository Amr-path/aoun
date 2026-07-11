"use client";
// عون — شريط التنقّل السفليّ العائم (زجاجيّ). ثلاثة أقسام فقط: اليوم/رحلتك/إعدادات.
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { type IconName } from "./ui/Icon";

const ITEMS: { href: string; label: string; icon: IconName }[] = [
  { href: "/dashboard", label: "اليوم", icon: "home" },
  { href: "/analytics", label: "رحلتك", icon: "garden" },
  { href: "/settings", label: "إعدادات", icon: "settings" },
];

export default function BottomNav() {
  const path = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="glass flex w-full max-w-md items-center justify-around rounded-[--radius-xl] border border-[--color-hairline-soft] p-1.5 shadow-[var(--shadow-lg)]">
        {ITEMS.map((it) => {
          const active =
            path === it.href || (it.href !== "/dashboard" && path.startsWith(it.href));
          return (
            <Link
              key={it.href}
              href={it.href}
              aria-current={active ? "page" : undefined}
              className="press flex flex-1 flex-col items-center gap-1 py-1.5"
            >
              <span
                className={`grid h-8 w-11 place-items-center rounded-full transition-colors ${
                  active
                    ? "bg-[--color-accent-soft] text-[--color-accent-ink]"
                    : "text-[--color-faint]"
                }`}
              >
                <Icon name={it.icon} size={21} />
              </span>
              <span
                className={`text-[11px] font-semibold ${
                  active ? "text-[--color-accent-ink]" : "text-[--color-faint]"
                }`}
              >
                {it.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
