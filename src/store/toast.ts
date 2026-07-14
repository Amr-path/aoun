// عون — متجر إشعارات لطيفة موحّد (Toast): يخدم الحفظ والأخطاء والحذف-مع-تراجع.
"use client";
import { create } from "zustand";

export type ToastKind = "success" | "error" | "info";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface Toast {
  id: number;
  message: string;
  kind: ToastKind;
  action?: ToastAction;
}

interface ToastState {
  toasts: Toast[];
  show: (
    message: string,
    opts?: { kind?: ToastKind; action?: ToastAction; duration?: number }
  ) => void;
  dismiss: (id: number) => void;
}

export const useToast = create<ToastState>((set, get) => ({
  toasts: [],
  show: (message, opts = {}) => {
    const id = Date.now() + Math.random();
    set((s) => ({
      toasts: [
        ...s.toasts,
        { id, message, kind: opts.kind ?? "success", action: opts.action },
      ],
    }));
    // مهلةٌ أطول عند وجود إجراء (تراجع) ليتمكّن المستخدم من الضغط.
    const duration = opts.duration ?? (opts.action ? 5000 : 2500);
    window.setTimeout(() => get().dismiss(id), duration);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
