// عون — متجر لوحة التحكم (Zustand) مع تحديثات تفاؤلية.
// يعتمد فقط على منطق نقيّ (scoring/date) ليبقى صالحاً على العميل.
"use client";
import { create } from "zustand";
import type { DashboardData, OnboardingHabitInput } from "@/lib/habits";
import type { HabitWithStatus, UserScore, Frequency, Weekday, ColorKey } from "@/lib/types";
import { computeDailyScore, xpForCompletion } from "@/lib/scoring";
import { useToast } from "./toast";
import {
  COMPLETION_QUOTES,
  isMilestone,
  milestoneMessage,
  contextualCompletion,
} from "@/lib/messages";

export interface Reward {
  id: number;
  xp: number;
  quote: string;
  colorKey: string;
  /** محطّة احتفال (7/30/100/365 يوماً) — احتفاء أرقى. */
  milestone: boolean;
}

interface DashboardState {
  dateKey: string;
  habits: HabitWithStatus[];
  score: UserScore;
  loading: boolean;
  reward: Reward | null;
  userName: string | null;
  setUserName: (name: string | null) => void;
  hydrate: (data: DashboardData) => void;
  refresh: () => Promise<void>;
  toggle: (habitId: string) => Promise<void>;
  setFrequency: (habitId: string, frequency: Frequency, weekdays: Weekday[]) => Promise<void>;
  setSchedule: (habitId: string, scheduledAt: string) => Promise<void>;
  patchHabit: (
    habitId: string,
    patch: { title?: string; emoji?: string; colorKey?: ColorKey }
  ) => Promise<void>;
  addHabit: (input: OnboardingHabitInput) => Promise<boolean>;
  removeHabit: (habitId: string) => Promise<void>;
  clearReward: () => void;
}

const EMPTY_SCORE: UserScore = {
  currentScore: 0,
  streakCount: 0,
  bestStreak: 0,
  totalXp: 0,
  lastScoredDate: null,
};

function recomputeScore(habits: HabitWithStatus[], prev: UserScore): UserScore {
  const due = habits.filter((h) => h.dueToday);
  const done = due.filter((h) => h.completedToday).length;
  return { ...prev, currentScore: computeDailyScore(due.length, done) };
}

export const useDashboard = create<DashboardState>((set, get) => {
  // مساعد موحّد يزيل تكرار «تفاؤلي → PATCH → مزامنة → تراجع» في تعديلات العادة.
  const mutateHabit = async (
    habitId: string,
    optimisticPatch: Partial<HabitWithStatus>,
    body: Record<string, unknown>,
    recompute = false
  ): Promise<void> => {
    const { habits, score } = get();
    const optimistic = habits.map((h) =>
      h.id === habitId ? { ...h, ...optimisticPatch } : h
    );
    set(
      recompute
        ? { habits: optimistic, score: recomputeScore(optimistic, score) }
        : { habits: optimistic }
    );
    try {
      const res = await fetch(`/api/habits/${habitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as DashboardData;
      set({ habits: data.habits, score: data.score });
    } catch {
      useToast.getState().show("تعذّر الحفظ — تراجعنا عن التغيير", { kind: "error" });
      set({ habits, score });
    }
  };

  return {
  dateKey: "",
  habits: [],
  score: EMPTY_SCORE,
  loading: true,
  reward: null,
  userName: null,

  setUserName: (name) => set({ userName: name }),

  hydrate: (data) =>
    set({
      dateKey: data.dateKey,
      habits: data.habits,
      score: data.score,
      loading: false,
    }),

  refresh: async () => {
    const res = await fetch("/api/dashboard", { cache: "no-store" });
    if (!res.ok) return;
    const data = (await res.json()) as DashboardData;
    get().hydrate(data);
  },

  toggle: async (habitId) => {
    const { habits, score, dateKey } = get();
    const target = habits.find((h) => h.id === habitId);
    if (!target) return;

    const next = !target.completedToday;

    // تحديث تفاؤلي فوري.
    const optimistic = habits.map((h) =>
      h.id === habitId
        ? {
            ...h,
            completedToday: next,
            streak: Math.max(0, h.streak + (next ? 1 : -1)),
          }
        : h
    );
    const optimisticScore = recomputeScore(optimistic, score);

    // نافذة مكافأة عند الإتمام فقط، مع احتفاء أرقى عند المحطات.
    const newStreak = target.streak + 1;
    const milestone = isMilestone(newStreak);
    const reward: Reward | null = next
      ? {
          id: Date.now(),
          xp: xpForCompletion(optimisticScore.streakCount),
          quote: milestone
            ? milestoneMessage(newStreak)!
            : Math.random() < 0.5
              ? contextualCompletion(get().userName, new Date().getHours())
              : COMPLETION_QUOTES[Math.floor(Math.random() * COMPLETION_QUOTES.length)],
          colorKey: target.colorKey,
          milestone,
        }
      : null;

    set({ habits: optimistic, score: optimisticScore, reward });

    try {
      const res = await fetch(`/api/habits/${habitId}/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: dateKey, completed: next }),
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as DashboardData;
      // مزامنة بالحقيقة الخادمية (تصحّح الـstreak والـXP بدقّة).
      set({ habits: data.habits, score: data.score });
    } catch {
      // تراجع عند الفشل.
      useToast.getState().show("تعذّر التحديث — تراجعنا", { kind: "error" });
      set({ habits, score });
    }
  },

  setFrequency: (habitId, frequency, weekdays) =>
    mutateHabit(habitId, { frequency, weekdays }, { frequency, weekdays }, true),

  setSchedule: (habitId, scheduledAt) =>
    mutateHabit(habitId, { scheduledAt }, { scheduledAt }),

  patchHabit: (habitId, patch) => mutateHabit(habitId, patch, patch),

  addHabit: async (input) => {
    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        useToast.getState().show("تعذّر إضافة العادة", { kind: "error" });
        return false;
      }
      const data = (await res.json()) as DashboardData;
      set({ habits: data.habits, score: data.score });
      return true;
    } catch {
      useToast.getState().show("تعذّر الاتصال", { kind: "error" });
      return false;
    }
  },

  removeHabit: async (habitId) => {
    const { habits, score } = get();
    const optimistic = habits.filter((h) => h.id !== habitId);
    set({ habits: optimistic, score: recomputeScore(optimistic, score) });

    try {
      const res = await fetch(`/api/habits/${habitId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as DashboardData;
      set({ habits: data.habits, score: data.score });
    } catch {
      useToast.getState().show("تعذّر الحفظ — تراجعنا عن التغيير", { kind: "error" });
      set({ habits, score });
    }
  },

  clearReward: () => set({ reward: null }),
  };
});
