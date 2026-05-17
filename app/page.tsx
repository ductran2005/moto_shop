import { BestSellers } from "@/components/home/BestSellers";
import { BlogSection } from "@/components/home/BlogSection";
import { BrandLogos } from "@/components/home/BrandLogos";
import { Footer } from "@/components/home/Footer";
import { HeroBanner } from "@/components/home/HeroBanner";
import { Navbar } from "@/components/home/Navbar";
import { NewsletterBanner } from "@/components/home/NewsletterBanner";
import { Testimonials } from "@/components/home/Testimonials";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { ProductSection } from "@/components/product/ProductSection";

export default function Home() {
  return (
    <>
      <Navbar />
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
