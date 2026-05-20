"use client";

import Link from "next/link";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

import type { CartItem } from "@/types/cart";

interface OrderSummaryProps {
  items: CartItem[];
}

function formatCurrency(value: number) {
  return `${value.toLocaleString("vi-VN")}đ`;
}

export function OrderSummary({ items }: OrderSummaryProps) {
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );
  const total = Math.max(subtotal - discount, 0);
  const itemCount = items.reduce((totalCount, item) => totalCount + item.quantity, 0);

  function handleApplyCoupon() {
    setCouponError("");
    setCouponSuccess("");
    
    if (!coupon.trim()) {
      setCouponError("Vui lòng nhập mã giảm giá.");
      setAppliedCoupon("");
      return;
    }

    const code = coupon.trim().toUpperCase();
    if (code === "SPEEDZONE") {
      const calculatedDiscount = Math.min(Math.round(subtotal * 0.1), 1000000);
      setDiscount(calculatedDiscount);
      setAppliedCoupon("SPEEDZONE");
      setCouponSuccess(`Áp dụng mã SPEEDZONE thành công! Giảm ${calculatedDiscount.toLocaleString("vi-VN")}đ (10%)`);
    } else if (code === "MOTO100") {
      const calculatedDiscount = Math.min(subtotal, 100000);
      setDiscount(calculatedDiscount);
      setAppliedCoupon("MOTO100");
      setCouponSuccess("Áp dụng mã MOTO100 thành công! Giảm 100.000đ");
    } else {
      setCouponError("Mã giảm giá không tồn tại hoặc đã hết hạn.");
      setDiscount(0);
      setAppliedCoupon("");
    }
  }

  return (
    <aside className="rounded-lg border border-white/8 bg-white/[0.025] p-6">
      <h2 className="text-sm font-bold uppercase text-white">Tóm tắt đơn hàng</h2>

      <div className="mt-8 grid gap-5 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-zinc-400">Tạm tính ({itemCount} sản phẩm)</span>
          <span className="font-semibold text-white">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-zinc-400">Giảm giá</span>
          <span className="font-semibold text-[var(--color-accent)]">- {formatCurrency(discount)}</span>
        </div>
      </div>

      <div className="mt-7">
        <div className="flex gap-2 rounded-md border border-white/10 p-1.5">
          <input
            value={coupon}
            onChange={(event) => setCoupon(event.target.value)}
            placeholder="Nhập mã giảm giá (e.g. SPEEDZONE)"
            className="h-10 min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-zinc-500"
          />
          <button
            type="button"
            onClick={handleApplyCoupon}
            className="rounded-md border border-white/10 px-4 text-xs font-bold uppercase text-zinc-300 transition hover:border-white/20 hover:text-white"
          >
            Áp dụng
          </button>
        </div>
        {couponError && (
          <p className="mt-2 text-xs text-red-400">{couponError}</p>
        )}
        {couponSuccess && (
          <p className="mt-2 text-xs text-emerald-400">{couponSuccess}</p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-b border-white/8 pb-6 text-sm">
        <span className="text-zinc-400">Phí vận chuyển</span>
        <span className="font-semibold text-emerald-400">Miễn phí</span>
      </div>

      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase text-white">Tổng cộng</p>
          <p className="mt-1 text-xs text-zinc-500">(Đã bao gồm VAT)</p>
        </div>
        <p className="text-2xl font-bold text-[var(--color-accent)]">{formatCurrency(total)}</p>
      </div>

      <Link
        href={appliedCoupon ? `/checkout?coupon=${appliedCoupon}` : "/checkout"}
        className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[var(--color-accent)] text-sm font-bold uppercase text-white transition hover:bg-[var(--color-accent-hover)]"
      >
        <LockKeyhole className="size-4" />
        Tiến hành thanh toán
      </Link>

      <div className="mt-7 flex items-start gap-4">
        <ShieldCheck className="mt-0.5 size-7 shrink-0 text-emerald-400" />
        <div>
          <p className="text-sm font-medium text-white">Thanh toán 100% an toàn</p>
          <p className="mt-1 text-xs text-zinc-400">Cam kết bảo mật thông tin tuyệt đối</p>
        </div>
      </div>
    </aside>
  );
}

export default OrderSummary;
