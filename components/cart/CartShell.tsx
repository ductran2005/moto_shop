"use client";

import { useMemo, useState } from "react";

import { CartItemsPanel } from "@/components/cart/CartItemsPanel";
import { OrderSummary } from "@/components/cart/OrderSummary";
import type { CartItem } from "@/types/cart";

interface CartShellProps {
  initialItems: CartItem[];
}

export function CartShell({ initialItems }: CartShellProps) {
  const [items, setItems] = useState(initialItems);
  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  function handleQuantityChange(id: string, quantity: number) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
      ),
    );
  }

  function handleRemove(id: string) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }

  function handleReset() {
    setItems(initialItems);
  }

  function handleClear() {
    setItems([]);
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
