-- ============================================================
-- SpeedZone - Catalog and cart schema
-- ============================================================

create extension if not exists "pgcrypto";

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  sku text unique,
  brand text not null default 'SpeedZone',
  description text,
  sale_price integer not null check (sale_price >= 0),
  original_price integer check (original_price is null or original_price >= 0),
  image_url text not null default '/images/products/motor-oil.png',
  badge text,
  rating numeric(2, 1) not null default 5.0 check (rating >= 0 and rating <= 5),
  review_count integer not null default 0 check (review_count >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  status text not null default 'active' check (status in ('active', 'draft', 'hidden')),
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'ordered', 'abandoned')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, status)
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  unit_price integer not null check (unit_price >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cart_id, product_id)
);

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists carts_set_updated_at on public.carts;
create trigger carts_set_updated_at
before update on public.carts
for each row execute function public.set_updated_at();

drop trigger if exists cart_items_set_updated_at on public.cart_items;
create trigger cart_items_set_updated_at
before update on public.cart_items
for each row execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;

drop policy if exists "active categories are public" on public.categories;
create policy "active categories are public"
on public.categories for select
using (is_active or public.is_admin());

drop policy if exists "admins manage categories" on public.categories;
create policy "admins manage categories"
on public.categories for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "active products are public" on public.products;
create policy "active products are public"
on public.products for select
using (status = 'active' or public.is_admin());

drop policy if exists "admins manage products" on public.products;
create policy "admins manage products"
on public.products for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "users manage own carts" on public.carts;
create policy "users manage own carts"
on public.carts for all
using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "users manage own cart items" on public.cart_items;
create policy "users manage own cart items"
on public.cart_items for all
using (
  public.is_admin()
  or exists (
    select 1
    from public.carts
    where carts.id = cart_items.cart_id
      and carts.user_id = auth.uid()
  )
)
with check (
  public.is_admin()
  or exists (
    select 1
    from public.carts
    where carts.id = cart_items.cart_id
      and carts.user_id = auth.uid()
  )
);

grant select on public.categories, public.products to anon, authenticated;
grant insert, update, delete on public.categories, public.products to authenticated;
grant select, insert, update, delete on public.carts, public.cart_items to authenticated;

create or replace function public.add_product_to_cart(product_slug text, item_quantity integer default 1)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  active_cart_id uuid;
  selected_product record;
  selected_cart_item_id uuid;
  safe_quantity integer := greatest(coalesce(item_quantity, 1), 1);
begin
  if current_user_id is null then
    raise exception 'not_authenticated';
  end if;

  select id, sale_price
  into selected_product
  from public.products
  where slug = product_slug
    and status = 'active';

  if selected_product.id is null then
    raise exception 'product_not_found';
  end if;

  insert into public.carts (user_id, status)
  values (current_user_id, 'active')
  on conflict (user_id, status)
  do update set updated_at = now()
  returning id into active_cart_id;

  insert into public.cart_items (cart_id, product_id, quantity, unit_price)
  values (active_cart_id, selected_product.id, safe_quantity, selected_product.sale_price)
  on conflict (cart_id, product_id)
  do update set
    quantity = public.cart_items.quantity + excluded.quantity,
    unit_price = excluded.unit_price,
    updated_at = now()
  returning id into selected_cart_item_id;

  return selected_cart_item_id;
end;
$$;

grant execute on function public.add_product_to_cart(text, integer) to authenticated;

insert into public.categories (name, slug, sort_order)
values
  ('Xe Máy', 'xe-may', 1),
  ('Dầu Nhớt', 'dau-nhot', 2),
  ('Phụ Tùng', 'phu-tung', 3),
  ('Đồ Chơi Xe', 'do-choi-xe', 4),
  ('Chăm Sóc Xe', 'cham-soc-xe', 5),
  ('Khuyến Mãi', 'khuyen-mai', 6)
on conflict (slug) do update
set name = excluded.name,
    sort_order = excluded.sort_order;

