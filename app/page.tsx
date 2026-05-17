import { Footer } from "@/components/layout/Footer";
import { BestSellers } from "@/components/sections/BestSellers";
import { BlogSection } from "@/components/sections/BlogSection";
import { BrandLogos } from "@/components/sections/BrandLogos";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { NewsletterBanner } from "@/components/sections/NewsletterBanner";
import { ProductSection } from "@/components/sections/ProductSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";

export default function Home() {
  return (
    <>
      <main>
        <HeroBanner />
        <ProductSection />
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
