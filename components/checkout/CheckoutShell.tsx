"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BadgeCheck,
  Banknote,
  ChevronLeft,
  CreditCard,
  Loader2,
  MapPin,
  PackageCheck,
  Scan,
  ShieldCheck,
  Truck,
  WalletCards,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { CartItem } from "@/types/cart";
import { SePayPayment } from "./SePayPayment";
import { readGuestCart, clearGuestCart } from "@/lib/guest-cart";
import { createClient } from "@/lib/supabase/client";

interface CheckoutShellProps {
  initialItems: CartItem[];
}

const paymentMethods = [
  {
    id: "cod",
    label: "Thanh toán khi nhận hàng",
    description: "Kiểm tra sản phẩm trước khi thanh toán.",
    icon: Banknote,
  },
  {
    id: "sepay",
    label: "SePay - Chuyển khoản tự động",
    description: "Quét QR thanh toán, xác nhận tự động trong 1-2 phút.",
    icon: Scan,
  },
];

const shippingOptions = [
  {
    id: "standard",
    label: "Giao tiêu chuẩn",
    description: "2-4 ngày làm việc",
    price: 0,
  },
  {
    id: "express",
    label: "Giao nhanh",
    description: "Trong 24 giờ tại nội thành",
    price: 120_000,
  },
];

function formatCurrency(value: number) {
  return `${value.toLocaleString("vi-VN")}đ`;
}

// --- Form state type ---
interface FormState {
  fullName: string;
  phone: string;
  address: string;
  note: string;
}

// --- Order submission state ---
type OrderPhase =
  | "form" // Chưa submit
  | "submitting" // Đang submit
  | "sepay_pending" // Đã tạo đơn SePay, chờ thanh toán
  | "success"; // Hoàn tất

interface OrderResult {
  orderId: string;
  orderCode: string;
  qrImage: string | null;
  amount: number;
}

