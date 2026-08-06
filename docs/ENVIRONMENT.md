# Environment variables — إنتاج للدعاية والإشهار

المنصة الرسمية هي **إنتاج للدعاية والإشهار**، وتدعم العربية (`ar`) والفرنسية (`fr`) والإنجليزية (`en`). يتم حفظ اللغة في المتصفح، ويضبط التطبيق `document.documentElement.lang` و`dir` تلقائيًا (`rtl` للعربية و`ltr` للفرنسية والإنجليزية).


يتم حقن الأسرار عبر إعدادات المشروع ولا تُحفظ داخل المستودع. يحتاج التشغيل إلى المتغيرات التالية:

| Variable | Purpose |
|---|---|
| `SUPABASE_URL` | رابط مشروع Supabase |
| `SUPABASE_ANON_KEY` | المفتاح العام لـ Supabase |
| `CLOUDINARY_CLOUD_NAME` | اسم Cloudinary Cloud |
| `CLOUDINARY_API_KEY` | مفتاح Cloudinary API على الخادم |
| `CLOUDINARY_API_SECRET` | سر Cloudinary على الخادم فقط |
| `CLOUDINARY_FOLDER` | مجلد الوسائط داخل Cloudinary، ويفضل `production-advertising` |
| `VITE_APP_TITLE` | اسم التطبيق الظاهر في العنوان والهوية: `إنتاج للدعاية والإشهار` |
| `DEFAULT_LOCALE` | اللغة الافتراضية الاختيارية: `ar` أو `fr` أو `en` |

في بيئة Manus تتم إدارة هذه القيم من إعدادات Secrets. عند التشغيل خارجها، انسخ هذه الأسماء إلى ملف البيئة المحلي دون مشاركة قيم الأسرار أو رفع الملف إلى Git.
