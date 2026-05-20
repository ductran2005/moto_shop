"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { StarRating } from "@/components/ui/StarRating";
import { createClient } from "@/lib/supabase/client";

export type ProductCardData = {
  id: string;
  brand: string;
  name: string;
  salePrice: string;
  originalPrice: string;
  badge: string;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
};

type ProductCardProps = {
  product: ProductCardData;
};

function parseCurrency(value: string) {
  const numberValue = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(numberValue) ? numberValue : 0;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAddToCart() {
    setMessage(null);

    startTransition(async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // Ép đăng nhập: chuyển hướng đến trang đăng nhập
        router.push("/login");
        return;
      }

      const { error } = await supabase.rpc("add_product_to_cart", {
        product_slug: product.id,
        item_quantity: 1,
      });

      if (error) {
        console.error("Add to cart DB error:", error);
        setMessage("Lỗi: Không thể thêm vào giỏ hàng");
        return;
      }

      setMessage("Đã thêm vào giỏ");
      router.refresh();
    });
  }

  return (
    <article className="group flex min-h-[492px] flex-col overflow-hidden rounded-[10px] bg-white shadow-[0_4px_18px_rgba(0,0,0,0.08)] transition duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_14px_30px_rgba(0,0,0,0.14)]">
      <div className="relative h-[262px] shrink-0 bg-zinc-50 md:h-[256px]">
        <span className="absolute left-3 top-3 z-10 rounded-full bg-[var(--color-accent)] px-2.5 py-1 text-[11px] font-bold text-white">
          {product.badge}
        </span>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="h-full w-full object-contain p-2 transition-transform duration-200 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-medium uppercase text-zinc-500">{product.brand}</p>
        <h3 className="mt-2 line-clamp-2 min-h-12 text-base font-bold leading-6 text-zinc-950">{product.name}</h3>
        <div className="mt-4">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        </div>
        <div className="mt-3 flex flex-col gap-1">
          <span className="text-lg font-bold text-[var(--color-accent)]">{product.salePrice}</span>
          <span className="text-xs text-zinc-400 line-through">{product.originalPrice}</span>
        </div>
      </div>
      {message ? (
        <p className="border-t border-zinc-100 px-5 py-2 text-center text-xs font-semibold text-[var(--color-accent)]">
          {message}
        </p>
      ) : null}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isPending}
        className="h-12 w-full shrink-0 bg-[#1a1a1a] text-xs font-bold uppercase text-white transition-colors hover:bg-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Đang thêm..." : "Thêm vào giỏ"}
      </button>
    </article>
  );
}

export default ProductCard;
