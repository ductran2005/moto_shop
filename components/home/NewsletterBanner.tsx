import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function NewsletterBanner() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-bg-primary)] py-7">
      <Image
        src="/images/ChatGPT Image 16_57_27 15 thg 5, 2026.png"
        alt="Xe máy thể thao trong banner đăng ký SpeedZone"
        fill
        sizes="100vw"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/35" />
      <div className="speed-container relative grid gap-8 md:grid-cols-[1fr_1.1fr] md:items-center lg:gap-12">
        <div>
          <h2 className="font-heading max-w-xl text-4xl font-black uppercase leading-tight text-white md:text-5xl">
            Đăng Ký Nhận Ưu Đãi & Tin Tức Mới Nhất
          </h2>
          <p className="mt-3 text-zinc-300">Nhận ngay voucher 100K cho đơn hàng đầu tiên</p>
        </div>
        <form className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Nhập email của bạn"
            className="h-12 flex-1 rounded-full border border-white/20 bg-black/55 px-6 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-[var(--color-accent)]"
          />
          <Button type="submit" className="h-12 rounded-full px-8">
            Đăng Ký Ngay
          </Button>
        </form>
      </div>
    </section>
  );
}

export default NewsletterBanner;
