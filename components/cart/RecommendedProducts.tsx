import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { StarRating } from "@/components/ui/StarRating";
import type { RecommendationItem } from "@/types/cart";

interface RecommendedProductsProps {
  products: RecommendationItem[];
}

function formatCurrency(value: number) {
  return `${value.toLocaleString("vi-VN")}đ`;
}

export function RecommendedProducts({ products }: RecommendedProductsProps) {
  return (
    <section className="rounded-lg border border-white/8 bg-white/[0.025] p-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold uppercase text-white">Có thể bạn cũng cần</h2>
        <Link href="/#product" className="text-xs font-bold uppercase text-zinc-400 transition hover:text-white">
          Xem tất cả
        </Link>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <article key={product.id} className="rounded-md border border-white/8 bg-black/15 p-4">
            <div className="relative h-36 overflow-hidden rounded-md bg-white/[0.03]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                className="object-contain p-3"
              />
            </div>
            <div className="mt-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-medium text-white">{product.name}</h3>
                <p className="mt-2 text-sm font-bold text-[var(--color-accent)]">
                  {formatCurrency(product.price)}
                </p>
              </div>
              <button
                type="button"
                aria-label={`Thêm ${product.name} vào giỏ`}
                className="grid size-10 shrink-0 place-items-center rounded-md border border-white/12 text-zinc-300 transition hover:border-white/25 hover:text-white"
              >
                <ShoppingCart className="size-4" />
              </button>
            </div>
            <div className="mt-3">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RecommendedProducts;
