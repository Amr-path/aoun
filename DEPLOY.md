# نشر «عون» على الإنترنت (Vercel + Postgres)

دليلٌ خطوة بخطوة للحصول على رابطٍ دائم بـHTTPS، تعمل معه الإشعارات والتثبيت كتطبيق.

---

## ١) قاعدة بيانات Postgres مجانية

اختر واحدة (كلاهما مجاني):

- **Neon** — https://neon.tech → أنشئ مشروعاً → انسخ «Connection string» (يبدأ بـ`postgresql://`).
- أو **Vercel Postgres** — من لوحة Vercel لاحقاً (Storage → Create → Postgres).

احتفظ برابط الاتصال، سنسمّيه `DATABASE_URL`.

## ٢) هيّئ قاعدة البيانات (مرّة واحدة من جهازك)

في مجلد المشروع، مرّر رابط Postgres وادفع المخطط والبذور:

```bash
# ثبّت الاعتماديات إن لم تكن مثبّتة
npm install

# ادفع المخطط إلى قاعدة الإنتاج (استبدل الرابط)
DATABASE_URL="postgresql://...." npx prisma db push

# (اختياري) مستخدم تجريبي: demo@aoun.app / demo1234
DATABASE_URL="postgresql://...." npm run db:seed
```

## ٣) ارفع الكود إلى GitHub

```bash
git init && git add -A && git commit -m "عون"
# أنشئ مستودعاً على GitHub ثم:
git remote add origin https://github.com/<username>/aoun.git
git push -u origin main
```

> `.env` مُستثنى من Git (لا تُرفع أسرارك) — سنضعها في Vercel.

## ٤) استورد المشروع في Vercel

1. https://vercel.com → **Add New → Project** → اختر مستودع GitHub.
2. Framework: **Next.js** (يُكتشف تلقائياً). لا تغيّر أوامر البناء.
3. قبل **Deploy**، افتح **Environment Variables** وأضِف المتغيّرات التالية.

## ٥) متغيّرات البيئة في Vercel

| المتغيّر | القيمة |
|---------|--------|
| `DATABASE_URL` | رابط Postgres |
| `AUTH_SECRET` | نصٌّ عشوائي طويل — ولّده بـ: `openssl rand -base64 32` |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | من ملف `.env` عندك (أو `npm run vapid`) |
| `VAPID_PRIVATE_KEY` | من ملف `.env` عندك |
| `VAPID_SUBJECT` | `mailto:you@example.com` |
| `CRON_SECRET` | نصٌّ عشوائي — `openssl rand -base64 24` |
| `HABIT_REFINER_PROVIDER` | `mock` |

ثم اضغط **Deploy**. بعد دقيقة ستحصل على رابطٍ مثل `https://aoun-xxxx.vercel.app`.

## ٦) جرّبه على جوالك

افتح الرابط في Safari → **إضافة إلى الشاشة الرئيسية** → افتحه كتطبيق. فعّل «تذكيراتٌ لطيفة» لتجربة الإشعارات (تعمل الآن لأنّ الموقع على HTTPS).

---

## التذكيرات المجدولة (اختياري)

مسار المجدول: `GET /api/cron/reminders` (محميّ بـ`CRON_SECRET`).

- ملف `vercel.json` يشغّله كل ٥ دقائق — لكن **خطة Vercel المجانية تسمح بمرّة يومياً فقط**. للتذكيرات المتكرّرة:
  - إمّا ترقية Vercel، أو
  - استخدم مجدولاً خارجياً مجانياً مثل **cron-job.org**: أنشئ مهمّة تستدعي
    `https://<your-app>.vercel.app/api/cron/reminders`
    كل ٥ دقائق، مع ترويسة: `Authorization: Bearer <CRON_SECRET>`.

## ملاحظات

- التطوير المحلي الآن يستخدم Postgres أيضاً — ضع نفس `DATABASE_URL` في ملف `.env` المحلي (أو أنشئ قاعدة Neon منفصلة للتطوير).
- بعد أي تعديل على `prisma/schema.prisma`: `npx prisma db push` ثم أعِد النشر (Vercel يبني تلقائياً عند كل `git push`).
- لمجالٍ مخصّص (نطاقك الخاص): Vercel → Project → Settings → Domains.
