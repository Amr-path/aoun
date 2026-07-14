// عون — عارض الإشعارات اللطيفة الموحّد (يُركّب مرّة في الجذر).
"use client";
import { useToast } from "@/store/toast";
import Icon from "./Icon";

export default function Toaster() {
  const toasts = useToast((s) => s.toasts);
  const dismiss = useToast((s) => s.dismiss);
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="animate-cheer pointer-events-auto flex max-w-[92vw] items-center gap-3 rounded-[--radius-pill] border border-[--color-hairline-soft] bg-[--color-surface] px-4 py-2.5 shadow-[var(--shadow-lg)]"
        >
          <Icon
            name={t.kind === "error" ? "close" : "check"}
            size={16}
            className={
              t.kind === "error"
                ? "shrink-0 text-[--color-danger-ink]"
                : "shrink-0 text-[--color-success-ink]"
            }
          />
          <span className="text-sm text-[--color-ink]">{t.message}</span>
          {t.action && (
            <button
              type="button"
              onClick={() => {
                t.action!.onClick();
                dismiss(t.id);
              }}
              className="shrink-0 text-sm font-bold text-[--color-accent-ink] hover:underline"
            >
              {t.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
