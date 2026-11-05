# امپراتور شرکت‌ها | Empire of Companies

پروتوتایپ بازی مدیریتی سه‌بعدی برای مرورگر و مسیر توسعه Android.

## فناوری‌ها
- Babylon.js 8 + TypeScript + Vite
- رابط فارسی/انگلیسی با RTL/LTR
- ذخیرهٔ پیشرفت فقط در localStorage دستگاه
- Supabase Auth برای هویت بازیکن؛ بدون ارسال ذخیرهٔ بازی به فضای ابری

## اجرا
```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

در فایل .env.local مقدارهای Project URL و Publishable/anon key را وارد کنید.

## اصول امنیتی و داده
- فقط کلید publishable/anon در برنامهٔ مرورگر استفاده می‌شود.
- هرگز service_role یا کلید secret را در کد سمت کاربر قرار ندهید.
- Supabase فقط برای ثبت‌نام/ورود است؛ پول، کارمندان، میزها و پیشرفت بازی محلی می‌مانند.

## برنامه و تقسیم کار
- [تقسیم کامل کار تا انتشار نهایی](docs/WORK_BREAKDOWN_STRUCTURE.md)
- [نقشه راه](docs/ROADMAP.md)
- [وضعیت تأییدشده پروژه](docs/PROJECT_STATUS.md)

## وضعیت
این نسخه vertical-slice اولیه است، نه بازی کامل. صحنهٔ سه‌بعدی و اقتصاد اولیه وجود دارد؛ تعادل اقتصاد، مأموریت‌ها، ساختمان‌های چندطبقه، ذخیرهٔ مقاوم‌تر، تست‌های خودکار و بسته‌بندی Android هنوز در برنامه‌اند.