"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { CartItemsPanel } from "@/components/cart/CartItemsPanel";
import { OrderSummary } from "@/components/cart/OrderSummary";
import {
  clearGuestCart,
  readGuestCart,
  removeGuestCartItem,
  updateGuestCartItem,
} from "@/lib/guest-cart";
import { createClient } from "@/lib/supabase/client";
import type { CartItem } from "@/types/cart";

interface CartShellProps {
  initialItems: CartItem[];
}

export function CartShell({ initialItems }: CartShellProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  useEffect(() => {
    if (initialItems.length > 0) return;

    const timeoutId = window.setTimeout(() => {
      setItems(readGuestCart());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [initialItems.length]);

  function handleQuantityChange(id: string, quantity: number) {
    const nextQuantity = Math.max(1, quantity);

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity: nextQuantity } : item,
      ),
    );

    if (id.startsWith("guest:")) {
      updateGuestCartItem(id, nextQuantity);
    } else {
      const supabase = createClient();
      void supabase.from("cart_items").update({ quantity: nextQuantity }).eq("id", id);
    }
  }

  function handleRemove(id: string) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));

    if (id.startsWith("guest:")) {
      removeGuestCartItem(id);
    } else {
      const supabase = createClient();
      void supabase.from("cart_items").delete().eq("id", id);
    }
  }

  function handleReset() {
    router.refresh();
  }

  function handleClear() {
    const itemIds = items.map((item) => item.id);
    setItems([]);

    if (itemIds.length === 0) return;

    const guestIds = itemIds.filter((id) => id.startsWith("guest:"));
    const dbIds = itemIds.filter((id) => !id.startsWith("guest:"));

    if (guestIds.length > 0) {
      clearGuestCart();
    }

    if (dbIds.length > 0) {
      const supabase = createClient();
      void supabase.from("cart_items").delete().in("id", dbIds);
    }
  }

  return (
    <>
      <div className="mb-7">
        <p className="text-sm text-zinc-400">
          Bạn đang có <span className="text-[var(--color-accent)]">{itemCount}</span> sản phẩm trong giỏ hàng
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.75fr)_minmax(320px,0.68fr)]">
        <CartItemsPanel
          items={items}
          onQuantityChange={handleQuantityChange}
          onRemove={handleRemove}
          onReset={handleReset}
          onClear={handleClear}
        />
        <OrderSummary items={items} />
      </div>
    </>
  );
}

export default CartShell;
