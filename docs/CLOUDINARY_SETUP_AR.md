# إعداد Cloudinary لمنصة إنتاج للدعاية والإشهار

## القيم المطلوبة

من لوحة Cloudinary انسخ القيم التالية إلى Secrets الخاصة بالمشروع، ولا تضع `API Secret` داخل الكود أو في متغيرات Vite:

| المتغير | القيمة | مكان الاستخدام |
|---|---|---|
| `CLOUDINARY_CLOUD_NAME` | `nfrqgsks` | الخادم والرفع إلى Cloudinary |
| `CLOUDINARY_API_KEY` | من Cloudinary Console | الخادم لتوقيع الرفع |
| `CLOUDINARY_API_SECRET` | من Cloudinary Console | الخادم فقط لتوقيع وحذف الملفات |
| `VITE_SUPABASE_URL` | رابط مشروع Supabase | الواجهة |
| `VITE_SUPABASE_ANON_KEY` | Publishable/Anon key | الواجهة |

القيمة `689246516139684` ليست Cloud Name؛ الـ Cloud Name الصحيح المسجل للمشروع هو `nfrqgsks`.

## إعدادات Console المقترحة

من **Cloudinary Console → Settings → Upload → Upload presets** أنشئ preset باسم `production_signed` واجعله **Signed**. استخدم مجلدات منفصلة مثل `production/projects` و`production/blog` و`production/clients`. لا تجعل الـ preset unsigned ما دام الرفع يتم من لوحة إدارة محمية.

فعّل التحويلات الآلية للصور بصيغة `f_auto,q_auto`، وحدد حدًا منطقيًا لحجم الصورة. للفيديو استخدم `vc_auto` و`q_auto` عند الحاجة، ولا ترفع ملفات ضخمة من المتصفح دون حد للحجم. اترك حذف الملفات من الخادم فقط عبر `destroy` باستخدام `public_id` و`resource_type` الصحيحين (`image` أو `video`).

## طريقة التشغيل

أضف القيم عبر Secrets في Management UI أو ملف البيئة المحلي غير المتعقب في Git. بعد ذلك سجّل الدخول بحساب إداري، افتح `/admin`، وارفع صورة غلاف أو فيديو. يحصل الخادم أولًا على توقيع مؤقت من الإجراء المحمي، ثم يرفع المتصفح الملف مباشرة إلى Cloudinary، وبعد نجاح الرفع يُحفظ الرابط و`public_id` و`resource_type` فقط في Supabase.

عند تعديل الغلاف، يجب حذف الأصل القديم المرتبط بالحقل نفسه فقط. عند حذف المشروع أو المقال، يحذف الخادم أصول Cloudinary المسجلة قبل حذف صف Supabase. لا تعتمد على حذف الرابط فقط؛ الحذف يحتاج `public_id` و`resource_type`.

## التحقق

بعد إدخال المفاتيح نفّذ اختبار رفع صورة صغيرة وفيديو قصير من لوحة الإدارة، ثم تحقق من ظهور السجل في Cloudinary ومن حفظ `cover_url` و`cover_public_id` و`video_url` و`video_public_id` في Supabase. اختبر أيضًا تعديل الغلاف وحذف المشروع للتأكد من عدم بقاء ملفات يتيمة.

إذا ظهرت `401 Unauthorized` فتحقق من API Key وAPI Secret من **Cloudinary Console → Settings → Access Keys** ومن أن Cloud Name هو `nfrqgsks`. لا ترسل API Secret في المحادثات أو داخل الواجهة الأمامية.
