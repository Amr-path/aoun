"use client";
// عون — شريط تنقّل سفليّ عائم: كبسولةٌ دائرية شفّافة متوازنة، أيقونة + تسمية لكل قسم.
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { type IconName } from "./ui/Icon";

const ITEMS: { href: string; label: string; icon: IconName }[] = [
  { href: "/dashboard", label: "اليوم", icon: "home" },
  { href: "/analytics", label: "رحلتك", icon: "garden" },
  { href: "/settings", label: "إعدادات", icon: "settings" },
];

function NavLink({ it, active }: { it: (typeof ITEMS)[number]; active: boolean }) {
  return (
    <Link
      href={it.href}
      aria-current={active ? "page" : undefined}
      className={`press relative flex flex-col items-center gap-1 rounded-[--radius-md] px-4 py-2 text-xs font-semibold transition-colors ${
        active ? "bg-[--color-accent-soft] text-[--color-accent-ink]" : "text-[--color-faint]"
      }`}
    >
      <Icon name={it.icon} size={21} />
      <span>{it.label}</span>
      {/* مؤشّر الحالة النشطة */}
      <span
        aria-hidden
        className={`absolute -bottom-0.5 h-1 w-1 rounded-full bg-[--color-accent] transition-opacity duration-300 ${
          active ? "opacity-100" : "opacity-0"
        }`}
      />
    </Link>
  );
}

export default function BottomNav() {
  const path = usePathname();
  const isActive = (href: string) =>
    path === href || (href !== "/dashboard" && path.startsWith(href));

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[max(0.7rem,env(safe-area-inset-bottom))]">
      <div className="glass flex items-center gap-1 rounded-[--radius-xl] border border-[--color-hairline-soft] p-1.5 shadow-[var(--shadow-lg)]">
        <NavLink it={ITEMS[0]} active={isActive(ITEMS[0].href)} />
        <NavLink it={ITEMS[1]} active={isActive(ITEMS[1].href)} />

        {/* زرّ الإضافة المركزيّ (FAB) — النمط المعياريّ لتطبيقات العادات. */}
        <Link
          href="/dashboard#add-habit"
          aria-label="إضافة عادة"
          className="press mx-0.5 grid h-12 w-12 shrink-0 place-items-center rounded-full text-white shadow-[var(--shadow-2)]"
          style={{ background: "var(--grad-cta)" }}
        >
          <Icon name="plus" size={24} strokeWidth={2.4} />
        </Link>

        <NavLink it={ITEMS[2]} active={isActive(ITEMS[2].href)} />
      </div>
    </nav>
  );
}
