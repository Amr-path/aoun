import { redirect } from "next/navigation";
import { getDashboard } from "@/lib/habits";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { seedOfDay } from "@/lib/messages";
import { recoveryMessage, whyFromDiagnostic } from "@/lib/narrative";
import DashboardClient from "@/components/DashboardClient";
import type { Daypart } from "@/components/BloomHero";

export const dynamic = "force-dynamic";
export const metadata = { title: "لوحة التحكم" };

function hourIn(tz: string): number {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "numeric",
      hourCycle: "h23",
    }).format(new Date())
  );
}

function greetingFor(tz: string): string {
  const h = hourIn(tz);
  if (h < 12) return "صباح الخير";
  if (h < 17) return "طاب يومك";
  return "مساء الخير";
}

/* وقت «سماء اليوم» — تتبدّل أجواء اللوحة معه. */
function daypartFor(tz: string): Daypart {
  const h = hourIn(tz);
  if (h < 5) return "night";
  if (h < 7) return "fajr";
  if (h < 12) return "morning";
  if (h < 16) return "noon";
  if (h < 19) return "sunset";
  return "night";
}

export default async function DashboardPage() {
  const userId = await requireUserId();
  const [data, user] = await Promise.all([
    getDashboard(userId),
    prisma.user.findUnique({
      where: { id: userId },
      select: { timezone: true, name: true, diagnostic: true, onboardedAt: true },
    }),
  ]);

  const u = user as {
    timezone?: string;
    name?: string | null;
    diagnostic?: string | null;
    onboardedAt?: Date | null;
  } | null;

  // مستخدمٌ بلا عادات ولم يُكمل التهيئة بعد → أرسله إلى الـonboarding بدل لوحةٍ فارغة.
  if (data.habits.length === 0 && !u?.onboardedAt) redirect("/onboarding");

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
      daypart={daypartFor(tz)}
      dateLabel={dateLabel}
      seed={seed}
      userName={name}
      recovery={recovery}
    />
  );
}