insert into public.products (
  category_id,
  name,
  slug,
  sku,
  brand,
  sale_price,
  original_price,
  image_url,
  badge,
  rating,
  review_count,
  stock_quantity,
  status,
  is_featured
)
values
  ((select id from public.categories where slug = 'xe-may'), 'Honda Winner X', 'honda-winner-x', 'MC-WIN-X', 'Honda', 46160000, 48900000, '/images/products/motorbike-red.png', 'HOT', 4.9, 126, 18, 'active', true),
  ((select id from public.categories where slug = 'xe-may'), 'Yamaha Exciter 155', 'yamaha-exciter-155', 'MC-EX-155', 'Yamaha', 49500000, 52000000, '/images/products/motorbike-blue.png', '-5%', 4.8, 96, 11, 'active', true),
  ((select id from public.categories where slug = 'dau-nhot'), 'Motul 7100 10W-40', 'motul-7100-10w40', 'OIL-7100', 'Motul', 550000, 650000, '/images/products/motor-oil.png', '-15%', 4.9, 256, 42, 'active', true),
  ((select id from public.categories where slug = 'phu-tung'), 'Michelin City Grip 2', 'michelin-city-grip-2', 'TIR-MIC-CG2', 'Michelin', 650000, 760000, '/images/products/motorcycle-tire.png', 'HOT', 4.7, 74, 24, 'active', false),
  ((select id from public.categories where slug = 'phu-tung'), 'Bố Thắng Brembo', 'brembo-brake-pad', 'BRK-BREMBO', 'Brembo', 780000, 920000, '/images/products/brake-pad.png', '-15%', 4.8, 63, 16, 'active', false),
  ((select id from public.categories where slug = 'do-choi-xe'), 'AGV K1 S Rossi', 'agv-k1-s-rossi', 'HEL-K1-S', 'AGV', 4500000, 5100000, '/images/products/helmet.png', '-12%', 4.8, 36, 4, 'active', true),
  ((select id from public.categories where slug = 'do-choi-xe'), 'Thùng Sau Givi', 'givi-top-box', 'BOX-GIVI', 'Givi', 2300000, 2650000, '/images/products/top-box.png', '-13%', 4.7, 54, 9, 'active', false),
  ((select id from public.categories where slug = 'cham-soc-xe'), 'Bộ Chăm Sóc Xe Cao Cấp', 'speedzone-care-kit', 'CARE-SZ', 'SpeedZone', 10000, 450000, '/images/products/care-kit.png', '10K', 4.8, 42, 30, 'active', false),
  ((select id from public.categories where slug = 'cham-soc-xe'), 'Dung Dịch Rửa Xe Sonax', 'sonax-shampoo', 'CARE-SONAX', 'Sonax', 10000, 310000, '/images/products/care-kit.png', '10K', 4.7, 77, 50, 'active', false),
  ((select id from public.categories where slug = 'cham-soc-xe'), 'Sáp Bóng Xe 3M', '3m-wax', 'CARE-3M-WAX', '3M', 10000, 410000, '/images/products/care-kit.png', '10K', 4.8, 59, 45, 'active', false),
  ((select id from public.categories where slug = 'cham-soc-xe'), 'Dung Dịch Đánh Bóng', 'mothers-polish', 'CARE-MOTHERS', 'Mothers', 10000, 500000, '/images/products/care-kit.png', '10K', 4.8, 48, 35, 'active', false),
  ((select id from public.categories where slug = 'cham-soc-xe'), 'Làm Sạch Nhanh Turtle Wax', 'turtle-wax-cleaner', 'CARE-TURTLE', 'Turtle Wax', 10000, 350000, '/images/products/care-kit.png', '10K', 4.7, 66, 40, 'active', false)
on conflict (slug) do update
set category_id = excluded.category_id,
    name = excluded.name,
    sku = excluded.sku,
    brand = excluded.brand,
    sale_price = excluded.sale_price,
    original_price = excluded.original_price,
    image_url = excluded.image_url,
    badge = excluded.badge,
    rating = excluded.rating,
    review_count = excluded.review_count,
    stock_quantity = excluded.stock_quantity,
    status = excluded.status,
    is_featured = excluded.is_featured;
