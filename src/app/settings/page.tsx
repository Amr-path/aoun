// عون — صفحة الإعدادات.
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import SettingsClient from "@/components/SettingsClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "الإعدادات" };

export default async function SettingsPage() {
  const userId = await requireUserId();
  const user = (await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, timezone: true },
  })) as { name: string | null; email: string | null; timezone: string } | null;

  return (
    <SettingsClient
      initialName={user?.name ?? ""}
      email={user?.email ?? ""}
      initialTz={user?.timezone ?? "Asia/Riyadh"}
    />
  );
}
