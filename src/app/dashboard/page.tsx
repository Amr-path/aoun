import { getDashboard } from "@/lib/habits";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { seedOfDay } from "@/lib/messages";
import { recoveryMessage, whyFromDiagnostic } from "@/lib/narrative";
import DashboardClient from "@/components/DashboardClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "لوحة التحكم" };

function greetingFor(tz: string): string {
  const h = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "numeric",
      hourCycle: "h23",
    }).format(new Date())
  );
  if (h < 12) return "صباح الخير";
  if (h < 17) return "طاب يومك";
  return "مساء الخير";
}

export default async function DashboardPage() {
  const userId = await requireUserId();
  const [data, user] = await Promise.all([
    getDashboard(userId),
    prisma.user.findUnique({
      where: { id: userId },
      select: { timezone: true, name: true, diagnostic: true },
    }),
  ]);

  const u = user as {
    timezone?: string;
    name?: string | null;
    diagnostic?: string | null;
  } | null;
  const tz = u?.timezone || "Asia/Riyadh";
  const name = u?.name ?? null;

  // رسالة تعافٍ عند العودة بعد انقطاع (انكسرت السلسلة بعد مداومةٍ سابقة).
  const recovery =
    data.score.streakCount === 0 && data.score.bestStreak >= 3
      ? recoveryMessage(
          data.score.bestStreak,
          name,
          whyFromDiagnostic(u?.diagnostic ?? null)
        )
      : null;
  const greeting = greetingFor(tz);
  const dateLabel = new Intl.DateTimeFormat("ar", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: tz,
  }).format(new Date());
  const seed = seedOfDay();

  return (
    <DashboardClient
      initial={data}
      greeting={greeting}
      dateLabel={dateLabel}
      seed={seed}
      userName={name}
      recovery={recovery}
    />
  );
}
