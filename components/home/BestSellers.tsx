"use client";

import Image from "next/image";
import { useRef } from "react";
import { products } from "@/components/product/product-data";
import { StarRating } from "@/components/ui/StarRating";

const bestSellerProductIds = [
  "honda-winner-x",
  "yamaha-exciter-155",
  "motul-7100-10w40",
  "michelin-city-grip-2",
  "agv-k1-s-rossi",
  "honda-winner-x-sport",
  "castrol-power1-ultimate",
] as const;

const bestSellerProducts = bestSellerProductIds
  .map((id) => products.find((product) => product.id === id))
  .filter((product): product is (typeof products)[number] => product !== undefined);

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      {direction === "left" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  );
}

export function BestSellers() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: "left" | "right") => {
    carouselRef.current?.scrollBy({
      left: direction === "left" ? -260 : 260,
      behavior: "smooth",
    });
  };

  return (
    <section id="best-sellers" className="w-full bg-white py-12 md:py-16">
      <div className="speed-container">
        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center lg:gap-10">
          <div className="flex flex-col items-start">
            <h2 className="max-w-[190px] text-[28px] font-extrabold uppercase leading-tight text-zinc-950">
              Sản Phẩm Bán Chạy
            </h2>
            <span className="mt-4 h-0.5 w-11 bg-[var(--color-accent)]" />
            <a
              href="#"
              className="mt-8 inline-flex h-12 items-center justify-center border border-zinc-300 px-6 text-xs font-bold uppercase text-zinc-950 transition-colors hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
            >
              Xem Tất Cả
            </a>
          </div>

          <div className="relative min-w-0">
            <button
              type="button"
              aria-label="Xem sản phẩm trước"
              onClick={() => scrollCarousel("left")}
              className="absolute left-0 top-1/2 z-10 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:text-zinc-950 lg:flex"
            >
              <ArrowIcon direction="left" />
            </button>

            <div
              ref={carouselRef}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {bestSellerProducts.map((product) => (
                <article
                  key={product.id}
                  className="group min-w-[220px] basis-[220px] shrink-0 snap-start rounded-md border border-zinc-200 bg-white p-4 transition duration-200 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)] sm:min-w-[230px] sm:basis-[230px] lg:min-w-[calc((100%-64px)/5)] lg:basis-[calc((100%-64px)/5)]"
                >
                  <div className="relative h-40 w-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 180px, (max-width: 1024px) 190px, 20vw"
                      className="object-contain p-1 transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>

                  <div className="mt-4">
                    <h3 className="line-clamp-2 min-h-12 text-base font-semibold leading-6 text-zinc-950">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-base font-bold text-zinc-950">{product.salePrice}</p>
                    <div className="mt-3">
                      <StarRating rating={product.rating} reviewCount={product.reviewCount} className="text-[11px]" />
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <button
              type="button"
              aria-label="Xem sản phẩm tiếp theo"
              onClick={() => scrollCarousel("right")}
              className="absolute right-0 top-1/2 z-10 hidden h-9 w-9 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:text-zinc-950 lg:flex"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BestSellers;
