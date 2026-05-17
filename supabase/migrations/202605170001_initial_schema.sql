create extension if not exists "pgcrypto";
create extension if not exists "citext";

create type public.user_role as enum ('customer', 'staff', 'admin');
create type public.address_type as enum ('shipping', 'billing');
create type public.cart_status as enum ('active', 'converted', 'abandoned');
create type public.order_status as enum ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
create type public.payment_status as enum ('pending', 'authorized', 'paid', 'failed', 'refunded');
create type public.payment_method as enum ('cod', 'bank_transfer', 'momo', 'zalopay', 'vnpay', 'card');
create type public.shipment_status as enum ('pending', 'packed', 'shipped', 'delivered', 'returned');
create type public.discount_type as enum ('percentage', 'fixed_amount');
create type public.review_status as enum ('pending', 'approved', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  date_of_birth date,
  marketing_opt_in boolean not null default false,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  address_type public.address_type not null,
  recipient_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  ward text,
  district text,
  city text not null,
  province text,
  postal_code text,
  country_code char(2) not null default 'VN',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  logo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories(id),
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid references public.brands(id),
  category_id uuid not null references public.categories(id),
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique,
  variant_name text not null,
  color text,
  size text,
  edition text,
  attributes jsonb not null default '{}'::jsonb,
  price numeric(12,2) not null check (price >= 0),
  compare_at_price numeric(12,2) check (compare_at_price is null or compare_at_price >= price),
  is_default boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete set null,
  image_url text not null,
  alt_text text not null,
  sort_order integer not null default 0,
  is_primary boolean not null default false
);

create table public.inventory (
  variant_id uuid primary key references public.product_variants(id) on delete cascade,
  quantity_on_hand integer not null default 0 check (quantity_on_hand >= 0),
  quantity_reserved integer not null default 0 check (quantity_reserved >= 0),
  reorder_level integer not null default 0 check (reorder_level >= 0),
  updated_at timestamptz not null default now(),
  check (quantity_reserved <= quantity_on_hand)
);

create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  name text not null,
  description text,
  discount_type public.discount_type not null,
  discount_value numeric(12,2) not null check (discount_value >= 0),
  minimum_order_amount numeric(12,2) not null default 0 check (minimum_order_amount >= 0),
  max_discount_amount numeric(12,2),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  usage_limit integer,
  per_user_limit integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table public.promotion_variants (
  promotion_id uuid not null references public.promotions(id) on delete cascade,
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  primary key (promotion_id, variant_id)
);

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  session_id text,
  status public.cart_status not null default 'active',
  currency char(3) not null default 'VND',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (user_id is not null or session_id is not null)
);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  variant_id uuid not null references public.product_variants(id),
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  created_at timestamptz not null default now(),
  unique (cart_id, variant_id)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references public.profiles(id) on delete set null,
  email text not null,
  phone text not null,
  shipping_address jsonb not null,
  billing_address jsonb,
  subtotal numeric(12,2) not null check (subtotal >= 0),
  discount_total numeric(12,2) not null default 0 check (discount_total >= 0),
  shipping_total numeric(12,2) not null default 0 check (shipping_total >= 0),
  tax_total numeric(12,2) not null default 0 check (tax_total >= 0),
  grand_total numeric(12,2) not null check (grand_total >= 0),
  currency char(3) not null default 'VND',
  status public.order_status not null default 'pending',
  notes text,
  placed_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  sku text not null,
  variant_snapshot jsonb not null default '{}'::jsonb,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  line_total numeric(12,2) not null check (line_total >= 0)
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null,
  method public.payment_method not null,
  provider_reference text,
  amount numeric(12,2) not null check (amount >= 0),
  status public.payment_status not null default 'pending',
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  carrier text,
  tracking_number text,
  status public.shipment_status not null default 'pending',
  shipped_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  order_item_id uuid references public.order_items(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  title text,
  body text,
  status public.review_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (user_id, product_id, order_item_id)
);

