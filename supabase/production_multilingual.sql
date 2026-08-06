-- إنتاج للدعاية والإشهار | Supabase production migration
-- نفّذ هذا الملف بعد schema.sql من Supabase SQL Editor.
-- الملف idempotent قدر الإمكان، ولا يحذف بيانات أو ملفات موجودة.

begin;

-- 1) الاسم الرسمي والإعدادات الافتراضية
update public.settings
set site_name = 'إنتاج للدعاية والإشهار',
    tagline = 'إبداع يصنع أثرًا',
    meta_title = 'إنتاج للدعاية والإشهار — استوديو إبداعي',
    meta_description = 'إنتاج للدعاية والإشهار: صناعة أفلام، هويات بصرية، حملات وتجارب رقمية للعلامات الطموحة.',
    updated_at = now()
where id = 1;

insert into public.settings (id, site_name, tagline, meta_title, meta_description)
values (1, 'إنتاج للدعاية والإشهار', 'إبداع يصنع أثرًا', 'إنتاج للدعاية والإشهار — استوديو إبداعي', 'إنتاج للدعاية والإشهار: صناعة أفلام، هويات بصرية، حملات وتجارب رقمية للعلامات الطموحة.')
on conflict (id) do nothing;

-- 2) اللغات المدعومة وإضافة ترجمة JSONB للمحتوى.
-- الشكل المقترح:
-- {"ar":{"title":"...","description":"..."},"fr":{"title":"..."},"en":{"title":"..."}}
alter table public.settings add column if not exists default_locale text not null default 'ar';
alter table public.settings add column if not exists supported_locales text[] not null default array['ar','fr','en'];
alter table public.settings add column if not exists social_links jsonb not null default '{}'::jsonb;
alter table public.categories add column if not exists translations jsonb not null default '{}'::jsonb;
alter table public.services add column if not exists translations jsonb not null default '{}'::jsonb;
alter table public.clients add column if not exists translations jsonb not null default '{}'::jsonb;
alter table public.projects add column if not exists translations jsonb not null default '{}'::jsonb;
alter table public.blog_posts add column if not exists translations jsonb not null default '{}'::jsonb;
alter table public.testimonials add column if not exists translations jsonb not null default '{}'::jsonb;

-- 3) حقول اللغة الاختيارية للسجلات الجديدة، مع إبقاء البيانات القديمة صالحة.
alter table public.categories add column if not exists locale text not null default 'ar' check (locale in ('ar','fr','en'));
alter table public.services add column if not exists locale text not null default 'ar' check (locale in ('ar','fr','en'));
alter table public.projects add column if not exists locale text not null default 'ar' check (locale in ('ar','fr','en'));
alter table public.blog_posts add column if not exists locale text not null default 'ar' check (locale in ('ar','fr','en'));

-- 4) فهارس JSONB واللغة.
create index if not exists services_translations_gin_idx on public.services using gin (translations);
create index if not exists projects_translations_gin_idx on public.projects using gin (translations);
create index if not exists blog_posts_translations_gin_idx on public.blog_posts using gin (translations);
create index if not exists services_locale_idx on public.services(locale);
create index if not exists projects_locale_idx on public.projects(locale);
create index if not exists blog_posts_locale_idx on public.blog_posts(locale);

-- 5) تحديث trigger التزامن مع Auth دون منح صلاحية admin تلقائيًا.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.users (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.email,
    'editor'
  )
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

-- 6) منح أول مدير يدويًا فقط بعد إنشاء حسابه في Supabase Auth.
-- استبدل البريد ثم نفّذ السطر يدويًا:
-- update public.users set role = 'admin' where email = 'admin@your-domain.com';

commit;

-- تحقق بعد التنفيذ:
-- select site_name, default_locale, supported_locales from public.settings where id = 1;
-- select column_name from information_schema.columns where table_schema='public' and table_name='projects';
