-- ============================================
-- Tabel online_orders
-- Pesanan dari website yang terintegrasi ke kasir Juhbay POS
-- Jalankan SQL ini di Supabase SQL Editor
-- ============================================

create table online_orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  items jsonb not null default '[]',
  total integer not null default 0,
  status text not null default 'pending',
  notes text not null default '',
  created_at timestamptz not null default now()
);

-- RLS
alter table online_orders enable row level security;

-- Siapa saja bisa insert (customer dari website)
create policy "Public insert online_orders" on online_orders for insert with check (true);

-- Hanya authenticated (kasir) bisa baca & update
create policy "Auth read online_orders" on online_orders for select using (auth.role() = 'authenticated');
create policy "Auth update online_orders" on online_orders for update using (auth.role() = 'authenticated');

-- Enable realtime agar kasir bisa subscribe
alter publication supabase_realtime add table online_orders;
