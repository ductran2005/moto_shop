import type { Metadata } from "next";
import { ChevronRight, House, LockKeyhole } from "lucide-react";

import { CheckoutShell } from "@/components/checkout/CheckoutShell";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
import type { CartItem } from "@/types/cart";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Thanh toán | SpeedZone",
  description:
    "Hoàn tất thông tin nhận hàng, vận chuyển và phương thức thanh toán cho đơn hàng SpeedZone.",
};

type CartQueryResult = {
  cart_items?: Array<{
    id: string;
    quantity: number;
    unit_price: number;
    products: {
      id: string;
      name: string;
      brand: string;
      image_url: string;
    } | null;
  }>;
};

async function getCartItems(): Promise<CartItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("carts")
    .select("cart_items(id, quantity, unit_price, products(id, name, brand, image_url))")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  const cart = data as CartQueryResult | null;

  return (cart?.cart_items ?? [])
    .filter((item) => item.products)
    .map((item) => ({
      id: item.id,
      productId: item.products?.id,
      name: item.products?.name ?? "Sản phẩm",
      variant: item.products?.brand ?? "SpeedZone",
      detail: "Sản phẩm trong giỏ hàng",
      price: item.unit_price,
      image: item.products?.image_url ?? "/images/products/motor-oil.png",
      quantity: item.quantity,
    }));
}

export default async function CheckoutPage() {
  const cartItems = await getCartItems();

  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] pt-20 text-white">
      <section className="speed-container py-7 md:py-9">
        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
          <House className="size-4" />
          <ChevronRight className="size-4" />
          <span>Giỏ hàng</span>
          <ChevronRight className="size-4" />
          <span className="text-zinc-300">Thanh toán</span>
        </div>

        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-heading text-4xl font-black italic uppercase text-white">
              Thanh toán
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              Kiểm tra thông tin nhận hàng, chọn vận chuyển và xác nhận phương thức thanh toán
              trước khi đặt đơn.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-md border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase text-emerald-300">
            <LockKeyhole className="size-4" />
            Bảo mật SSL
          </div>
        </div>

        <div className="mt-7">
          <CheckoutShell initialItems={cartItems} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
