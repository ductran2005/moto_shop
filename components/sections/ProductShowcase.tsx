import { CategoryBar } from "@/components/sections/CategoryBar";
import { PromoBanners } from "@/components/sections/PromoBanners";

export function ProductShowcase() {
  return (
    <section id="best-sale" className="w-full bg-white px-4 pb-8 pt-5 md:px-6 lg:px-10 lg:pb-10">
      <div className="flex flex-col gap-3">
        <CategoryBar />
        <PromoBanners />
      </div>
    </section>
  );
}

export default ProductShowcase;
