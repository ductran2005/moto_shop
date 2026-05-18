export const adminSections = [
  "products",
  "categories",
  "orders",
  "customers",
  "banners",
  "promotions",
  "reviews",
  "staff",
  "roles",
  "settings",
  "activity-log",
] as const;

export type AdminSectionKey = "overview" | (typeof adminSections)[number];
