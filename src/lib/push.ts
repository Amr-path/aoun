// عون — طبقة إرسال إشعارات Web Push (VAPID) من الخادم.
import "server-only";
import webpush from "web-push";
import { prisma } from "./db";

let configured = false;

/** يهيّئ مفاتيح VAPID مرّة واحدة. */
function configure(): boolean {
  if (configured) return true;
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) {
    console.error("مفاتيح VAPID غير مضبوطة — شغّل: npm run vapid");
    return false;
  }
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || "mailto:admin@aoun.app", pub, priv);
  configured = true;
  return true;
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

export type PushSub = { endpoint: string; p256dh: string; auth: string };

/** يجلب اشتراكات أجهزة المستخدم (مرّة واحدة، لتفادي N+1 داخل حلقات الإرسال). */
export async function getUserPushSubs(userId: string): Promise<PushSub[]> {
  return (await prisma.pushSubscription.findMany({
    where: { userId },
    select: { endpoint: true, p256dh: true, auth: true },
  })) as PushSub[];
}

/** يرسل إشعاراً لمجموعة اشتراكاتٍ مُجهّزة مسبقاً، ويحذف المنتهية. */
export async function sendPushToSubs(
  subs: PushSub[],
  payload: PushPayload
): Promise<number> {
  if (!configure() || subs.length === 0) return 0;

  let sent = 0;
  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          JSON.stringify(payload)
        );
        sent++;
      } catch (err) {
        const code = (err as { statusCode?: number })?.statusCode;
        // 404/410 = اشتراك منتهٍ ← احذفه
        if (code === 404 || code === 410) {
          await prisma.pushSubscription
            .delete({ where: { endpoint: s.endpoint } })
            .catch(() => void 0);
        } else {
          console.error("push send error", code);
        }
      }
    })
  );
  return sent;
}

/** يرسل إشعاراً لكل أجهزة المستخدم (يجلب الاشتراكات ثم يرسل). */
export async function sendPushToUser(
  userId: string,
  payload: PushPayload
): Promise<number> {
  if (!configure()) return 0;
  const subs = await getUserPushSubs(userId);
  return sendPushToSubs(subs, payload);
}
