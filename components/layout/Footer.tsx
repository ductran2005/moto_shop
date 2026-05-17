"use client";

import Image from "next/image";
import type { ProductCategory } from "@/content/productData";

const categoryLinks = [
  { label: "Xe máy", sectionId: "xe-may-products", category: "Xe Máy" },
  { label: "Dầu nhớt", sectionId: "dau-nhot-products", category: "Dầu Nhớt" },
  { label: "Phụ tùng", sectionId: "phu-tung-products", category: "Phụ Tùng" },
  { label: "Đồ chơi xe", sectionId: "do-choi-xe-products", category: "Đồ Chơi Xe" },
  { label: "Bảo dưỡng", sectionId: "bao-duong-products", category: "Chăm Sóc Xe" },
  { label: "Khuyến mãi", sectionId: "khuyen-mai-products", category: "Khuyến Mãi" },
] satisfies Array<{ label: string; sectionId: string; category: ProductCategory }>;
const exploreLinks = [
  { label: "Về chúng tôi", sectionId: "ve-chung-toi" },
  { label: "Kiến thức & Kinh nghiệm", sectionId: "kien-thuc-kinh-nghiem" },
  { label: "Sản phẩm nổi bật", sectionId: "best-sellers" },
  { label: "Ưu đãi hôm nay", sectionId: "khuyen-mai-products" },
];
const quickLinks = [
  { label: "Trang chủ", sectionId: "hero-section" },
  { label: "Xem sản phẩm", sectionId: "product" },
  { label: "Liên hệ", sectionId: "lien-he" },
  { label: "Hỗ trợ", sectionId: "ve-chung-toi" },
];
const socials = [
  { label: "Facebook", icon: "/images/social/facebook.svg" },
  { label: "YouTube", icon: "/images/social/youtube.svg" },
  { label: "Instagram", icon: "/images/social/instagram.svg" },
  { label: "TikTok", icon: "/images/social/tiktok.svg" },
];
const payments = ["VISA", "Mastercard", "ZaloPay", "VNPay"];

export function Footer() {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const selectProductCategory = (category: ProductCategory) => {
    window.dispatchEvent(new CustomEvent("product-category-select", { detail: { category } }));
  };

  return (
    <footer id="lien-he" className="scroll-mt-28 bg-[var(--color-bg-primary)] text-white">
      <div className="speed-container grid gap-10 border-b border-white/10 py-12 md:grid-cols-[1.35fr_0.8fr_0.9fr_1.2fr]">
        <div>
          <a
            href="#"
            className="mb-5 inline-flex h-[58px] w-[188px] items-center"
            aria-label="SpeedZone"
          >
            <Image
              src="/images/speedzone-logo.png"
              alt="SpeedZone"
              width={234}
              height={88}
              className="h-auto w-full object-contain"
            />
          </a>
          <p className="max-w-xs text-sm leading-7 text-zinc-400">
            SpeedZone cung cấp xe máy, dầu nhớt, phụ tùng và phụ kiện chính
            hãng. Đồng hành cùng bạn trên mọi hành trình!
          </p>
          <div className="mt-6 flex gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href="#"
                aria-label={social.label}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition-colors hover:bg-[var(--color-accent)]"
              >
                <Image src={social.icon} alt="" width={14} height={14} className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-heading mb-5 text-lg font-black uppercase">Danh Mục</h3>
          <div className="grid gap-3">
            {categoryLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => selectProductCategory(link.category)}
                className="text-left text-sm text-zinc-400 transition-colors hover:text-[var(--color-accent)]"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-heading mb-5 text-lg font-black uppercase">Khám Phá</h3>
          <div className="grid gap-3">
            {exploreLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => scrollToSection(link.sectionId)}
                className="text-left text-sm text-zinc-400 transition-colors hover:text-[var(--color-accent)]"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-heading mb-5 text-lg font-black uppercase">Liên Kết Nhanh</h3>
          <div className="grid gap-3">
            {quickLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => scrollToSection(link.sectionId)}
                className="text-left text-sm text-zinc-400 transition-colors hover:text-[var(--color-accent)]"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="speed-container flex flex-col items-center justify-between gap-5 py-6 text-sm text-zinc-500 md:flex-row">
        <p>© 2024 SpeedZone. All Rights Reserved.</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {payments.map((payment) => (
            <span
              key={payment}
              className="rounded border border-white/10 px-3 py-1 text-xs font-bold text-zinc-300"
            >
              {payment}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
