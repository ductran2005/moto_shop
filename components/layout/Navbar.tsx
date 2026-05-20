"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { ProductCategory } from "@/content/productData";
import { createClient } from "@/lib/supabase/client";

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

interface NavbarUser {
  email: string | null;
  fullName: string | null;
}

export function Navbar({ user }: { user: NavbarUser | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [activeProductCategory, setActiveProductCategory] = useState<ProductCategory | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const accountMenuRef = useRef<HTMLDivElement>(null);

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
    const handlePointerDown = (event: PointerEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
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

  const accountLabel = user?.fullName || user?.email || "Tài khoản của tôi";

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setIsAccountOpen(false);
      router.push("/");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  }

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
                className={`group relative hidden h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:bg-white/10 hover:text-[var(--color-accent)] lg:flex ${
                  pathname === action.href ? "text-[var(--color-accent)]" : "text-white"
                }`}
                aria-label={action.label}
                title={action.label}
              >
                <Icon name={action.name} />
              </Link>
            ) : (
              <button
                key={action.name}
                type="button"
                className="group relative hidden h-10 w-10 items-center justify-center rounded-full text-white transition-all duration-200 hover:bg-white/10 hover:text-[var(--color-accent)] lg:flex"
                aria-label={action.label}
                title={action.label}
              >
                <Icon name={action.name} />
              </button>
            ),
          )}
          {user ? (
            <div ref={accountMenuRef} className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setIsAccountOpen((value) => !value)}
                className="group relative flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-accent)] transition-all duration-200 hover:bg-white/10"
                aria-label={accountLabel}
                aria-expanded={isAccountOpen}
                aria-haspopup="menu"
                title={accountLabel}
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--color-accent)] text-white">
                  <Icon name="user" />
                </span>
              </button>

              {isAccountOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-12 w-56 rounded-lg border border-white/10 bg-[var(--color-bg-secondary)] p-2 shadow-2xl"
                >
                  <div className="border-b border-white/10 px-3 py-2">
                    <p className="truncate text-sm font-semibold text-white">{user.fullName || "Người dùng"}</p>
                    {user.email ? <p className="truncate text-xs text-zinc-400">{user.email}</p> : null}
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="mt-2 flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                    role="menuitem"
                  >
                    {isSigningOut ? "Đang đăng xuất..." : "Đăng xuất"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className={`group relative hidden h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:bg-white/10 hover:text-[var(--color-accent)] lg:flex ${
                pathname === "/login" ? "text-[var(--color-accent)]" : "text-white"
              }`}
              aria-label={accountLabel}
              title={accountLabel}
            >
              <Icon name="user" />
            </Link>
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

            <div className="mt-3 grid gap-1 border-t border-white/10 pt-3">
              <button
                type="button"
                className="flex items-center gap-3 rounded px-3 py-3 text-sm font-bold uppercase text-white transition-colors hover:bg-white/5 hover:text-[var(--color-accent)]"
              >
                <Icon name="search" />
                <span>Tìm kiếm</span>
              </button>
              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded px-3 py-3 text-sm font-bold uppercase text-white transition-colors hover:bg-white/5 hover:text-[var(--color-accent)]"
              >
                <Icon name="cart" />
                <span>Giỏ hàng</span>
              </Link>
            </div>
          </nav>

          <div className="border-t border-white/10 px-4 py-4 md:px-6">
            {user ? (
              <div className="grid gap-3">
                <div>
                  <p className="truncate text-sm font-semibold text-white">{user.fullName || "Người dùng"}</p>
                  {user.email ? <p className="mt-1 truncate text-xs text-zinc-400">{user.email}</p> : null}
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="flex h-11 items-center justify-center rounded-md bg-white/10 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSigningOut ? "Đang đăng xuất..." : "Đăng xuất"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex h-11 items-center justify-center rounded-md bg-[var(--color-accent)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#c41a1f]"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex h-11 items-center justify-center rounded-md border border-white/15 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
