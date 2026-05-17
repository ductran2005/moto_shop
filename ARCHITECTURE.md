# ARCHITECTURE.md

## Tai lieu kien truc ky thuat chuan

*Next.js · TypeScript · Tailwind CSS*

Version 1.0 | Phien ban noi bo | **Bat buoc tuan thu cho moi landing page**

## 0. Muc tieu tai lieu

Tai lieu nay dinh nghia cau truc du an, quy uoc dat ten, tech stack, va workflow bat buoc cho toan bo landing page duoc ship boi team. Moi thanh vien (Intern, COO, Marketing) deu phai doc va tuan thu truoc khi bat dau bat ky task nao.

| Muc tieu | Chi tiet |
| :---- | :---- |
| Thong nhat codebase | Moi LP co cung cau truc thu muc, cung naming convention. |
| Tang toc onboarding | Intern moi co the clone template va ship LP trong ngay dau. |
| Giam bug sau deploy | Checklist ro rang, chuan hoa component, khong tai phat loi cu. |
| Do duoc output | Moi LP co tracking chuan ngay tu template. |

## 1. Tech Stack chinh thuc

**Day la bo cong nghe DUY NHAT duoc su dung. Khong them thu vien ngoai danh sach nay ma khong co phe duyet tu CTO.**

### 1.1 Core

| Cong nghe | Version | Muc dich | Ghi chu |
| :---- | :---- | :---- | :---- |
| Next.js | 14.x (App Router) | Framework chinh, routing, SSR/SSG | Dung App Router, KHONG dung Pages Router |
| TypeScript | 5.x | Type safety toan bo codebase | strict mode bat, khong dung any |
| Tailwind CSS | 3.x | Styling duy nhat | Khong viet CSS thuan ngoai globals.css |
| React | 18.x | UI library | Di kem Next.js, khong cai rieng |

### 1.2 UI Components & Icons

| Thu vien | Muc dich | Import pattern |
| :---- | :---- | :---- |
| shadcn/ui | Component library chuan (Button, Form, Dialog...) | `npx shadcn-ui add <component>` |
| Lucide React | Icon set duy nhat | `import { IconName } from 'lucide-react'` |
| clsx + tailwind-merge | Merge class Tailwind co dieu kien | `import { cn } from '@/lib/utils'` |

### 1.3 Form & Validation

| Thu vien | Muc dich |
| :---- | :---- |
| React Hook Form | Quan ly state form, validation |
| Zod | Schema validation type-safe |
| @hookform/resolvers | Ket noi Zod voi React Hook Form |

### 1.4 Analytics & Tracking

| Tool | Muc dich | Bat buoc? |
| :---- | :---- | :---- |
| Google Tag Manager | Container tracking tap trung | BAT BUOC moi LP |
| Google Analytics 4 | Page view, events, conversion | BAT BUOC moi LP |
| Meta Pixel | Retargeting Facebook Ads | Khi LP chay Meta Ads |
| Google Ads Tag | Conversion tracking Google Ads | Khi LP chay Google Ads |

### 1.5 Thu vien cam dung

| Cam | Ly do |
| :---- | :---- |
| jQuery | Khong can thiet voi React, tang bundle size |
| Bootstrap / Material UI | Xung dot voi Tailwind, style khong nhat quan |
| Moment.js | Bundle nang, dung date-fns hoac dayjs thay the |
| Axios (trong LP don gian) | Dung native fetch + React Query neu can |
| CSS Modules / Styled Components | Xung dot voi Tailwind, lam kho maintain |

## 2. Cau truc thu muc chuan

```text
project-name/
├── app/
│   ├── (landing)/
│   │   ├── [slug]/
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   ├── api/
│   ├── globals.css
│   ├── layout.tsx
│   └── not-found.tsx
├── components/
│   ├── ui/
│   ├── sections/
│   ├── forms/
│   └── layout/
├── lib/
│   ├── utils.ts
│   ├── analytics.ts
│   └── validations.ts
├── hooks/
│   ├── useFormSubmit.ts
│   └── useIntersectionObserver.ts
├── types/
│   ├── landing.ts
│   └── form.ts
├── public/
│   ├── images/
│   ├── fonts/
│   └── og/
├── content/
│   └── [slug].json
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── ARCHITECTURE.md
└── CHANGELOG.md
```

## 3. Naming Convention

| Doi tuong | Convention | Vi du dung | Vi du sai |
| :---- | :---- | :---- | :---- |
| File component | PascalCase.tsx | `HeroSection.tsx` | `hero-section.tsx` |
| File utility/hook | camelCase.ts | `useFormSubmit.ts` | `UseFormSubmit.ts` |
| Thu muc | kebab-case | `social-proof/` | `SocialProof/` |
| Route | kebab-case | `/san-pham-abc` | `/sanPhamAbc` |
| Component function | PascalCase | `function HeroSection()` | `function heroSection()` |
| Props interface | PascalCase + Props | `HeroSectionProps` | `heroProps` |
| Constant | SCREAMING_SNAKE_CASE | `MAX_FORM_FIELDS` | `maxFormFields` |
| Type/Interface | PascalCase | `LandingPageData` | `landingPageData` |
| CSS class | Chi dung Tailwind utilities | `className="flex gap-4"` | `className="my-custom-class"` |
| Bien moi truong | `NEXT_PUBLIC_` prefix neu public | `NEXT_PUBLIC_GTM_ID` | `GTM_ID` |

## 4. Component Pattern chuan

