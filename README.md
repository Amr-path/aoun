# عون — رفيقك للاستمرار

تطبيق عادات عربيّ أوّلاً بفلسفة **التوازن والثبات**: سبع عادات فقط طوال العام، لأقصى اتساق. تصميم هادئ (ساج/كريمي)، تفاعلٌ مبهج، وقابلٌ للتثبيت كتطبيق (PWA).

## التقنيات

- **Next.js 16 (App Router) + TypeScript** — الواجهة والـbackend معاً.
- **Tailwind CSS v4** — نظام تصميم ساج/كريمي هادئ بظلال دافئة طبقية.
- **Prisma + SQLite** — قاعدة علائقية مكتفية ذاتياً (قابلة للتحويل إلى PostgreSQL).
- **Zustand** — حالة خفيفة مع تحديثات تفاؤلية.
- **المصادقة** — بريد + كلمة مرور (bcrypt) وجلسة JWT في كوكي HttpOnly.
- **Web Push (VAPID)** — تذكيرات قبل الموعد و«نداء» عند الفوات، عبر مجدول cron.
- **PWA** — service worker للعمل دون اتصال، manifest، وأيقونات قابلة للتثبيت.
- الخطوط: **IBM Plex Sans Arabic** + **Cairo**.

## التشغيل محلياً

```bash
npm install
npm run db:push     # ينشئ قاعدة SQLite من المخطط
npm run db:seed     # يبذر مستخدماً تجريبياً + العادات السبع
npm run dev         # http://localhost:3000
```

> عند أول `db:push` سيُنزّل Prisma محرّكه الثنائي (يتطلّب إنترنت).

**بيانات دخول تجريبية:** `demo@aoun.app` / `demo1234` — أو أنشئ حساباً جديداً من `/login`.

## متغيّرات البيئة (`.env`)

| المتغيّر | الوظيفة |
|---------|---------|
| `DATABASE_URL` | مسار قاعدة SQLite |
| `AUTH_SECRET` | سرّ توقيع جلسات الدخول — **غيّره في الإنتاج** |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` | مفاتيح Web Push (`npm run vapid` لإعادة توليدها) |
| `CRON_SECRET` | حماية مسار المجدول `/api/cron/reminders` |
| `HABIT_REFINER_PROVIDER` | `mock` (محلّي) أو `http` (خادم/LLM حقيقي) |

## الإشعارات والمجدول

- فعّلها من زر «تذكيراتٌ لطيفة» في اللوحة.
- المجدول: `GET /api/cron/reminders` (يُستدعى كل ٥ دقائق). محلياً جرّبه بـ:
  `curl -H "Authorization: Bearer <CRON_SECRET>" http://localhost:3000/api/cron/reminders`
- على Vercel يعمل تلقائياً عبر `vercel.json`.

## أوامر مفيدة

| الأمر | الوظيفة |
|------|---------|
| `npm run dev` / `build` | تطوير / بناء |
| `npm run typecheck` | فحص الأنواع |
| `npm run lint` | ESLint |
| `npm run test` | اختبارات المنطق (النقاط + التوصية) |
| `npm run db:studio` | استعراض قاعدة البيانات |
| `npm run vapid` | توليد مفاتيح Web Push |

## بنية المشروع

```
prisma/    schema.prisma (User/Habit/DailyLog/UserScore/PushSubscription) + seed.ts
public/    sw.js (offline + push) · manifest.webmanifest · icons/ · logo.svg
src/
  app/       login · onboarding · dashboard · analytics · offline · api/*
  components/ FlowerScore · HabitCard · AuthForm · ContributionGrid · ...
  lib/       auth · habits · scoring · recommend · refiner · analytics · push · reminders
```

## الحالة

1. ✅ الأساس ونظام التصميم
2. ✅ لوحة التحكم + بطاقات العادات + التلعيب (GPS)
3. ✅ الـOnboarding + محرك التوصية + طبقة الـLLM
4. ✅ محرك الإشعارات (Web Push) + التحليلات (شبكة السنة)
5. ✅ تفعيل PWA + تسجيل الدخول والحسابات

### التالي (اختياري)
- ربط التذكيرات بأوقات الصلاة (موقع المستخدم + مرساة للعادة).
- مزوّد OAuth (Google) إلى جانب البريد/كلمة المرور.
- النشر على Vercel.
