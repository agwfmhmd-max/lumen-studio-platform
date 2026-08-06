# Lumen Studio QA Notes

## Responsive verification

تم فحص المسارات `/` و`/work` و`/contact` على viewport لوحي 768×1024، كما تم فحص الصفحة الرئيسية ومسارات العمل والتواصل على viewport هاتف، إضافة إلى المعاينة المكتبية. حافظت الهوية البصرية على التباين، وتكيّفت شبكة المحتوى والعناوين والأزرار مع العرض الأصغر. صفحة العمل تعرض رسالة خطأ مرئية عند تعذر قراءة Supabase بدل ترك المساحة فارغة.

## Route coverage

| Route | UI | Data source | Metadata behavior |
|---|---|---|---|
| `/` | Home | Supabase-backed sections where applicable | Static document title |
| `/about` | About | Static editorial copy | Static document title |
| `/services` | Services | Supabase | Shared document title |
| `/services/:slug` | Service detail | Supabase | Dynamic title/description hook |
| `/work` | Portfolio | Supabase | Shared document title |
| `/work/:slug` | Project detail | Supabase | Dynamic title/description/OG hook |
| `/journal` | Journal | Supabase | Shared document title |
| `/journal/:slug` | Post detail | Supabase | Dynamic title/description/OG hook |
| `/contact` | Contact form | Supabase insert | Static document title |
| `/admin` | Protected admin | Supabase Auth + RLS | Private route |

## Known production considerations

The current application is a Vite SPA, so dynamic metadata is applied client-side. For crawler-grade server-rendered previews, migrate the public content routes to an SSR/prerender layer before relying on social-card previews in production. Cloudinary signing and deletion are implemented server-side; the remaining UI work is tracked in `todo.md`.
