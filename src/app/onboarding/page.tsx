// عون — صفحة الإعداد التفاعلي.
import { redirect } from "next/navigation";
import OnboardingClient from "@/components/onboarding/OnboardingClient";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "لنبدأ" };

export default async function OnboardingPage() {
  const userId = await requireUserId();

  // من أتمّ الإعداد لا يُعاد إليه — إعادة الإعداد تستبدل عاداته وتُربك سجلّه.
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { onboardedAt: true },
  });
  if (user?.onboardedAt) redirect("/dashboard");

  return <OnboardingClient />;
}
