// عون — صفحة «حصادي»: بطاقة قابلة للتصدير والمشاركة.
import { requireUserId } from "@/lib/auth";
import { getAnalytics } from "@/lib/analytics";
import { prisma } from "@/lib/db";
import HarvestClient from "@/components/HarvestClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "حصادي" };

export default async function HarvestPage() {
  const userId = await requireUserId();
  const [a, user] = await Promise.all([
    getAnalytics(userId),
    prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
  ]);
  const name = (user as { name?: string | null } | null)?.name ?? null;

  return (
    <HarvestClient
      name={name}
      currentStreak={a.currentStreak}
      bestStreak={a.bestStreak}
      activeDays={a.activeDays}
      totalCompletions={a.totalCompletions}
    />
  );
}
