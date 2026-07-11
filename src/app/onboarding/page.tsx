// عون — صفحة الإعداد التفاعلي.
import OnboardingClient from "@/components/onboarding/OnboardingClient";
import { requireUserId } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "لنبدأ" };

export default async function OnboardingPage() {
  await requireUserId();
  return <OnboardingClient />;
}