export function CheckoutShell({ initialItems }: CheckoutShellProps) {
  const [items, setItems] = useState(initialItems);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].id);
  const [shippingOption, setShippingOption] = useState(shippingOptions[0].id);
  const [form, setForm] = useState<FormState>({
    fullName: "",
    phone: "",
    address: "",
    note: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [phase, setPhase] = useState<OrderPhase>("form");
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load guest cart if initialItems is empty
  useEffect(() => {
    if (initialItems.length > 0) return;

    const timeoutId = window.setTimeout(() => {
      setItems(readGuestCart());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [initialItems.length]);

  const searchParams = useSearchParams();
  const couponCode = searchParams.get("coupon")?.toUpperCase() ?? "";

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const discount = useMemo(() => {
    if (subtotal <= 0) return 0;
    if (couponCode === "SPEEDZONE") {
      return Math.min(Math.round(subtotal * 0.1), 1000000);
    }
    if (couponCode === "MOTO100") {
      return Math.min(subtotal, 100000);
    }
    return 0;
  }, [subtotal, couponCode]);

  const shippingFee =
    shippingOptions.find((option) => option.id === shippingOption)?.price ?? 0;
  const total = Math.max(subtotal - discount + shippingFee, 0);

  // Validate form
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof FormState, string>> = {};

    if (!form.fullName.trim()) {
      errors.fullName = "Vui lòng nhập họ và tên.";
    }
    if (!form.phone.trim()) {
      errors.phone = "Vui lòng nhập số điện thoại.";
    } else if (!/^(0|\+84)[3-9]\d{8}$/.test(form.phone.replace(/\s/g, ""))) {
      errors.phone = "Số điện thoại không hợp lệ.";
    }
    if (!form.address.trim()) {
      errors.address = "Vui lòng nhập địa chỉ giao hàng.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form field change
  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Handle order submission
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setPhase("submitting");
    setSubmitError(null);

    try {
      const cartItems = items.map((item) => ({
        id: item.id,
        name: item.name,
        variant: item.variant,
        detail: item.detail,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
      }));

      const res = await fetch("/api/sepay/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod,
          subtotal,
          discount,
          shippingFee,
          total,
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          note: form.note.trim(),
          shippingOption,
          items: cartItems,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Không thể tạo đơn hàng.");
      }

      setOrderResult({
        orderId: data.orderId,
        orderCode: data.orderCode,
        qrImage: data.qrImage ?? null,
        amount: data.amount ?? total,
      });

      // Clear cart on successful order creation
      const itemIds = items.map((item) => item.id);
      const guestIds = itemIds.filter((id) => id.startsWith("guest:"));
      const dbIds = itemIds.filter((id) => !id.startsWith("guest:"));

      if (guestIds.length > 0) {
        clearGuestCart();
      }

      if (dbIds.length > 0) {
        const supabase = createClient();
        await supabase.from("cart_items").delete().in("id", dbIds);
      }

      if (paymentMethod === "sepay") {
        setPhase("sepay_pending");
      } else {
        // COD, bank, wallet -> go to success page
        window.location.href = `/checkout/success?code=${data.orderCode}`;
      }
    } catch (error) {
      console.error("Order submission error:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Lỗi kết nối. Vui lòng thử lại.",
      );
      setPhase("form");
    }
  };

  // Handle SePay payment success
  const handleSePaySuccess = () => {
    setPhase("success");
  };

  // --- RENDER ---

  // Phase: SePay payment pending
  if (phase === "sepay_pending" && orderResult) {
    return (
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.65fr)]">
        <div className="grid gap-5">
          {/* Payment section - SePay */}
          <section className="rounded-lg border border-white/8 bg-white/[0.025] p-5 md:p-6">
            <div className="mb-5 flex items-center gap-3 border-b border-white/8 pb-5">
              <span className="grid size-10 place-items-center rounded-md bg-[var(--color-accent)]/12 text-[var(--color-accent)]">
                <Scan className="size-5" />
              </span>
              <div>
                <h2 className="text-sm font-bold uppercase text-white">
                  Thanh toán SePay
                </h2>
                <p className="mt-1 text-xs text-zinc-400">
                  Quét mã QR hoặc chuyển khoản để hoàn tất đơn hàng.
                </p>
              </div>
            </div>

            <SePayPayment
              orderCode={orderResult.orderCode}
              qrImage={orderResult.qrImage}
              amount={orderResult.amount}
              onSuccess={handleSePaySuccess}
              onError={(error) => setSubmitError(error)}
            />
          </section>
        </div>

        {/* Order summary sidebar */}
        <OrderSidebar
          items={items}
          subtotal={subtotal}
          discount={discount}
          shippingFee={shippingFee}
          total={total}
          itemCount={itemCount}
        />
      </div>
    );
  }

  // Phase: Success
  if (phase === "success" && orderResult) {
    return (
      <div className="mx-auto max-w-lg py-10 text-center">
        <div className="mx-auto mb-6 grid size-20 place-items-center rounded-full bg-emerald-400/10">
          <ShieldCheck className="size-10 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">
          Thanh toán thành công!
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Đơn hàng {orderResult.orderCode} đã được xác nhận.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/"
            className="flex h-12 items-center justify-center gap-2 rounded-md bg-[var(--color-accent)] px-6 text-sm font-bold uppercase text-white transition hover:bg-[var(--color-accent-hover)]"
          >
            Về trang chủ
          </Link>
          <Link
            href={`/checkout/success?code=${orderResult.orderCode}`}
            className="flex h-12 items-center justify-center gap-2 rounded-md border border-white/12 px-6 text-sm font-bold uppercase text-zinc-300 transition hover:border-white/25 hover:text-white"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    );
  }

  // Phase: Form (default view)
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.65fr)]">
      {/* Left column - Form */}
      <div className="grid gap-5">
        {/* Shipping info */}
        <section className="rounded-lg border border-white/8 bg-white/[0.025] p-5 md:p-6">
          <div className="flex items-center gap-3 border-b border-white/8 pb-5">
            <span className="grid size-10 place-items-center rounded-md bg-[var(--color-accent)]/12 text-[var(--color-accent)]">
              <MapPin className="size-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold uppercase text-white">Thông tin nhận hàng</h2>
              <p className="mt-1 text-xs text-zinc-400">SpeedZone sẽ dùng thông tin này để xác nhận đơn.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm">
              <span className="font-medium text-zinc-300">
                Họ và tên <span className="text-red-400">*</span>
              </span>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                className={`h-12 rounded-md border bg-black/25 px-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-[var(--color-accent)] ${
                  formErrors.fullName ? "border-red-400" : "border-white/10"
                }`}
              />
              {formErrors.fullName && (
                <span className="text-xs text-red-400">{formErrors.fullName}</span>
              )}
            </label>
            <label className="grid gap-2 text-sm">
              <span className="font-medium text-zinc-300">
                Số điện thoại <span className="text-red-400">*</span>
              </span>
              <input
                type="tel"
                placeholder="0901 234 567"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className={`h-12 rounded-md border bg-black/25 px-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-[var(--color-accent)] ${
                  formErrors.phone ? "border-red-400" : "border-white/10"
                }`}
              />
              {formErrors.phone && (
                <span className="text-xs text-red-400">{formErrors.phone}</span>
              )}
            </label>
            <label className="grid gap-2 text-sm md:col-span-2">
              <span className="font-medium text-zinc-300">
                Địa chỉ giao hàng <span className="text-red-400">*</span>
              </span>
              <input
                type="text"
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành"
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                className={`h-12 rounded-md border bg-black/25 px-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-[var(--color-accent)] ${
                  formErrors.address ? "border-red-400" : "border-white/10"
                }`}
              />
              {formErrors.address && (
                <span className="text-xs text-red-400">{formErrors.address}</span>
              )}
            </label>
            <label className="grid gap-2 text-sm md:col-span-2">
              <span className="font-medium text-zinc-300">Ghi chú đơn hàng</span>
              <textarea
                rows={4}
                placeholder="Thời gian nhận hàng, yêu cầu kiểm tra hoặc lắp đặt..."
                value={form.note}
                onChange={(e) => updateField("note", e.target.value)}
                className="resize-none rounded-md border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-[var(--color-accent)]"
              />
            </label>
          </div>
        </section>

        {/* Shipping options */}
        <section className="rounded-lg border border-white/8 bg-white/[0.025] p-5 md:p-6">
          <div className="flex items-center gap-3 border-b border-white/8 pb-5">
            <span className="grid size-10 place-items-center rounded-md bg-[var(--color-accent)]/12 text-[var(--color-accent)]">
              <Truck className="size-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold uppercase text-white">Vận chuyển</h2>
              <p className="mt-1 text-xs text-zinc-400">Chọn tốc độ giao hàng phù hợp với nhu cầu.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {shippingOptions.map((option) => {
              const isSelected = shippingOption === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setShippingOption(option.id)}
                  className={`flex items-start justify-between gap-4 rounded-md border p-4 text-left transition ${
                    isSelected
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                      : "border-white/10 bg-black/20 hover:border-white/20"
                  }`}
                >
                  <span>
                    <span className="block text-sm font-bold text-white">{option.label}</span>
                    <span className="mt-1 block text-xs text-zinc-400">{option.description}</span>
                  </span>
                  <span className="shrink-0 text-sm font-bold text-[var(--color-accent)]">
                    {option.price === 0 ? "Miễn phí" : formatCurrency(option.price)}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Payment methods */}
        <section className="rounded-lg border border-white/8 bg-white/[0.025] p-5 md:p-6">
          <div className="flex items-center gap-3 border-b border-white/8 pb-5">
            <span className="grid size-10 place-items-center rounded-md bg-[var(--color-accent)]/12 text-[var(--color-accent)]">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold uppercase text-white">Phương thức thanh toán</h2>
              <p className="mt-1 text-xs text-zinc-400">Thông tin thanh toán được bảo mật khi xử lý đơn hàng.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {paymentMethods.map(({ id, label, description, icon: Icon }) => {
              const isSelected = paymentMethod === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPaymentMethod(id)}
                  className={`flex items-center gap-4 rounded-md border p-4 text-left transition ${
                    isSelected
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                      : "border-white/10 bg-black/20 hover:border-white/20"
                  }`}
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-md bg-white/5 text-zinc-200">
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-white">{label}</span>
                    <span className="mt-1 block text-xs text-zinc-400">{description}</span>
                  </span>
                  {isSelected ? <BadgeCheck className="size-5 shrink-0 text-[var(--color-accent)]" /> : null}
                </button>
              );
            })}
          </div>

          {/* SePay info hint */}
          {paymentMethod === "sepay" && (
            <div className="mt-4 rounded-md border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 p-3 text-xs text-zinc-400">
              <p className="font-medium text-[var(--color-accent)]">
                💳 Thanh toán SePay
              </p>
              <p className="mt-1">
                Sau khi đặt hàng, bạn sẽ thấy mã QR để quét thanh toán.
                Hệ thống tự động xác nhận đơn ngay khi nhận được tiền (thường 1-2 phút).
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Right column - Order summary */}
      <aside className="h-fit rounded-lg border border-white/8 bg-white/[0.025] p-5 md:p-6 xl:sticky xl:top-24">
        <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-5">
          <div>
            <h2 className="text-sm font-bold uppercase text-white">Đơn hàng của bạn</h2>
            <p className="mt-1 text-xs text-zinc-400">{itemCount} sản phẩm đang chờ xác nhận</p>
          </div>
          <PackageCheck className="size-6 text-[var(--color-accent)]" />
        </div>

        <div className="mt-5 grid gap-4">
          {items.map((item) => (
            <article key={item.id} className="flex gap-3">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-white/[0.04]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="64px"
                  className="object-contain p-2"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-white">{item.name}</h3>
                <p className="mt-1 text-xs text-zinc-500">{item.quantity} x {formatCurrency(item.price)}</p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-[var(--color-accent)]">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-4 border-y border-white/8 py-5 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-zinc-400">Tạm tính</span>
            <span className="font-semibold text-white">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-zinc-400">Giảm giá</span>
            <span className="font-semibold text-[var(--color-accent)]">- {formatCurrency(discount)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-zinc-400">Vận chuyển</span>
            <span className="font-semibold text-white">
              {shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee)}
            </span>
          </div>
        </div>

        <div className="mt-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase text-white">Tổng thanh toán</p>
            <p className="mt-1 text-xs text-zinc-500">Đã bao gồm VAT</p>
          </div>
          <p className="text-2xl font-bold text-[var(--color-accent)]">{formatCurrency(total)}</p>
        </div>

        {/* Submit error */}
        {submitError && (
          <div className="mt-4 rounded-md border border-red-400/20 bg-red-400/10 p-3 text-xs text-red-300">
            {submitError}
          </div>
        )}

        <button
          type="button"
          disabled={phase === "submitting"}
          onClick={handlePlaceOrder}
          className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[var(--color-accent)] text-sm font-bold uppercase text-white transition hover:bg-[var(--color-accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {phase === "submitting" ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              <ShieldCheck className="size-4" />
              {paymentMethod === "sepay" ? "Đặt hàng & thanh toán" : "Đặt hàng"}
            </>
          )}
        </button>

        <Link
          href="/cart"
          className="mt-3 flex h-11 items-center justify-center gap-2 rounded-md border border-white/12 text-sm font-bold uppercase text-zinc-300 transition hover:border-white/25 hover:text-white"
        >
          <ChevronLeft className="size-4" />
          Quay lại giỏ hàng
        </Link>
      </aside>
    </div>
  );
}

// --- Order sidebar sub-component ---
function OrderSidebar({
  items,
  subtotal,
  discount,
  shippingFee,
  total,
  itemCount,
}: {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  itemCount: number;
}) {
  return (
    <aside className="h-fit rounded-lg border border-white/8 bg-white/[0.025] p-5 md:p-6 xl:sticky xl:top-24">
      <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-5">
        <div>
          <h2 className="text-sm font-bold uppercase text-white">Đơn hàng của bạn</h2>
          <p className="mt-1 text-xs text-zinc-400">{itemCount} sản phẩm</p>
        </div>
        <PackageCheck className="size-6 text-[var(--color-accent)]" />
      </div>

      <div className="mt-5 grid gap-4">
        {items.map((item) => (
          <article key={item.id} className="flex gap-3">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-white/[0.04]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="64px"
                className="object-contain p-2"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-white">{item.name}</h3>
              <p className="mt-1 text-xs text-zinc-500">{item.quantity} x {formatCurrency(item.price)}</p>
            </div>
            <p className="shrink-0 text-sm font-semibold text-[var(--color-accent)]">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-4 border-y border-white/8 py-5 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-zinc-400">Tạm tính</span>
          <span className="font-semibold text-white">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-zinc-400">Giảm giá</span>
          <span className="font-semibold text-[var(--color-accent)]">- {formatCurrency(discount)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-zinc-400">Vận chuyển</span>
          <span className="font-semibold text-white">
            {shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee)}
          </span>
        </div>
      </div>

      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase text-white">Tổng thanh toán</p>
          <p className="mt-1 text-xs text-zinc-500">Đã bao gồm VAT</p>
        </div>
        <p className="text-2xl font-bold text-[var(--color-accent)]">{formatCurrency(total)}</p>
      </div>
    </aside>
  );
}

export default CheckoutShell;
