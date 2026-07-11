# نشر «عون» بالكامل على VPS (هوستنجر / أوبونتو)

يستضيف كل شيء ذاتياً: Next.js + PostgreSQL + HTTPS + التذكيرات المجدولة.
المتطلّبات: خطة **VPS** (ليست Shared hosting) بنظام **Ubuntu 22/24**، و**دومين** يشير إلى عنوان الـVPS (لازمٌ لعمل الإشعارات والتثبيت عبر HTTPS).

---

## ١) الاتصال بالخادم وتحديثه
```bash
ssh root@YOUR_SERVER_IP
apt update && apt upgrade -y
```

## ٢) تثبيت الأدوات
```bash
# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git nginx postgresql

# مدير العمليات
npm install -g pm2
```

## ٣) قاعدة بيانات PostgreSQL
```bash
sudo -u postgres psql -c "CREATE USER aoun WITH PASSWORD 'STRONG_PASSWORD';"
sudo -u postgres psql -c "CREATE DATABASE aoun OWNER aoun;"
```
رابط الاتصال سيكون:
`postgresql://aoun:STRONG_PASSWORD@localhost:5432/aoun`

## ٤) جلب الكود وإعداد البيئة
```bash
cd /var/www && git clone https://github.com/<username>/aoun.git && cd aoun
npm install
```
أنشئ ملف `.env`:
```bash
cat > .env <<'EOF'
DATABASE_URL="postgresql://aoun:STRONG_PASSWORD@localhost:5432/aoun"
AUTH_SECRET="غيّرني-إلى-نص-عشوائي-طويل"
NEXT_PUBLIC_VAPID_PUBLIC_KEY="مفتاحك-العام"
VAPID_PRIVATE_KEY="مفتاحك-الخاص"
VAPID_SUBJECT="mailto:you@example.com"
CRON_SECRET="غيّرني-إلى-نص-عشوائي"
HABIT_REFINER_PROVIDER="mock"
EOF
```
> ولّد المفاتيح: `openssl rand -base64 32` (للـAUTH_SECRET) و`npm run vapid` (لمفاتيح VAPID).

## ٥) قاعدة البيانات + البناء
```bash
npx prisma db push
npm run db:seed        # اختياري: demo@aoun.app / demo1234
npm run build
```

## ٦) التشغيل عبر PM2 (يبقى يعمل ويعيد التشغيل تلقائياً)
```bash
pm2 start npm --name aoun -- start        # يستمع على المنفذ 3000
pm2 save
pm2 startup systemd                        # نفّذ السطر الذي يطبعه
```

## ٧) Nginx كوسيط عكسي + الدومين
أنشئ `/etc/nginx/sites-available/aoun`:
```nginx
server {
  listen 80;
  server_name your-domain.com www.your-domain.com;
  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
  }
}
```
فعّله:
```bash
ln -s /etc/nginx/sites-available/aoun /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```
> في لوحة الدومين: أنشئ سجلّ **A** يشير إلى عنوان الـVPS.

## ٨) شهادة HTTPS مجانية (لازمة للإشعارات والتثبيت)
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com -d www.your-domain.com
```
Certbot يضبط HTTPS والتجديد التلقائي. الآن افتح `https://your-domain.com`.

## ٩) جدار الحماية
```bash
ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw enable
```

## ١٠) التذكيرات المجدولة (cron نظاميّ كل ٥ دقائق)
```bash
crontab -e
```
أضِف السطر (استبدل الدومين والسرّ):
```
*/5 * * * * curl -s -H "Authorization: Bearer YOUR_CRON_SECRET" https://your-domain.com/api/cron/reminders >/dev/null 2>&1
```

---

## التحديثات لاحقاً
```bash
cd /var/www/aoun
git pull
npm install
npx prisma db push      # إن تغيّر المخطط
npm run build
pm2 restart aoun
```

## نصائح
- راقب السجلّات: `pm2 logs aoun`.
- نسخة احتياطية لقاعدة البيانات: `pg_dump -U aoun aoun > backup.sql`.
- إن لم يكن لديك دومين بعد: يعمل التطبيق عبر عنوان الـVPS مباشرةً، لكن **الإشعارات والتثبيت لن تعمل دون HTTPS** (أي دون دومين + Certbot).
