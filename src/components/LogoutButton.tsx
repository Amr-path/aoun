"use client";
// عون — زرّ تسجيل الخروج.
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";

export default function LogoutButton() {
  const router = useRouter();
  const out = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    // امسح كاش الصفحات المصادَقة (خصوصية الأجهزة المشتركة).
    if (typeof navigator !== "undefined") {
      navigator.serviceWorker?.controller?.postMessage({ type: "clear-cache" });
    }
    router.push("/login");
    router.refresh();
  };
  return (
    <button
      type="button"
      onClick={out}
      className="press pill inline-flex items-center gap-2 border border-[--color-hairline] bg-[--color-surface] px-5 py-2.5 text-sm font-semibold text-[--color-danger-ink] transition-colors hover:bg-[--color-danger-soft]"
    >
      <Icon name="logout" size={18} />
      خروج
    </button>
  );
}
