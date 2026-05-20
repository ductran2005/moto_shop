import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ChevronLeft, PackageCheck } from "lucide-react";

import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Đặt hàng thành công | SpeedZone",
  description: "Đơn hàng của bạn đã được đặt thành công tại SpeedZone.",
};

type Props = {
  searchParams: Promise<{ code?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const orderCode = params.code ?? null;

  return (
    <main className="min-h-screen bg-[var(--color-bg-primary)] pt-20 text-white">
      <section className="speed-container flex min-h-[70vh] flex-col items-center justify-center py-7 text-center md:py-9">
        <div className="mx-auto max-w-lg">
          <div className="mx-auto mb-6 grid size-20 place-items-center rounded-full bg-emerald-400/10">
            <CheckCircle2 className="size-10 text-emerald-400" />
          </div>

          <h1 className="font-heading text-3xl font-black uppercase text-white md:text-4xl">
            Đặt hàng thành công!
          </h1>

          <p className="mt-4 text-sm leading-6 text-zinc-400">
            Cảm ơn bạn đã đặt hàng tại SpeedZone. Đơn hàng của bạn đang được xử lý
            và sẽ sớm được xác nhận.
          </p>

          {orderCode && (
            <div className="mt-6 inline-flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-6 py-4">
              <PackageCheck className="size-5 text-[var(--color-accent)]" />
              <div className="text-left">
                <p className="text-xs text-zinc-500">Mã đơn hàng</p>
                <p className="font-mono text-sm font-bold text-[var(--color-accent)]">
                  {orderCode}
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/"
              className="flex h-12 items-center justify-center gap-2 rounded-md bg-[var(--color-accent)] px-6 text-sm font-bold uppercase text-white transition hover:bg-[var(--color-accent-hover)]"
            >
              <ChevronLeft className="size-4" />
              Về trang chủ
            </Link>

            <Link
              href="/product"
              className="flex h-12 items-center justify-center gap-2 rounded-md border border-white/12 px-6 text-sm font-bold uppercase text-zinc-300 transition hover:border-white/25 hover:text-white"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
