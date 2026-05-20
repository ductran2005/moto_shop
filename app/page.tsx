import { Footer } from "@/components/layout/Footer";
import { BestSellers } from "@/components/sections/BestSellers";
import { BlogSection } from "@/components/sections/BlogSection";
import { BrandLogos } from "@/components/sections/BrandLogos";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { NewsletterBanner } from "@/components/sections/NewsletterBanner";
import { ProductSection } from "@/components/sections/ProductSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { createClient } from "@/lib/supabase/server";
import type { ProductCardData } from "@/components/ui/ProductCard";

type ProductQueryRow = {
  slug: string;
  brand: string;
  name: string;
  sale_price: number;
  original_price: number | null;
  badge: string | null;
  rating: number;
  review_count: number;
  image_url: string;
  categories: { name: string } | null;
};

function formatCurrency(value: number) {
  return `${value.toLocaleString("vi-VN")}đ`;
}

async function getCatalogProducts(): Promise<ProductCardData[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("slug, brand, name, sale_price, original_price, badge, rating, review_count, image_url, categories(name)")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (data as unknown as ProductQueryRow[]).map((product) => ({
    id: product.slug,
    brand: product.brand,
    name: product.name,
    salePrice: formatCurrency(product.sale_price),
    originalPrice: product.original_price ? formatCurrency(product.original_price) : "",
    badge: product.badge ?? "NEW",
    rating: Number(product.rating),
    reviewCount: product.review_count,
    image: product.image_url,
    category: product.categories?.name ?? "Xe Máy",
  }));
}

export default async function Home() {
  const catalogProducts = await getCatalogProducts();

  return (
    <>
      <main>
        <HeroBanner />
        <ProductSection initialProducts={catalogProducts} />
        <BestSellers />
        <BrandLogos />
        <WhyChooseUs />
        <Testimonials />
        <BlogSection />
        <NewsletterBanner />
      </main>
      <Footer />
    </>
  );
}
