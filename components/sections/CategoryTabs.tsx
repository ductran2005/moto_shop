"use client";

import { productCategories, type ProductCategory } from "@/content/productData";

type CategoryIconName = (typeof productCategories)[number]["icon"];

function CategoryIcon({ name }: { name: CategoryIconName }) {
  const icons = {
    bike: (
      <>
        <circle cx="7" cy="17" r="3.25" />
        <circle cx="18" cy="17" r="3.25" />
        <path d="M7 17h4l2.5-6H10l-1.5 3" />
        <path d="M13.5 11H17l2 6" />
        <path d="M11.5 8h3" />
      </>
    ),
    oil: (
      <>
        <path d="M9 4h6v3l2 2v11H7V9l2-2V4Z" />
        <path d="M10 12h4" />
        <path d="M10 15h4" />
      </>
    ),
    gear: (
      <>
        <circle cx="12" cy="12" r="3.25" />
        <path d="M12 3.5v2" />
        <path d="M12 18.5v2" />
        <path d="m5.99 5.99 1.42 1.42" />
        <path d="m16.59 16.59 1.42 1.42" />
        <path d="M3.5 12h2" />
        <path d="M18.5 12h2" />
        <path d="m5.99 18.01 1.42-1.42" />
        <path d="m16.59 7.41 1.42-1.42" />
      </>
    ),
    scooter: (
      <>
        <circle cx="7" cy="17" r="3.25" />
        <circle cx="18" cy="17" r="3.25" />
        <path d="M7 17h6.5l-2-6H8.5" />
        <path d="M13.5 11H17l2 6" />
        <path d="M9 8h5" />
        <path d="m14 8 2-3" />
      </>
    ),
    care: (
      <>
        <path d="M12 4c2.4 2.8 4 5 4 7.4A4 4 0 0 1 8 11.4C8 9 9.6 6.8 12 4Z" />
        <path d="M6 19c1.4-1.5 3.4-2.25 6-2.25S16.6 17.5 18 19" />
      </>
    ),
    sale: (
      <>
        <path d="M12 20s7-4.35 7-10V5.5L12 3 5 5.5V10c0 5.65 7 10 7 10Z" />
        <path d="m9 12 2 2 4-5" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

type CategoryTabsProps = {
  activeCategory: ProductCategory;
  onCategorySelect: (category: ProductCategory) => void;
};

export function CategoryTabs({ activeCategory, onCategorySelect }: CategoryTabsProps) {
  return (
    <div>
      <div className="mx-auto grid grid-cols-2 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)] sm:grid-cols-3 lg:flex">
        {productCategories.map((category) => {
          const isActive = activeCategory === category.title;

          return (
            <button
              key={category.title}
              type="button"
              onClick={() => onCategorySelect(category.title)}
              className="relative flex min-h-[108px] flex-col items-center justify-center gap-1.5 border-r border-b border-zinc-200 px-3 py-4 text-center even:border-r-0 [&:nth-last-child(-n+2)]:border-b-0 sm:min-h-[112px] sm:px-4 sm:[&:nth-child(3n)]:border-r-0 sm:[&:nth-last-child(-n+3)]:border-b-0 lg:min-h-[116px] lg:flex-1 lg:border-b-0 lg:px-5 lg:even:border-r lg:last:border-r-0"
            >
              <span className={isActive ? "text-[var(--color-accent)]" : "text-zinc-950"}>
                <CategoryIcon name={category.icon} />
              </span>
              <span className={`block text-xs font-bold uppercase leading-none ${isActive ? "text-[var(--color-accent)]" : "text-zinc-950"}`}>
                {category.title}
              </span>
              <span className="block text-xs font-medium text-zinc-500">{category.subtitle}</span>
              <span className={`absolute inset-x-0 bottom-0 h-0.5 bg-[var(--color-accent)] ${isActive ? "opacity-100" : "opacity-0"}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryTabs;
