import type { Metadata } from "next";
import { ChevronRight, House } from "lucide-react";

import { CartBenefits } from "@/components/cart/CartBenefits";
import { CartShell } from "@/components/cart/CartShell";
import { RecommendedProducts } from "@/components/cart/RecommendedProducts";
import { Footer } from "@/components/layout/Footer";
import type { CartItem, RecommendationItem } from "@/types/cart";

export const metadata: Metadata = {
  title: "Giỏ hàng | SpeedZone",
  description:
    "Xem lại sản phẩm trong giỏ hàng SpeedZone, áp dụng ưu đãi và tiếp tục thanh toán.",
};

const CART_ITEMS: CartItem[] = [
  {
    id: "honda-winner-x",
    name: "Honda Winner X",
    variant: "Phiên bản Thể thao",
    detail: "Màu: Đen đỏ",
    price: 46_160_000,
    image: "/images/products/motorbike-red.png",
    quantity: 1,
  },
  {
    id: "motul-7100-10w40",
    name: "Motul 7100 10W-40",
    variant: "100% Chính hãng",
    detail: "Dung tích: 1L",
    price: 550_000,
    image: "/images/products/motor-oil.png",
    quantity: 1,
  },
  {
    id: "agv-k1-s-rossi",
    name: "AGV K1 S Rossi",
    variant: "Fullface",
    detail: "Màu: Đen/Neon",
    price: 4_500_000,
    image: "/images/products/helmet.png",
    quantity: 1,
  },
];

const RECOMMENDED_PRODUCTS: RecommendationItem[] = [
  {
    id: "michelin-city-grip-2",
    name: "Michelin City Grip 2",
    price: 650_000,
    image: "/images/products/motorcycle-tire.png",
    rating: 4.7,
    reviewCount: 74,
  },
  {
    id: "sc-project-exhaust",
    name: "Pô Akrapovic Carbon",
    price: 7_500_000,
    image: "/images/products/exhaust.png",
    rating: 4.8,
    reviewCount: 32,
  },
  {
    id: "brembo-brake-pad",
    name: "Đĩa phanh Brembo",
    price: 2_800_000,
    image: "/images/products/brake-pad.png",
    rating: 4.8,
    reviewCount: 41,
  },
  {
    id: "yss-rear-shock",
    name: "Phuộc YSS G-Series",
    price: 3_200_000,
    image: "/images/products/rear-shock.png",
    rating: 4.8,
    reviewCount: 26,
  },
];

export default function CartPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] pt-20 text-white">
      <section className="speed-container py-7 md:py-9">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <House className="size-4" />
          <ChevronRight className="size-4" />
          <span>Giỏ hàng</span>
        </div>

        <h1 className="font-heading mt-5 text-4xl font-black italic uppercase text-white">
          Giỏ hàng
        </h1>

        <div className="mt-7">
          <CartShell initialItems={CART_ITEMS} />
        </div>

        <div className="mt-7">
          <CartBenefits />
        </div>

        <div className="mt-7">
          <RecommendedProducts products={RECOMMENDED_PRODUCTS} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
