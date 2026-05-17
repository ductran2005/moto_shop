import { Button } from "@/components/ui/Button";

export function HeroBanner() {
  return (
    <section id="hero-section" className="scroll-mt-28 relative isolate h-[100svh] min-h-[720px] overflow-hidden bg-[var(--color-bg-primary)]">
      <div className="absolute inset-0 bg-[url('/images/3919b023-ea89-4ffb-aa71-ebff8d7d94da.png')] bg-cover bg-center bg-no-repeat" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0.84)_0%,rgba(10,10,10,0.58)_34%,rgba(10,10,10,0.12)_62%,rgba(10,10,10,0.08)_100%)]" />

      <div className="relative z-10 flex h-full w-full items-center px-4 pb-28 pt-10 md:px-6 lg:pl-[15%] lg:pr-12 lg:pb-32">
        <div className="max-w-[720px]">
          <p className="mb-5 inline-flex border-l-2 border-[var(--color-accent)] pl-4 text-xs font-bold uppercase tracking-[0.38em] text-zinc-300">
            Ride · Protect · Perform
          </p>
          <h1 className="font-heading text-[clamp(3.5rem,6vw,6.5rem)] font-black uppercase leading-[0.88] text-white">
            Bứt Tốc
            <span className="block text-[var(--color-accent)]">Mọi Giới Hạn</span>
          </h1>
          <p className="mt-6 max-w-xl text-sm font-medium leading-7 text-zinc-200 md:text-base lg:text-lg">
            Xe chất, nhớt xịn, phụ kiện đỉnh. Tất cả cho một trải nghiệm lái mạnh mẽ, chính xác và đầy khí chất.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="#product">Khám Phá Ngay</Button>
            <Button href="#product" variant="outline">
              Xem Sản Phẩm
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
