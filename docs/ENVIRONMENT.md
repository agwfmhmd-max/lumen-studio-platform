# Environment variables

يتم حقن الأسرار عبر إعدادات المشروع ولا تُحفظ داخل المستودع. يحتاج التشغيل إلى المتغيرات التالية:

| Variable | Purpose |
|---|---|
| `SUPABASE_URL` | رابط مشروع Supabase |
| `SUPABASE_ANON_KEY` | المفتاح العام لـ Supabase |
| `CLOUDINARY_CLOUD_NAME` | اسم Cloudinary Cloud |
| `CLOUDINARY_API_KEY` | مفتاح Cloudinary API على الخادم |
| `CLOUDINARY_API_SECRET` | سر Cloudinary على الخادم فقط |
| `CLOUDINARY_FOLDER` | مجلد الوسائط داخل Cloudinary |

في بيئة Manus تتم إدارة هذه القيم من إعدادات Secrets. عند التشغيل خارجها، انسخ هذه الأسماء إلى ملف البيئة المحلي دون مشاركة قيم الأسرار أو رفع الملف إلى Git.