```tsx
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  headline: string;
  subheadline?: string;
  ctaText: string;
  ctaHref: string;
  className?: string;
}

export function HeroSection({
  headline,
  subheadline,
  ctaText,
  ctaHref,
  className,
}: HeroSectionProps) {
  return (
    <section className={cn("bg-white px-4 py-20", className)}>
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="text-4xl font-bold text-slate-900">{headline}</h1>
        {subheadline && <p className="mt-4 text-xl text-slate-600">{subheadline}</p>}
        <a href={ctaHref} className="mt-8 inline-block">
          {ctaText}
        </a>
      </div>
    </section>
  );
}

export default HeroSection;
```

Quy tac bat buoc:

| Quy tac | Mo ta |
| :---- | :---- |
| Khong dung `any` | TypeScript strict. Dung `unknown` va narrow type hoac generic. |
| Props destructure ngay parameter | Khong viet `props.headline`. |
| Server Component mac dinh | Chi them `"use client"` khi that su can. |
| Khong inline style | Chi dung Tailwind, dynamic value thi han che qua CSS variable. |
| Export named va default | Ho tro auto-import va dynamic import. |
| Khong hardcode text | Text dua vao props hoac `content/[slug].json`. |

Tracking events:

```ts
export function trackCTAClick(ctaLabel: string, location: string) {
  if (typeof window === "undefined") return;

  window.dataLayer?.push({
    event: "cta_click",
    cta_label: ctaLabel,
    cta_location: location,
    page_slug: window.location.pathname,
  });
}
```

## 5. Landing Page Template chuan

Moi LP moi phai duoc tao tu template, khong lam tu scratch. Entry point nam tai `app/(landing)/[slug]/page.tsx`, su dung `generateMetadata`, `notFound`, section components va content theo slug.

## 6. Environment Variables

File `.env.local` khong bao gio duoc commit. File `.env.example` phai luon duoc cap nhat.

```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_GOOGLE_ADS_ID=
FORM_SUBMIT_WEBHOOK_URL=
FORM_SUBMIT_SECRET=
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
ANALYZE=false
```

## 7. QA Checklist truoc khi Deploy

| # | Hang muc | Tieu chi cu the | Nguoi check |
| :---- | :---- | :---- | :---- |
| 1 | Scope & Content | Dung brief, du section, khong con placeholder | Owner LP |
| 2 | Responsive | Test 375px, 768px, 1280px | Owner LP |
| 3 | Lighthouse Score | Performance >= 80, Accessibility >= 90, Best Practices >= 90 | Owner LP |
| 4 | Form Submit | Webhook nhan lead, thank-you page hien | Owner LP |
| 5 | CTA Links | Khong co broken link, khong `href="#"` | Owner LP |
| 6 | GTM & GA4 | GTM inject, GA4 realtime co page view | Marketing lead |
| 7 | CTA Events | Co event `cta_click` trong GA4 DebugView | Marketing lead |
| 8 | Form Events | Co event `form_submit_success` | Marketing lead |
| 9 | SEO Tags | Title, description, H1, og:image, canonical dung | Owner LP |
| 10 | Image Alt | Moi anh co alt text mo ta | Owner LP |
| 11 | Console Errors | Khong co loi do | Owner LP |
| 12 | TypeScript | `npm run build` khong co TS error | Owner LP |
| 13 | Environment | Deploy dung moi truong | CTO |
| 14 | Handoff note | Co owner, ngay deploy, campaign name, follow-up | Owner LP |

## 8. Git Workflow

| Branch | Muc dich | Quy tac |
| :---- | :---- | :---- |
| `main` | Production | Chi merge qua PR |
| `develop` | Integration | Merge feature branch vao day truoc |
| `feature/LP-[slug]` | Tung landing page | Tao tu `develop` |
| `fix/[mo-ta-ngan]` | Bug fix | Tao tu `develop` |
| `chore/[mo-ta]` | Setup/config | Merge nhanh sau review CTO |

Commit format:

```text
feat(lp-san-pham-x): add hero section and lead form
fix(lp-san-pham-x): form submit khong gui webhook
chore: update tailwind config them custom colors
style(lp-san-pham-x): fix responsive mobile hero
track(lp-san-pham-x): add ga4 cta_click event
```

## 9. Performance Standards

| Metric | Target toi thieu |
| :---- | :---- |
| Lighthouse Performance | >= 80 |
| LCP | <= 2.5s |
| CLS | <= 0.1 |
| First Load JS | <= 150KB |
| Image format | WebP hoac AVIF |
| Hero image | <= 200KB |

Bat buoc voi images:

- Luon dung `next/image`
- Them `width`, `height`, `priority` cho hero image
- Them `loading="lazy"` cho anh duoi fold
- Alt text mo ta noi dung, khong de rong neu anh mang nghia

## 10. Daily Async Format

```text
Hom qua: [LP-slug] hoan thanh hero + benefits section
Hom nay: [LP-slug] lam form + tracking, estimate 4h
Link dang lam: https://github.com/.../feature/lp-slug
ETA deploy: Thu 5 18:00
Blocker: Khong co blocker.
```

## 11. Glossary

| Thuat ngu | Dinh nghia |
| :---- | :---- |
| LP / Landing Page | Trang dich de chuyen doi visitor thanh lead/customer |
| DoD | Checklist phai pass truoc khi tinh la hoan tat |
| GTM | Google Tag Manager |
| Brief | Tai lieu mo ta yeu cau LP |
| Slug | URL path cua LP |
| Component | UI block tai su dung |
| Section | Khoi noi dung trong LP |
| Server Component | Component render phia server |
| Client Component | Component co `"use client"` |
| WIP | Work In Progress |

Tai lieu nay do CTO so huu va phai duoc cap nhat moi khi co thay doi tech stack hoac quy trinh.

**Moi exception phai co phe duyet bang van ban tu CTO truoc khi ap dung.**
