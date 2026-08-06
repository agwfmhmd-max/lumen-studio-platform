-- Non-destructive migration for admin contact channels and announcement content.
alter table public.settings add column if not exists whatsapp text;
alter table public.settings add column if not exists announcement_text text;
alter table public.settings add column if not exists announcement_url text;
alter table public.settings add column if not exists announcement_image_url text;
alter table public.settings add column if not exists announcement_active boolean not null default false;

-- Keep the singleton settings row available without introducing demo contact data.
insert into public.settings (id, site_name, announcement_active)
values (1, 'إنتاج للدعاية والإشهار', false)
on conflict (id) do nothing;
