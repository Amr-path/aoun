// عون — بذر بيانات تجريبية: مستخدم واحد + العادات السبع الافتراضية + سجل نتيجة.
// بيانات الدخول التجريبية: demo@aoun.app / demo1234
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { HABIT_LIBRARY, DEFAULT_SEVEN_KEYS } from "../src/lib/constants";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("demo1234", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@aoun.app" },
    update: { password },
    create: {
      email: "demo@aoun.app",
      name: "مستخدم تجريبي",
      password,
      onboardedAt: new Date(),
      timezone: "Asia/Riyadh",
      score: { create: {} },
    },
  });

  // امسح عادات هذا المستخدم ثم أنشئ السبع الافتراضية بترتيب ثابت
  await prisma.habit.deleteMany({ where: { userId: user.id } });

  const templates = DEFAULT_SEVEN_KEYS.map(
    (k) => HABIT_LIBRARY.find((h) => h.key === k)!
  );

  for (let i = 0; i < templates.length; i++) {
    const t = templates[i];
    await prisma.habit.create({
      data: {
        userId: user.id,
        title: t.title,
        emoji: t.emoji,
        frequency: t.frequency,
        weekdays: JSON.stringify(t.weekdays),
        scheduledAt: t.scheduledAt,
        microSteps: JSON.stringify(t.microSteps),
        colorKey: t.colorKey,
        position: i,
      },
    });
  }

  console.log(`✅ تمّ البذر: مستخدم ${user.id} مع ${templates.length} عادات.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
