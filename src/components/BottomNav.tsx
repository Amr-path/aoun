"use client";
// عون — شريط تبويبات سفليّ بروح iOS: مادةٌ زجاجية بعرض الشاشة وخطٌّ شعريّ علويّ.
// يُركَّب مرّةً واحدة في app/(app)/layout.tsx فيبقى حيّاً أثناء التنقّل.
import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import Icon, { type IconName } from "./ui/Icon";

const ITEMS: { href: string; label: string; icon: IconName }[] = [
  { href: "/dashboard", label: "اليوم", icon: "home" },
  { href: "/analytics", label: "رحلتك", icon: "garden" },
  { href: "/settings", label: "إعدادات", icon: "settings" },
];

// محتوى التبويب — داخل <Link> كي يقرأ useLinkStatus حالة الانتقال.
// نُضيء التبويب فور اللمس (active || pending) بدل انتظار ردّ الخادم: اللمسة
// تُجيب فوراً، والهيكل يظهر تحتها. التأخير 150ms يمنع وميضاً في الانتقالات السريعة.
function NavInner({ it, active }: { it: (typeof ITEMS)[number]; active: boolean }) {
  const { pending } = useLinkStatus();
  const lit = active || pending;

  return (
    <span
      className={`flex flex-col items-center gap-0.5 transition-colors duration-150 ${
        lit ? "text-[--color-accent]" : "text-[--color-faint]"
      } ${pending ? "animate-pulse [animation-delay:150ms]" : ""}`}
    >
      <Icon name={it.icon} size={24} />
      <span className="text-[10px] font-medium">{it.label}</span>
    </span>
  );
}

function NavLink({ it, active }: { it: (typeof ITEMS)[number]; active: boolean }) {
  return (
    <Link
      href={it.href}
      aria-current={active ? "page" : undefined}
      // 44px حدٌّ أدنى لمساحة اللمس (إرشادات الواجهة البشرية)
      className="press flex min-h-[44px] flex-1 items-center justify-center"
    >
      <NavInner it={it} active={active} />
    </Link>
  );
}

export default function BottomNav() {
  const path = usePathname();
  const isActive = (href: string) =>
    path === href || (href !== "/dashboard" && path.startsWith(href));

  return (
    <nav
      aria-label="التنقّل الرئيسي"
      className="glass fixed inset-x-0 bottom-0 z-40 border-t border-[--color-hairline-soft] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto flex max-w-lg items-center px-2 pt-1 pb-0.5">
        <NavLink it={ITEMS[0]} active={isActive(ITEMS[0].href)} />
        <NavLink it={ITEMS[1]} active={isActive(ITEMS[1].href)} />

        {/* زرّ الإضافة المركزيّ — دائرة النظام المعبّأة */}
        <div className="flex flex-1 justify-center">
          <Link
            href="/dashboard#add-habit"
            aria-label="إضافة عادة"
            className="press grid h-11 w-11 place-items-center rounded-full bg-[--color-accent] text-white"
          >
            <Icon name="plus" size={22} strokeWidth={2.4} />
          </Link>
        </div>

        <NavLink it={ITEMS[2]} active={isActive(ITEMS[2].href)} />
      </div>
    </nav>
  );
}
