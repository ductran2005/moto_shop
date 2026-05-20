-- ============================================================
-- SpeedZone - Orders and SePay payment tables
-- ============================================================

-- Order status enum
do $$ begin
  create type public.order_status as enum (
    'pending',       -- Chờ thanh toán
    'confirmed',     -- Đã xác nhận (đã nhận được tiền)
    'processing',    -- Đang xử lý
    'shipping',      -- Đang giao
    'delivered',     -- Đã giao
    'cancelled',     -- Đã hủy
    'refunded'       -- Đã hoàn tiền
  );
exception
  when duplicate_object then null;
end $$;

-- Payment method enum
do $$ begin
  create type public.payment_method as enum (
    'cod',       -- Thanh toán khi nhận hàng
    'bank',      -- Chuyển khoản ngân hàng
    'wallet',    -- Ví điện tử
    'sepay'      -- SePay (chuyển khoản tự động)
  );
exception
  when duplicate_object then null;
end $$;

-- Orders table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  order_code text not null unique,          -- Mã đơn hàng (e.g. SZ-20260520-XXXX)
  status public.order_status not null default 'pending',
  payment_method public.payment_method not null default 'cod',
  subtotal integer not null check (subtotal >= 0),
  discount integer not null default 0 check (discount >= 0),
  shipping_fee integer not null default 0 check (shipping_fee >= 0),
  total integer not null check (total >= 0),
  full_name text not null,
  phone text not null,
  address text not null,
  note text,
  shipping_option text not null default 'standard',
  items jsonb not null default '[]'::jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- SePay transactions table (tracking bank transfers)
create table if not exists public.sepay_transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  sepay_id bigint unique,                   -- ID from SePay webhook
  transaction_date timestamptz,
  amount integer not null check (amount >= 0),
  content text,                              -- Nội dung chuyển khoản
  bank_code text,                            -- Mã ngân hàng
  bank_account_number text,                  -- Số tài khoản
  bank_account_name text,                    -- Tên tài khoản
  raw_payload jsonb,                         -- Full payload từ SePay
  is_processed boolean not null default false,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Triggers
drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

-- RLS
alter table public.orders enable row level security;
alter table public.sepay_transactions enable row level security;

-- Policies for orders
drop policy if exists "users view own orders" on public.orders;
create policy "users view own orders"
on public.orders for select
using (auth.uid() = user_id or public.is_admin());

drop policy if exists "users insert own orders" on public.orders;
create policy "users insert own orders"
on public.orders for insert
with check (auth.uid() = user_id or auth.uid() is null);

drop policy if exists "users update own orders" on public.orders;
create policy "users update own orders"
on public.orders for update
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

-- Policies for sepay_transactions
drop policy if exists "admins manage sepay transactions" on public.sepay_transactions;
create policy "admins manage sepay transactions"
on public.sepay_transactions for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "users view own sepay transactions" on public.sepay_transactions;
create policy "users view own sepay transactions"
on public.sepay_transactions for select
using (
  exists (
    select 1 from public.orders
    where orders.id = sepay_transactions.order_id
      and orders.user_id = auth.uid()
  )
);

-- Grants
grant select, insert, update on public.orders to authenticated;
grant select on public.sepay_transactions to authenticated;

-- Function to generate order code
create or replace function public.generate_order_code()
returns text
language sql
as $$
  select 'SZ-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(md5(random()::text), 1, 6));
$$;

-- Function to create order
create or replace function public.create_order(
  p_user_id uuid,
  p_payment_method public.payment_method,
  p_subtotal integer,
  p_discount integer,
  p_shipping_fee integer,
  p_total integer,
  p_full_name text,
  p_phone text,
  p_address text,
  p_note text default null,
  p_shipping_option text default 'standard',
  p_items jsonb default '[]'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_order_id uuid;
  new_order_code text;
begin
  new_order_code := public.generate_order_code();

  insert into public.orders (
    user_id, order_code, status, payment_method,
    subtotal, discount, shipping_fee, total,
    full_name, phone, address, note, shipping_option, items
  ) values (
    p_user_id, new_order_code, 'pending', p_payment_method,
    p_subtotal, p_discount, p_shipping_fee, p_total,
    p_full_name, p_phone, p_address, p_note, p_shipping_option, p_items
  )
  returning id into new_order_id;

  return new_order_id;
end;
$$;

grant execute on function public.create_order(uuid, public.payment_method, integer, integer, integer, integer, text, text, text, text, text, jsonb) to authenticated;
grant execute on function public.generate_order_code() to authenticated;
