# نشر إنتاج للدعاية والإشهار على Vercel

## إعداد المشروع

اربط مستودع GitHub بالمشروع في Vercel، ثم استخدم Node.js 22 مع أمر التثبيت `pnpm install --frozen-lockfile` وأمر البناء `pnpm build`. ملف `vercel.json` يوجه ملفات الواجهة إلى `dist/public` ويمرر `/api/*` إلى `api/index.ts` مع الحفاظ على المسار الأصلي لخدمات tRPC وOAuth.

## المتغيرات المطلوبة

أضف القيم الفعلية من لوحة Vercel ضمن **Production** و**Preview**. لا تضع أسرارًا في GitHub أو في متغير يبدأ بـ `VITE_` إذا كان يجب أن يبقى سريًا.

| المتغير | الاستخدام |
|---|---|
| `VITE_SUPABASE_URL` | عنوان مشروع Supabase للواجهة |
| `VITE_SUPABASE_ANON_KEY` | المفتاح العام الآمن للواجهة |
| `SUPABASE_URL` | عنوان Supabase للخادم إن كان مستخدمًا في بيئة الخادم |
| `SUPABASE_ANON_KEY` | مفتاح Supabase للخادم عند الحاجة |
| `CLOUDINARY_CLOUD_NAME` | اسم Cloudinary |
| `CLOUDINARY_API_KEY` | مفتاح Cloudinary العام للخادم |
| `CLOUDINARY_API_SECRET` | سر Cloudinary، ويبقى server-only |
| `JWT_SECRET` | توقيع الجلسات إذا استُخدم مسار OAuth الداخلي |
| `OAUTH_SERVER_URL` | خادم OAuth عند تفعيل مسار OAuth الخاص بالقالب |
| `VITE_OAUTH_PORTAL_URL` | بوابة OAuth للواجهة عند استخدام Manus OAuth |
| `VITE_APP_ID` | معرّف تطبيق OAuth |
| `VITE_APP_TITLE` | اسم المنصة |
| `VITE_APP_LOGO` | شعار المنصة، إن كان مستخدمًا |
| `VITE_ANALYTICS_ENDPOINT` | نقطة تحليلات الواجهة، اختياري |
| `VITE_ANALYTICS_WEBSITE_ID` | معرّف موقع التحليلات، اختياري |

إذا كان المشروع يعتمد فقط على Supabase Auth في الواجهة، فلا تضع مفاتيح خدمة Supabase ذات الصلاحيات العالية في متغيرات `VITE_` أو في كود العميل.

## التحقق بعد النشر

اختبر الصفحة الرئيسية، تبديل العربية والفرنسية والإنجليزية، `GET /api/health` إن أُضيف لاحقًا، مسارات `/api/trpc/*`، تسجيل الدخول، `/admin`، توقيع Cloudinary، ورفع وحذف الوسائط. لا تعتبر النشر ناجحًا قبل فحص سجلات Vercel والتأكد من عدم ظهور أسرار في مخرجات البناء.
