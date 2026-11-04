-- Tables and row level security
create table shops (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  shop_id uuid references shops(id) on delete cascade,
  role text not null check (role in ('manager', 'employee')),
  full_name text
);

alter table shops enable row level security;
alter table profiles enable row level security;

create policy read_own_profile on profiles
  for select using (id = auth.uid());

create policy read_own_shop on shops
  for select using (
    id in (select shop_id from profiles where id = auth.uid())
  );
