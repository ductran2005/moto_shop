"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { productCategories, products, type ProductCategory } from "@/content/productData";
import { CategoryTabs } from "@/components/sections/CategoryTabs";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { PromoBannerSection } from "@/components/sections/PromoBannerSection";

export function ProductSection() {
  const productsPerPage = 4;
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("Xe Máy");
  const [currentPage, setCurrentPage] = useState(1);
  const shouldScrollRef = useRef(false);
  const hasInteractedRef = useRef(false);
  const filteredProducts = useMemo(
    () => products.filter((product) => product.category === activeCategory),
    [activeCategory],
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const visibleProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);
  const activeSectionId = productCategories.find((category) => category.title === activeCategory)?.sectionId;

  const scrollToSection = () => {
    document.getElementById("product")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    const handleHeaderCategorySelect = (event: Event) => {
      const { category } = (event as CustomEvent<{ category: ProductCategory }>).detail;

      hasInteractedRef.current = true;
      if (category === activeCategory) {
        scrollToSection();
        return;
      }

      shouldScrollRef.current = true;
      setCurrentPage(1);
      setActiveCategory(category);
    };

    window.addEventListener("product-category-select", handleHeaderCategorySelect);
    return () => window.removeEventListener("product-category-select", handleHeaderCategorySelect);
  }, [activeCategory]);

  useEffect(() => {
    if (!hasInteractedRef.current) return;
    window.dispatchEvent(new CustomEvent("product-category-active", { detail: { category: activeCategory } }));
  }, [activeCategory]);

  useEffect(() => {
    if (!shouldScrollRef.current || !activeSectionId) return;

    scrollToSection();

    shouldScrollRef.current = false;
  }, [activeCategory, activeSectionId]);

  const handleCategorySelect = (category: ProductCategory) => {
    hasInteractedRef.current = true;
    if (category === activeCategory) {
      scrollToSection();
      return;
    }

    shouldScrollRef.current = true;
    setCurrentPage(1);
    setActiveCategory(category);
  };

  return (
    <section id="product" className="scroll-mt-28 bg-[var(--color-bg-light)] px-4 pb-12 pt-5 md:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-[1344px] flex-col gap-4">
        <CategoryTabs activeCategory={activeCategory} onCategorySelect={handleCategorySelect} />
      </div>

      {activeCategory === "Khuyến Mãi" ? (
        <div id={activeSectionId} className="mx-auto mt-4 w-full max-w-[1344px] scroll-mt-28">
          <PromoBannerSection />
        </div>
      ) : (
        <div id={activeSectionId} className="mx-auto mt-10 w-full max-w-[1344px] scroll-mt-28">
          <ProductGrid products={visibleProducts} />
          {totalPages > 1 ? (
            <nav aria-label="Phân trang sản phẩm" className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;
                const isActive = page === currentPage;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-9 min-w-9 rounded-md border px-3 text-sm font-semibold transition ${
                      isActive
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                        : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {page}
                  </button>
                );
              })}
            </nav>
          ) : null}
        </div>
      )}
    </section>
  );
}

export default ProductSection;
