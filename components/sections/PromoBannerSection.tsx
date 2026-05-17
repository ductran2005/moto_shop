function OilProductsArt() {
  return (
    <svg viewBox="0 0 240 150" fill="none" className="h-full w-full" aria-hidden="true">
      <rect x="127" y="44" width="34" height="72" rx="4" fill="#111113" stroke="#2d2d31" />
      <rect x="172" y="30" width="26" height="86" rx="4" fill="#17171a" stroke="#34343a" />
      <rect x="133" y="58" width="22" height="26" fill="#d71920" />
      <rect x="177" y="47" width="16" height="30" fill="#d71920" />
      <rect x="134" y="40" width="20" height="6" rx="2" fill="#d71920" />
      <rect x="180" y="23" width="10" height="7" rx="2" fill="#d71920" />
      <path d="M77 117c25-13 43-17 61-17" stroke="#2b2b31" />
    </svg>
  );
}

function ScooterArt() {
  return (
    <svg viewBox="0 0 290 170" fill="none" className="h-full w-full" aria-hidden="true">
      <circle cx="178" cy="124" r="20" stroke="#111113" strokeWidth="8" />
      <circle cx="225" cy="124" r="20" stroke="#111113" strokeWidth="8" />
      <path d="M155 119h48l-17-38h-28l-18 22" stroke="#111113" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M184 80h28l18 43" stroke="#111113" strokeWidth="10" strokeLinecap="round" />
      <path d="M197 78c7-16 18-25 31-28" stroke="#ff2738" strokeWidth="6" strokeLinecap="round" />
      <path d="M131 132c13-42 38-72 76-88" stroke="#ff2738" strokeOpacity="0.65" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

function PartsArt() {
  return (
    <svg viewBox="0 0 250 160" fill="none" className="h-full w-full" aria-hidden="true">
      <circle cx="166" cy="88" r="28" stroke="#202024" strokeWidth="14" />
      <circle cx="166" cy="88" r="10" stroke="#b7b7bc" strokeWidth="4" />
      <circle cx="205" cy="107" r="20" stroke="#252529" strokeWidth="10" />
      <circle cx="205" cy="107" r="7" stroke="#b7b7bc" strokeWidth="3" />
      <path d="M115 124 92 92l16-11 22 32-15 11Z" fill="#1b1b1f" stroke="#56565d" />
      <path d="m110 80 8-34 13 3-8 34" stroke="#d71920" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

export function PromoBannerSection() {
  return (
    <div className="grid auto-rows-[198px] grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-[1fr_1.28fr_1fr]">
      <article className="relative h-full overflow-hidden rounded-lg bg-[#18181b] p-5 text-white shadow-[0_10px_22px_rgba(0,0,0,0.14)]">
        <div className="relative z-10 flex h-full flex-col items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase">Dầu nhớt chính hãng</p>
            <h2 className="mt-2 font-heading text-[25px] font-black uppercase leading-[0.9]">Bảo vệ tối ưu</h2>
            <p className="mt-1 text-[10px] font-semibold uppercase text-zinc-300">Vận hành êm ái</p>
            <p className="mt-3 font-heading text-[31px] font-black leading-none text-[var(--color-accent)]">-20%</p>
          </div>
          <a href="#" className="inline-flex h-7 items-center border border-white/35 px-3 text-[9px] font-bold uppercase text-white">
            Mua ngay
          </a>
        </div>
        <div className="absolute inset-y-0 right-0 w-[48%]">
          <OilProductsArt />
        </div>
      </article>

      <article className="relative h-full overflow-hidden rounded-lg bg-[#18181b] p-5 text-white shadow-[0_10px_22px_rgba(0,0,0,0.14)] md:col-span-2 lg:col-span-1">
        <div className="relative z-10 flex h-full flex-col items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase">Trả góp dễ dàng</p>
            <h2 className="mt-2 font-heading text-[29px] font-black uppercase leading-none">Lãi suất 0%</h2>
            <p className="mt-2 text-[10px] font-semibold uppercase text-zinc-300">Thủ tục nhanh gọn</p>
          </div>
          <a href="#" className="inline-flex h-7 items-center bg-[var(--color-accent)] px-3 text-[9px] font-bold uppercase text-white">
            Xem xe ngay
          </a>
        </div>
        <div className="absolute bottom-0 right-0 h-[144px] w-[55%]">
          <ScooterArt />
        </div>
      </article>

      <article className="relative h-full overflow-hidden rounded-lg bg-[#18181b] p-5 text-white shadow-[0_10px_22px_rgba(0,0,0,0.14)]">
        <div className="relative z-10 flex h-full flex-col items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase">Phụ tùng chính hãng</p>
            <h2 className="mt-2 font-heading text-[24px] font-black uppercase leading-[0.92]">An toàn bền bỉ</h2>
            <p className="mt-1 text-[10px] font-semibold uppercase text-zinc-300">Độ bền vượt trội</p>
          </div>
          <a href="#" className="inline-flex h-7 items-center bg-[var(--color-accent)] px-3 text-[9px] font-bold uppercase text-white">
            Khám phá
          </a>
        </div>
        <div className="absolute inset-y-0 right-0 w-[48%]">
          <PartsArt />
        </div>
      </article>
    </div>
  );
}

export default PromoBannerSection;
