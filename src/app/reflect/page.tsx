// عون — صفحة طقس المساء.
import { requireUserId } from "@/lib/auth";
import { getDashboard } from "@/lib/habits";
import { prisma } from "@/lib/db";
import { todayKey } from "@/lib/date";
import ReflectClient from "@/components/ReflectClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "طقس المساء" };

export default async function ReflectPage() {
  const userId = await requireUserId();
  const data = await getDashboard(userId);

  const user = (await prisma.user.findUnique({
    where: { id: userId },
    select: { timezone: true },
  })) as { timezone: string } | null;
  const date = todayKey(user?.timezone || "Asia/Riyadh");

  const existing = (await prisma.reflection.findUnique({
    where: { userId_date: { userId, date } },
    select: { mood: true, note: true },
  })) as { mood: number; note: string | null } | null;

  const done = data.habits.filter((h) => h.dueToday && h.completedToday).length;
  const due = data.habits.filter((h) => h.dueToday).length;

  return (
    <ReflectClient
      doneCount={done}
      dueCount={due}
      score={data.score.currentScore}
      initialMood={existing?.mood ?? null}
      initialNote={existing?.note ?? ""}
    />
  );
}
