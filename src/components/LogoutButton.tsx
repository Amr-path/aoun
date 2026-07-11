"use client";
// عون — زرّ تسجيل الخروج.
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const out = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };
  return (
    <button
      type="button"
      onClick={out}
      className="pill px-4 py-2 text-sm font-medium text-[--color-faint] transition-colors hover:text-[--color-clay-ink]"
    >
      خروج
    </button>
  );
}
