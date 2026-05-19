-- ============================================
-- Juhbay Coffee - Supabase Database Schema
-- Jalankan SQL ini di Supabase SQL Editor
-- ============================================

-- 1. Tabel menu_items (produk)
create table menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price integer not null default 0,
  category text not null default '',
  image_url text not null default '',
  created_at timestamptz not null default now()
);

-- 2. Tabel contact_submissions (pesan pelanggan)
create table contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- 3. Tabel site_settings (profil & pengaturan usaha)
create table site_settings (
  id uuid primary key default gen_random_uuid(),
  store_name text not null default 'Juhbay Coffee',
  description text not null default '',
  our_story text not null default '',
  address text not null default '',
  phone text not null default '',
  email text not null default '',
  map_url text not null default '',
  opening_hours text not null default 'Senin – Jumat: 07:00 – 21:00
Sabtu: 08:00 – 22:00
Minggu: 09:00 – 20:00',
  contact_subtitle text not null default '',
  updated_at timestamptz not null default now()
);

-- Insert default settings row
insert into site_settings (store_name, description, our_story)
values (
  'Juhbay Coffee',
  'Pemanggang kopi artisan yang berkomitmen pada sumber berkelanjutan dan rasa yang luar biasa.',
  'Juhbay Coffee lahir dari kecintaan kami terhadap kopi berkualitas tinggi. Dimulai dari garasi kecil, kami kini melayani ratusan pelanggan setiap hari dengan biji kopi pilihan dari petani lokal Indonesia.'
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

alter table menu_items enable row level security;
alter table contact_submissions enable row level security;
alter table site_settings enable row level security;

-- menu_items: semua bisa baca, hanya authenticated bisa CRUD
create policy "Public read menu_items" on menu_items for select using (true);
create policy "Auth insert menu_items" on menu_items for insert with check (auth.role() = 'authenticated');
create policy "Auth update menu_items" on menu_items for update using (auth.role() = 'authenticated');
create policy "Auth delete menu_items" on menu_items for delete using (auth.role() = 'authenticated');

-- contact_submissions: semua bisa insert (form publik), hanya authenticated bisa baca
create policy "Public insert contact" on contact_submissions for insert with check (true);
create policy "Auth read contact" on contact_submissions for select using (auth.role() = 'authenticated');

-- site_settings: semua bisa baca, hanya authenticated bisa update
create policy "Public read settings" on site_settings for select using (true);
create policy "Auth update settings" on site_settings for update using (auth.role() = 'authenticated');
create policy "Auth insert settings" on site_settings for insert with check (auth.role() = 'authenticated');

-- ============================================
-- Storage Bucket untuk gambar produk
-- ============================================

insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Policy: semua bisa lihat gambar, authenticated bisa upload
create policy "Public read images" on storage.objects for select using (bucket_id = 'images');
create policy "Auth upload images" on storage.objects for insert with check (bucket_id = 'images' and auth.role() = 'authenticated');
create policy "Auth delete images" on storage.objects for delete using (bucket_id = 'images' and auth.role() = 'authenticated');
