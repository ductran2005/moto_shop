-- ============================================================
-- SpeedZone – Drop all old tables (only keep profiles)
-- ============================================================

-- Drop tables in reverse dependency order
drop table if exists public.leads;
drop table if exists public.landing_pages;

drop table if exists public.newsletter_subscribers;

drop table if exists public.testimonials;

drop table if exists public.blog_posts;
drop table if exists public.blog_categories;

drop table if exists public.featured_collection_items;
drop table if exists public.featured_collections;

drop table if exists public.product_relations;

drop table if exists public.reviews;

drop table if exists public.shipments;
drop table if exists public.payments;

drop table if exists public.order_items;
drop table if exists public.orders;

drop table if exists public.cart_items;
drop table if exists public.carts;

drop table if exists public.promotion_variants;
drop table if exists public.promotions;

drop table if exists public.inventory;
drop table if exists public.product_images;
drop table if exists public.product_variants;
drop table if exists public.products;

drop table if exists public.categories;
drop table if exists public.brands;

drop table if exists public.addresses;

-- Drop custom types (only if no longer used)
drop type if exists public.shipment_status;
drop type if exists public.payment_method;
drop type if exists public.payment_status;
drop type if exists public.order_status;
drop type if exists public.cart_status;
drop type if exists public.discount_type;
drop type if exists public.review_status;
drop type if exists public.address_type;
