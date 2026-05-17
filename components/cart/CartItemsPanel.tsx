"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Trash2 } from "lucide-react";
import type { CartItem } from "@/types/cart";

interface CartItemsPanelProps {
  items: CartItem[];
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onReset: () => void;
  onClear: () => void;
}

function formatCurrency(value: number) {
  return `${value.toLocaleString("vi-VN")}đ`;
}

export function CartItemsPanel({
  items,
  onQuantityChange,
  onRemove,
  onReset,
  onClear,
}: CartItemsPanelProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-white/8 bg-white/[0.025]">
      <div className="hidden grid-cols-[1.7fr_0.5fr_0.55fr_0.5fr_32px] gap-5 border-b border-white/8 px-6 py-5 text-xs font-bold uppercase text-zinc-400 lg:grid">
        <span>Sản phẩm</span>
        <span>Đơn giá</span>
        <span>Số lượng</span>
        <span>Thành tiền</span>
        <span />
      </div>

      {items.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <p className="text-lg font-semibold text-white">Giỏ hàng đang trống</p>
          <p className="mt-2 text-sm text-zinc-400">Thêm sản phẩm để tiếp tục mua sắm.</p>
        </div>
      ) : (
        <div>
          {items.map((item) => (
            <article
              key={item.id}
              className="grid gap-5 border-b border-white/8 px-4 py-5 last:border-b-0 sm:px-6 lg:grid-cols-[1.7fr_0.5fr_0.55fr_0.5fr_32px] lg:items-center"
            >
              <div className="flex min-w-0 gap-4">
                <div className="relative size-28 shrink-0 overflow-hidden rounded-md bg-white/[0.03]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="112px"
                    className="object-contain p-3"
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-white">{item.name}</h2>
                  <p className="mt-1 text-sm text-zinc-400">{item.variant}</p>
                  <p className="mt-1 text-sm text-zinc-400">{item.detail}</p>
                  <p className="mt-4 text-sm text-emerald-400">✓ Còn hàng</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 lg:block">
                <span className="text-xs uppercase text-zinc-500 lg:hidden">Đơn giá</span>
                <span className="font-semibold text-[var(--color-accent)]">
                  {formatCurrency(item.price)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 lg:block">
                <span className="text-xs uppercase text-zinc-500 lg:hidden">Số lượng</span>
                <div className="inline-flex h-11 items-center overflow-hidden rounded-md border border-white/10 bg-black/20">
                  <button
                    type="button"
                    onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                    className="grid h-full w-10 place-items-center text-zinc-300 transition hover:bg-white/5"
                  >
                    −
                  </button>
                  <span className="grid h-full w-10 place-items-center border-x border-white/10 text-sm text-white">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                    className="grid h-full w-10 place-items-center text-zinc-300 transition hover:bg-white/5"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 lg:block">
                <span className="text-xs uppercase text-zinc-500 lg:hidden">Thành tiền</span>
                <span className="font-semibold text-[var(--color-accent)]">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onRemove(item.id)}
                aria-label={`Xóa ${item.name}`}
                className="justify-self-end text-zinc-400 transition hover:text-white"
              >
                <Trash2 className="size-4" />
              </button>
            </article>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-white/8 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-white/12 px-4 text-xs font-bold uppercase text-zinc-300 transition hover:border-white/25 hover:text-white"
          >
            <Trash2 className="size-4" />
            Xóa tất cả
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-white/12 px-4 text-xs font-bold uppercase text-zinc-300 transition hover:border-white/25 hover:text-white"
          >
            <RefreshCw className="size-4" />
            Cập nhật giỏ hàng
          </button>
        </div>
        <Link
          href="/#product"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/12 px-4 text-xs font-bold uppercase text-zinc-300 transition hover:border-white/25 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Tiếp tục mua hàng
        </Link>
      </div>
    </section>
  );
}

export default CartItemsPanel;