create table public.product_relations (
  product_id uuid not null references public.products(id) on delete cascade,
  related_product_id uuid not null references public.products(id) on delete cascade,
  relation_type text not null,
  sort_order integer not null default 0,
  primary key (product_id, related_product_id, relation_type),
  check (product_id <> related_product_id)
);

create table public.featured_collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.featured_collection_items (
  collection_id uuid not null references public.featured_collections(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  sort_order integer not null default 0,
  primary key (collection_id, product_id)
);

create table public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.blog_categories(id) on delete set null,
  author_id uuid references public.profiles(id) on delete set null,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_image_url text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_title text,
  quote text not null,
  rating integer check (rating between 1 and 5),
  avatar_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  source text,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create table public.landing_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  seo_title text,
  seo_description text,
  content jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  landing_page_id uuid references public.landing_pages(id) on delete set null,
  full_name text,
  email citext,
  phone text,
  message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create unique index addresses_one_default_per_type_per_user
  on public.addresses (user_id, address_type)
  where is_default;

create unique index product_variants_one_default_per_product
  on public.product_variants (product_id)
  where is_default;

create unique index product_images_one_primary_per_product
  on public.product_images (product_id)
  where is_primary;

create index addresses_user_id_idx on public.addresses (user_id);
create index categories_parent_id_idx on public.categories (parent_id);
create index products_brand_id_idx on public.products (brand_id);
create index products_category_id_idx on public.products (category_id);
create index products_is_active_idx on public.products (is_active);
create index product_variants_product_id_idx on public.product_variants (product_id);
create index product_images_product_id_idx on public.product_images (product_id);
create index carts_user_id_idx on public.carts (user_id);
create index cart_items_cart_id_idx on public.cart_items (cart_id);
create index orders_user_id_idx on public.orders (user_id);
create index orders_status_idx on public.orders (status);
create index order_items_order_id_idx on public.order_items (order_id);
create index payments_order_id_idx on public.payments (order_id);
create index shipments_order_id_idx on public.shipments (order_id);
create index reviews_product_id_idx on public.reviews (product_id);
create index blog_posts_category_id_idx on public.blog_posts (category_id);
create index leads_landing_page_id_idx on public.leads (landing_page_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger inventory_set_updated_at
before update on public.inventory
for each row execute function public.set_updated_at();

create trigger carts_set_updated_at
before update on public.carts
for each row execute function public.set_updated_at();

create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create trigger blog_posts_set_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

create trigger landing_pages_set_updated_at
before update on public.landing_pages
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.leads enable row level security;
alter table public.newsletter_subscribers enable row level security;

create policy "profiles are viewable by owner"
on public.profiles for select
using (auth.uid() = id);

create policy "profiles are updatable by owner"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "addresses are manageable by owner"
on public.addresses for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "carts are manageable by owner"
on public.carts for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "cart items are manageable through owned cart"
on public.cart_items for all
using (
  exists (
    select 1
    from public.carts
    where carts.id = cart_items.cart_id
      and carts.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.carts
    where carts.id = cart_items.cart_id
      and carts.user_id = auth.uid()
  )
);

create policy "orders are viewable by owner"
on public.orders for select
using (auth.uid() = user_id);

create policy "order items are viewable through owned order"
on public.order_items for select
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
  )
);

create policy "reviews are manageable by owner"
on public.reviews for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "leads can be inserted anonymously"
on public.leads for insert
with check (true);

create policy "newsletter subscribers can be inserted anonymously"
on public.newsletter_subscribers for insert
with check (true);

grant usage on schema public to anon, authenticated, service_role;
grant select on public.brands, public.categories, public.products, public.product_variants,
  public.product_images, public.inventory, public.promotions, public.promotion_variants,
  public.featured_collections, public.featured_collection_items, public.blog_categories,
  public.blog_posts, public.testimonials, public.landing_pages
to anon, authenticated;

grant select, insert, update, delete on public.profiles, public.addresses, public.carts,
  public.cart_items, public.reviews
to authenticated;

grant select on public.orders, public.order_items to authenticated;
grant insert on public.leads, public.newsletter_subscribers to anon, authenticated;
