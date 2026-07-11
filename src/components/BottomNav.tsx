"use client";
// عون — شريط تنقّل سفليّ عائم: كبسولةٌ صغيرة شفّافة، تُظهر التسمية للقسم النشط فقط.
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
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[max(0.6rem,env(safe-area-inset-bottom))]">
      <div className="glass flex items-center gap-1 rounded-full border border-[--color-hairline-soft] p-1 shadow-[var(--shadow-lg)]">
        {ITEMS.map((it) => {
          const active =
            path === it.href || (it.href !== "/dashboard" && path.startsWith(it.href));
          return (
            <Link
              key={it.href}
              href={it.href}
              aria-current={active ? "page" : undefined}
              aria-label={it.label}
              className={`press flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                active
                  ? "bg-[--color-accent-soft] text-[--color-accent-ink]"
                  : "text-[--color-faint]"
              }`}
            >
              <Icon name={it.icon} size={18} />
              {active && <span>{it.label}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
