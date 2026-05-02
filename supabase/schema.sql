create extension if not exists "pgcrypto";

create table if not exists public.saved_items (
  id uuid primary key default gen_random_uuid(),
  source_url text not null,
  source_title text not null default '',
  site_name text not null,
  image_url text not null,
  caption text,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.saved_items enable row level security;

drop policy if exists "Public can read public saved items" on public.saved_items;
create policy "Public can read public saved items"
on public.saved_items
for select
using (is_public = true);

drop policy if exists "Authenticated curator can read all saved items" on public.saved_items;
create policy "Authenticated curator can read all saved items"
on public.saved_items
for select
to authenticated
using (true);

drop policy if exists "Authenticated curator can update saved items" on public.saved_items;
create policy "Authenticated curator can update saved items"
on public.saved_items
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated curator can delete saved items" on public.saved_items;
create policy "Authenticated curator can delete saved items"
on public.saved_items
for delete
to authenticated
using (true);

create index if not exists saved_items_created_at_idx
on public.saved_items (created_at desc);

insert into storage.buckets (id, name, public)
values ('feed-images', 'feed-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read feed images" on storage.objects;
create policy "Public can read feed images"
on storage.objects
for select
using (bucket_id = 'feed-images');
