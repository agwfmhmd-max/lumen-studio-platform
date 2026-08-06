create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text not null default 'editor' check (role in ('admin','editor')),
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  description text,
  icon text,
  accent text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  logo_public_id text,
  website_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  cover_url text,
  cover_public_id text,
  gallery jsonb not null default '[]'::jsonb,
  video_url text,
  video_public_id text,
  execution_date date,
  services_used text[] not null default '{}',
  is_featured boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_url text,
  cover_public_id text,
  meta_title text,
  meta_description text,
  og_image_url text,
  author_id uuid references public.users(id) on delete set null,
  is_published boolean not null default true,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  quote text not null,
  person_name text not null,
  person_role text,
  avatar_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  status text not null default 'new' check (status in ('new','read','replied','archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  site_name text not null default 'Lumen Studio',
  tagline text,
  logo_url text,
  logo_public_id text,
  favicon_url text,
  phone text,
  email text,
  address text,
  instagram_url text,
  linkedin_url text,
  behance_url text,
  vimeo_url text,
  google_maps_url text,
  google_analytics_id text,
  meta_title text,
  meta_description text,
  updated_at timestamptz not null default now()
);

insert into public.settings (id, site_name, tagline, meta_title, meta_description)
values (1, 'Lumen Studio', 'Stories with a pulse.', 'Lumen Studio — Stories with a pulse', 'Lumen Studio is an independent creative production studio crafting cinematic stories, brand worlds, and digital experiences.')
on conflict (id) do nothing;

create index if not exists projects_category_idx on public.projects(category_id);
create index if not exists projects_client_idx on public.projects(client_id);
create index if not exists blog_posts_published_idx on public.blog_posts(is_published, published_at desc);
create index if not exists contacts_status_idx on public.contacts(status, created_at desc);

alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.services enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.blog_posts enable row level security;
alter table public.testimonials enable row level security;
alter table public.contacts enable row level security;
alter table public.settings enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.users where id = auth.uid() and role in ('admin','editor')); $$;

create policy "public read published services" on public.services for select using (is_published = true or public.is_admin());
create policy "public read published projects" on public.projects for select using (is_published = true or public.is_admin());
create policy "public read categories" on public.categories for select using (true);
create policy "public read clients" on public.clients for select using (true);
create policy "public read published posts" on public.blog_posts for select using (is_published = true or public.is_admin());
create policy "public read testimonials" on public.testimonials for select using (is_published = true or public.is_admin());
create policy "public read settings" on public.settings for select using (true);
create policy "public create contact" on public.contacts for insert with check (true);
create policy "admin manage users" on public.users for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage services" on public.services for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage clients" on public.clients for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage projects" on public.projects for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage posts" on public.blog_posts for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage testimonials" on public.testimonials for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage contacts" on public.contacts for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage settings" on public.settings for all using (public.is_admin()) with check (public.is_admin());

-- Keep the application profile synchronized with Supabase Auth.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.users (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'), new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.handle_updated_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  update public.users
  set email = new.email,
      full_name = coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name')
  where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
after update of email, raw_user_meta_data on auth.users
for each row execute procedure public.handle_updated_user();

-- Bootstrap the first administrator explicitly after creating the account:
-- update public.users set role = 'admin' where email = 'admin@example.com';
