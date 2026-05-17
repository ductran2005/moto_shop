"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import type { ProductCategory } from "@/content/productData";

const navLinks: Array<{ label: string; href: string; category?: ProductCategory; sectionId?: string }> = [
  { label: "Trang Chủ", href: "/" },
  { label: "Sản Phẩm", href: "/#product", sectionId: "product" },
  { label: "Về Chúng Tôi", href: "/#ve-chung-toi", sectionId: "ve-chung-toi" },
  {
    label: "Kiến Thức & Kinh Nghiệm",
    href: "/#kien-thuc-kinh-nghiem",
    sectionId: "kien-thuc-kinh-nghiem",
  },
];

const headerActions = [
  { name: "search", label: "Tìm kiếm sản phẩm" },
  { name: "user", label: "Tài khoản của tôi", href: "/login" },
  { name: "cart", label: "Giỏ hàng", href: "/cart" },
] as const;

function Icon({ name }: { name: "search" | "user" | "cart" | "menu" | "close" }) {
  const paths = {
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="5.75" />
        <path d="m15 15 4 4" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4.5 20c1.4-4 4-6 7.5-6s6.1 2 7.5 6" />
      </>
    ),
    cart: (
      <>
        <path d="M5 6h2l1.5 9h8.5l2-6H8" />
        <circle cx="10" cy="19" r="1.5" />
        <circle cx="17" cy="19" r="1.5" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12" />
        <path d="m18 6-12 12" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeProductCategory, setActiveProductCategory] = useState<ProductCategory | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleActiveCategory = (event: Event) => {
      const { category } = (event as CustomEvent<{ category: ProductCategory }>).detail;
      setActiveProductCategory(category);
      setActiveSectionId(null);
    };

    window.addEventListener("product-category-active", handleActiveCategory);
    return () => window.removeEventListener("product-category-active", handleActiveCategory);
  }, []);

  useEffect(() => {
    const observedSectionIds = ["product", "ve-chung-toi", "kien-thuc-kinh-nghiem"];
    const observedSections = observedSectionIds
      .map((sectionId) => document.getElementById(sectionId))
      .filter((section): section is HTMLElement => section !== null);
    if (observedSections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          setActiveSectionId(entry.target.id);
          setActiveProductCategory(null);
        });
      },
      {
        rootMargin: "-112px 0px -55% 0px",
        threshold: 0.1,
      },
    );

    observedSections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleProductNavClick = (event: MouseEvent<HTMLAnchorElement>, category?: ProductCategory) => {
    if (!category) return;

    event.preventDefault();
    window.dispatchEvent(new CustomEvent("product-category-select", { detail: { category } }));
  };

  const handleSectionNavClick = (event: MouseEvent<HTMLAnchorElement>, sectionId?: string) => {
    if (!sectionId) return;
    if (pathname !== "/") return;

    event.preventDefault();
    setActiveProductCategory(null);
    setActiveSectionId(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[var(--color-bg-primary)]/95 backdrop-blur">
      <div className="grid h-20 w-full grid-cols-[1fr_auto] items-center gap-4 px-4 md:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-12">
        <Link
          href="/"
          className="flex h-[58px] w-[146px] items-center justify-self-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
          aria-label="Về trang chủ SpeedZone"
        >
          <Image
            src="/images/speedzone-logo.png"
            alt="SpeedZone"
            width={264}
            height={128}
            preload
            unoptimized
            sizes="146px"
            className="h-auto w-full object-contain"
          />
        </Link>

        <nav className="hidden items-center justify-center gap-8 lg:flex" aria-label="Điều hướng chính">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/" && activeProductCategory === null && activeSectionId === null
                : link.sectionId
                  ? pathname === "/" && link.sectionId === activeSectionId
                  : link.category === activeProductCategory;

            return (
            <a
              key={link.label}
              href={link.href}
              onClick={(event) => {
                handleProductNavClick(event, link.category);
                handleSectionNavClick(event, link.sectionId);
              }}
              aria-current={isActive ? "page" : undefined}
              className={`group relative py-2 text-sm font-bold uppercase transition-colors ${
                isActive ? "text-[var(--color-accent)]" : "text-white hover:text-[var(--color-accent)]"
              }`}
            >
              {link.label}
              <span
                className={`absolute inset-x-0 -bottom-1 h-0.5 origin-left bg-[var(--color-accent)] transition-transform duration-300 ${
                  isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </a>
            );
          })}
        </nav>

        <div className="flex items-center justify-self-end gap-1.5">
          {headerActions.map((action) =>
            "href" in action ? (
              <Link
                key={action.name}
                href={action.href}
                className={`group relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:bg-white/10 hover:text-[var(--color-accent)] ${
                  pathname === action.href ? "text-[var(--color-accent)]" : "text-white"
                }`}
                aria-label={action.label}
                title={action.label}
              >
                <Icon name={action.name} />
                {action.name === "cart" && (
                  <span className="absolute right-0.5 top-0.5 grid h-4 w-4 place-items-center rounded-full bg-[var(--color-accent)] text-[10px] font-bold text-white ring-2 ring-[var(--color-bg-primary)]">
                    3
                  </span>
                )}
              </Link>
            ) : (
              <button
                key={action.name}
                type="button"
                className="group relative hidden h-10 w-10 items-center justify-center rounded-full text-white transition-all duration-200 hover:bg-white/10 hover:text-[var(--color-accent)] sm:flex"
                aria-label={action.label}
                title={action.label}
              >
                <Icon name={action.name} />
              </button>
            ),
          )}
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-white transition-all duration-200 hover:bg-white/10 hover:text-[var(--color-accent)] lg:hidden"
            onClick={() => setIsOpen((value) => !value)}
            aria-label={isOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            <Icon name={isOpen ? "close" : "menu"} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div id="mobile-navigation" className="border-t border-white/10 bg-[var(--color-bg-secondary)] lg:hidden">
          <nav className="grid gap-1 px-4 py-4 md:px-6" aria-label="Điều hướng di động">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded px-3 py-3 text-sm font-bold uppercase text-white transition-colors hover:bg-white/5 hover:text-[var(--color-accent)]"
                onClick={(event) => {
                  handleProductNavClick(event, link.category);
                  handleSectionNavClick(event, link.sectionId);
                  setIsOpen(false);
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
