**ARCHITECTURE.md**

Tài liệu kiến trúc kỹ thuật chuẩn

*Next.js · TypeScript · Tailwind CSS*

Version 1.0  |  Phiên bản nội bộ  |  **Bắt buộc tuân thủ cho mọi landing page**

**0\. Mục tiêu tài liệu**

Tài liệu này định nghĩa cấu trúc dự án, quy ước đặt tên, tech stack, và workflow bắt buộc cho toàn bộ landing page được ship bởi team. Mọi thành viên (Intern, COO, Marketing) đều phải đọc và tuân thủ trước khi bắt đầu bất kỳ task nào.

| Mục tiêu | Chi tiết |
| :---- | :---- |
| Thống nhất codebase | Mọi LP có cùng cấu trúc thư mục, cùng naming convention. |
| Tăng tốc onboarding | Intern mới có thể clone template và ship LP trong ngày đầu. |
| Giảm bug sau deploy | Checklist rõ ràng, chuẩn hóa component, không tái phát lỗi cũ. |
| Đo được output | Mỗi LP có tracking chuẩn ngay từ template. |

**1\. Tech Stack chính thức**

**Đây là bộ công nghệ DUY NHẤT được sử dụng. Không thêm thư viện ngoài danh sách này mà không có phê duyệt từ CTO.**

**1.1 Core**

| Công nghệ | Version | Mục đích | Ghi chú |
| :---- | :---- | :---- | :---- |
| Next.js | 14.x (App Router) | Framework chính, routing, SSR/SSG | Dùng App Router, KHÔNG dùng Pages Router |
| TypeScript | 5.x | Type safety toàn bộ codebase | strict mode bật, không dùng any |
| Tailwind CSS | 3.x | Styling duy nhất | Không viết CSS thuần ngoài globals.css |
| React | 18.x | UI library | Đi kèm Next.js, không cài riêng |

**1.2 UI Components & Icons**

| Thư viện | Mục đích | Import pattern |
| :---- | :---- | :---- |
| shadcn/ui | Component library chuẩn (Button, Form, Dialog…) | npx shadcn-ui add \<component\> |
| Lucide React | Icon set duy nhất | import { IconName } from 'lucide-react' |
| clsx \+ tailwind-merge | Merge class Tailwind có điều kiện | import { cn } from '@/lib/utils' |

**1.3 Form & Validation**

| Thư viện | Mục đích |
| :---- | :---- |
| React Hook Form | Quản lý state form, validation |
| Zod | Schema validation type-safe |
| @hookform/resolvers | Kết nối Zod với React Hook Form |

**1.4 Analytics & Tracking**

| Tool | Mục đích | Bắt buộc? |
| :---- | :---- | :---- |
| Google Tag Manager | Container tracking tập trung | BẮT BUỘC mọi LP |
| Google Analytics 4 | Page view, events, conversion | BẮT BUỘC mọi LP |
| Meta Pixel | Retargeting Facebook Ads | Khi LP chạy Meta Ads |
| Google Ads Tag | Conversion tracking Google Ads | Khi LP chạy Google Ads |

**1.5 Thư viện cấm dùng (không có phê duyệt CTO)**

| Cấm | Lý do |
| :---- | :---- |
| jQuery | Không cần thiết với React, tăng bundle size |
| Bootstrap / Material UI | Xung đột với Tailwind, style không nhất quán |
| Moment.js | Bundle nặng, dùng date-fns hoặc dayjs thay thế |
| Axios (trong LP đơn giản) | Dùng native fetch \+ React Query nếu cần |
| CSS Modules / Styled Components | Xung đột với Tailwind, làm khó maintain |

**2\. Cấu trúc thư mục chuẩn**

Mọi project landing page phải tuân theo cấu trúc này. Không thêm thư mục gốc mà không có lý do kỹ thuật rõ ràng.

project-name/

├── app/                         \# Next.js App Router

│   ├── (landing)/               \# Route group cho LP

│   │   ├── \[slug\]/              \# Dynamic route mỗi LP

│   │   │   ├── page.tsx         \# Entry point LP

│   │   │   └── layout.tsx       \# Layout riêng LP (nếu cần)

│   ├── api/                     \# API routes (form submit, webhook)

│   ├── globals.css              \# CSS global duy nhất

│   ├── layout.tsx               \# Root layout (GTM, font, meta)

│   └── not-found.tsx            \# 404 page

├── components/                  \# Shared components

│   ├── ui/                      \# shadcn/ui components (auto-generated)

│   ├── sections/                \# LP sections tái sử dụng

│   │   ├── Hero.tsx

│   │   ├── Benefits.tsx

│   │   ├── SocialProof.tsx

│   │   ├── Pricing.tsx

│   │   ├── FAQ.tsx

│   │   └── CTAFooter.tsx

│   ├── forms/                   \# Form components

│   │   └── LeadForm.tsx

│   └── layout/                  \# Header, Footer, Navigation

├── lib/                         \# Utility functions

│   ├── utils.ts                 \# cn(), formatters

│   ├── analytics.ts             \# Tracking helpers

│   └── validations.ts           \# Zod schemas dùng chung

├── hooks/                       \# Custom React hooks

│   ├── useFormSubmit.ts

│   └── useIntersectionObserver.ts

├── types/                       \# TypeScript type definitions

│   ├── landing.ts

│   └── form.ts

├── public/                      \# Static assets

│   ├── images/

│   ├── fonts/

│   └── og/                      \# Open Graph images

├── content/                     \# CMS content (JSON/MDX)

│   └── \[slug\].json              \# Nội dung từng LP

├── .env.local                   \# Biến môi trường (KHÔNG commit)

├── .env.example                 \# Template env (BẮT BUỘC commit)

├── next.config.js

├── tailwind.config.ts

├── tsconfig.json

├── ARCHITECTURE.md              \# File này

└── CHANGELOG.md                 \# Log thay đổi mỗi tuần

**3\. Naming Convention**

Quy tắc đặt tên là bắt buộc. PR sẽ bị reject nếu vi phạm.

| Đối tượng | Convention | Ví dụ đúng | Ví dụ sai |
| :---- | :---- | :---- | :---- |
| File component | PascalCase.tsx | HeroSection.tsx | hero-section.tsx, herosection.tsx |
| File utility/hook | camelCase.ts | useFormSubmit.ts | UseFormSubmit.ts |
| Thư mục | kebab-case | social-proof/ | SocialProof/, socialProof/ |
| Route (URL slug) | kebab-case | /san-pham-abc | /sanPhamAbc, /SanPhamAbc |
| Component function | PascalCase | function HeroSection() | function heroSection() |
| Props interface | PascalCase \+ Props | HeroSectionProps | HeroSectionProp, heroProps |
| Constant | SCREAMING\_SNAKE\_CASE | MAX\_FORM\_FIELDS | maxFormFields |
| Type/Interface | PascalCase | LandingPageData | landingPageData |
| CSS class (Tailwind) | Chỉ dùng Tailwind utilities | className="flex gap-4" | className="my-custom-class" |
| Biến môi trường | NEXT\_PUBLIC\_ prefix (public) | NEXT\_PUBLIC\_GTM\_ID | GTM\_ID (thiếu prefix) |

**4\. Component Pattern chuẩn**

**4.1 Anatomy của một Section component**

Mọi section trong LP phải theo cấu trúc sau:

// components/sections/HeroSection.tsx

import { cn } from '@/lib/utils'

// 1\. Định nghĩa Props với TypeScript interface (KHÔNG dùng type nếu có thể extend)

interface HeroSectionProps {

  headline: string

  subheadline?: string        // Optional dùng ?

  ctaText: string

  ctaHref: string

  className?: string          // Luôn có className để override từ ngoài

}

// 2\. Export named \+ default (để tree-shaking và import linh hoạt)

export function HeroSection({

  headline,

  subheadline,

  ctaText,

  ctaHref,

  className,

}: HeroSectionProps) {

  return (

    \<section className={cn('py-20 px-4 bg-white', className)}\>

      \<div className='max-w-5xl mx-auto text-center'\>

        \<h1 className='text-4xl font-bold text-slate-900'\>{headline}\</h1\>

        {subheadline && (

          \<p className='mt-4 text-xl text-slate-600'\>{subheadline}\</p\>

        )}

        \<a href={ctaHref} className='mt-8 inline-block btn-primary'\>

          {ctaText}

        \</a\>

      \</div\>

    \</section\>

  )

}

export default HeroSection

**4.2 Quy tắc component bắt buộc**

| Quy tắc | Mô tả |
| :---- | :---- |
| Không dùng any | TypeScript strict. Dùng unknown và narrow type hoặc generic. |
| Props destructure ngay parameter | Không viết props.headline, destructure trong function signature. |
| Server Component mặc định | Chỉ thêm 'use client' khi thực sự cần (useState, useEffect, event handlers). |
| Không inline style | Chỉ dùng Tailwind. Nếu cần dynamic value dùng CSS variable qua style={{}} hạn chế. |
| Export cả named và default | Named export để IDE auto-import, default export để Next.js dynamic import. |
| Không hardcode text | Text đưa vào props hoặc content/\[slug\].json để dễ thay đổi theo brief. |

**4.3 Tracking events chuẩn (PHẢI có trong mọi CTA)**

// lib/analytics.ts

export function trackCTAClick(ctaLabel: string, location: string) {

  if (typeof window \=== 'undefined') return

  window.dataLayer?.push({

    event: 'cta\_click',

    cta\_label: ctaLabel,

    cta\_location: location,     // 'hero' | 'pricing' | 'footer'

    page\_slug: window.location.pathname,

  })

}

export function trackFormSubmit(formName: string, success: boolean) {

  window.dataLayer?.push({

    event: success ? 'form\_submit\_success' : 'form\_submit\_error',

    form\_name: formName,

    page\_slug: window.location.pathname,

  })

}

**5\. Landing Page Template chuẩn**

Mỗi LP mới phải được tạo từ template này, không làm từ scratch.

// app/(landing)/\[slug\]/page.tsx

import { Metadata } from 'next'

import { notFound } from 'next/navigation'

import { HeroSection } from '@/components/sections/HeroSection'

import { BenefitsSection } from '@/components/sections/BenefitsSection'

import { SocialProofSection } from '@/components/sections/SocialProofSection'

import { PricingSection } from '@/components/sections/PricingSection'

import { FAQSection } from '@/components/sections/FAQSection'

import { CTAFooterSection } from '@/components/sections/CTAFooterSection'

import { LeadForm } from '@/components/forms/LeadForm'

import { getLandingPageContent } from '@/lib/content'

// ── SEO Metadata (BẮT BUỘC) ──────────────────────────────────

export async function generateMetadata({ params }: { params: { slug: string } }): Promise\<Metadata\> {

  const content \= await getLandingPageContent(params.slug)

  if (\!content) return {}

  return {

    title: content.seoTitle,

    description: content.seoDescription,

    openGraph: {

      title: content.seoTitle,

      description: content.seoDescription,

      images: \[{ url: \`/og/${params.slug}.png\` }\],

    },

  }

}

// ── Page Component ────────────────────────────────────────────

export default async function LandingPage({ params }: { params: { slug: string } }) {

  const content \= await getLandingPageContent(params.slug)

  if (\!content) notFound()

  return (

    \<main\>

      \<HeroSection {...content.hero} /\>

      \<BenefitsSection {...content.benefits} /\>

      \<SocialProofSection {...content.socialProof} /\>

      \<LeadForm campaignName={content.campaignName} /\>

      \<PricingSection {...content.pricing} /\>

      \<FAQSection items={content.faq} /\>

      \<CTAFooterSection {...content.cta} /\>

    \</main\>

  )

}

**6\. Environment Variables**

File .env.local KHÔNG BAO GIỜ được commit lên Git. File .env.example phải luôn được cập nhật.

\# .env.example — LUÔN COMMIT FILE NÀY (không có giá trị thật)

\# ── Analytics (BẮT BUỘC) ──────────────────────────────────────

NEXT\_PUBLIC\_GTM\_ID=GTM-XXXXXXX

NEXT\_PUBLIC\_GA4\_ID=G-XXXXXXXXXX

\# ── Ads Tracking (Điền khi chạy campaign tương ứng) ──────────

NEXT\_PUBLIC\_META\_PIXEL\_ID=

NEXT\_PUBLIC\_GOOGLE\_ADS\_ID=

\# ── Form / Backend ────────────────────────────────────────────

FORM\_SUBMIT\_WEBHOOK\_URL=               \# Webhook nhận lead

FORM\_SUBMIT\_SECRET=                    \# Secret key verify webhook

\# ── CMS / Content ──────────────────────────────────────────────

NEXT\_PUBLIC\_SITE\_URL=https://yourdomain.com

\# ── Build ──────────────────────────────────────────────────────

ANALYZE=false                          \# Set true để phân tích bundle size

**7\. QA Checklist trước khi Deploy**

Mọi LP phải pass 100% checklist này trước khi được tính là "Done". Owner tự check, CTO review lần cuối.

| \# | Hạng mục | Tiêu chí cụ thể | Người check |
| :---- | :---- | :---- | :---- |
| 1 | Scope & Content | Đúng brief, đủ section, không còn placeholder text/image | Owner LP |
| 2 | Responsive | Test trên Chrome DevTools: 375px, 768px, 1280px — không vỡ layout | Owner LP |
| 3 | Lighthouse Score | Performance ≥ 80, Accessibility ≥ 90, Best Practices ≥ 90 | Owner LP |
| 4 | Form Submit | Submit test với email thật, kiểm tra webhook nhận lead, thank-you page hiện | Owner LP |
| 5 | CTA Links | Tất cả button/link đúng URL, không có broken link, không href="\#" | Owner LP |
| 6 | GTM & GA4 | GTM đã inject, GA4 realtime thấy page view khi test | Marketing lead |
| 7 | CTA Events | Click CTA → thấy event cta\_click trong GA4 DebugView | Marketing lead |
| 8 | Form Events | Submit form → thấy form\_submit\_success trong GA4 DebugView | Marketing lead |
| 9 | SEO Tags | title, description, H1 duy nhất, og:image, canonical URL đúng | Owner LP |
| 10 | Image Alt | Mọi \<img\> có alt text mô tả nội dung | Owner LP |
| 11 | Console Errors | Không có lỗi đỏ trong browser console khi load | Owner LP |
| 12 | TypeScript | npm run build không có TS error, không có warning bị suppress | Owner LP |
| 13 | Environment | Deploy đúng môi trường (staging trước, production sau khi CTO approve) | CTO |
| 14 | Handoff note | Ghi chú: owner, ngày deploy, campaign name, follow-up cần làm | Owner LP |

**8\. Git Workflow**

| Branch | Mục đích | Quy tắc |
| :---- | :---- | :---- |
| main | Code đang chạy production | Chỉ merge qua PR, không push trực tiếp |
| develop | Integration branch | Merge feature branches vào đây trước |
| feature/LP-\[slug\] | Từng landing page | Tạo từ develop, merge về develop khi done |
| fix/\[mô-tả-ngắn\] | Bug fix | Tạo từ develop, merge về develop ngay khi fix xong |
| chore/\[mô-tả\] | Setup, config, không ảnh hưởng LP | Merge nhanh sau review CTO |

**Commit message format (BẮT BUỘC)**

feat(lp-san-pham-x): add hero section and lead form

fix(lp-san-pham-x): form submit không gửi webhook

chore: update Tailwind config thêm custom colors

style(lp-san-pham-x): fix responsive mobile hero

track(lp-san-pham-x): add GA4 cta\_click event

\# Format: type(scope): mô tả ngắn gọn (không viết hoa, không dấu chấm cuối)

\# type: feat | fix | chore | style | track | refactor | docs

**9\. Performance Standards**

| Metric | Target tối thiểu | Cách đo |
| :---- | :---- | :---- |
| Lighthouse Performance | ≥ 80 điểm | Chrome DevTools → Lighthouse → Mobile |
| LCP (Largest Contentful Paint) | ≤ 2.5s | Lighthouse hoặc PageSpeed Insights |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | Lighthouse |
| First Load JS | ≤ 150KB | next build → output bundle size |
| Image format | WebP hoặc AVIF | next/image auto-convert hoặc convert thủ công |
| Hero image | ≤ 200KB sau nén | TinyPNG hoặc Squoosh trước khi commit |

**Bắt buộc với Images**

* Luôn dùng next/image thay \<img\> thông thường

* Thêm width, height, priority cho hero image

* Thêm loading="lazy" cho ảnh dưới fold

* Alt text mô tả nội dung, không để alt=""

**10\. Daily Async Format**

Mỗi ngày, mỗi member post 5 dòng này vào channel team (Slack / Notion / nhóm chat):

✅ Hôm qua: \[LP-slug\] hoàn thành hero \+ benefits section

🔨 Hôm nay: \[LP-slug\] làm form \+ tracking, estimate 4h

🔗 Link đang làm: https://github.com/.../feature/lp-slug

⏰ ETA deploy: Thứ 5 18:00

🚧 Blocker: Chưa có ảnh testimonial từ Marketing (cần trước 12h)

*Nếu không có blocker, dòng 5 ghi "Không có blocker."*

**11\. Glossary**

| Thuật ngữ | Định nghĩa |
| :---- | :---- |
| LP / Landing Page | Trang đích được thiết kế để chuyển đổi visitor thành lead hoặc customer |
| DoD (Definition of Done) | Checklist LP phải pass 100% trước khi được tính là hoàn tất |
| GTM | Google Tag Manager — container quản lý mọi tracking script |
| Brief | Tài liệu mô tả yêu cầu LP: offer, audience, CTA, sections, assets, deadline |
| Slug | URL path của LP, ví dụ: 'khoa-hoc-lap-trinh-2024' |
| Component | UI block tái sử dụng được, viết bằng TypeScript \+ Tailwind |
| Section | Một khối nội dung trong LP: Hero, Benefits, SocialProof, Pricing, FAQ, CTA |
| Server Component | React component render phía server (Next.js mặc định), không có JS ở client |
| Client Component | React component dùng 'use client', có thể dùng hooks và browser APIs |
| WIP | Work In Progress — số task đang làm dở cùng lúc (cần giữ thấp) |

*Tài liệu này do CTO sở hữu và phải được cập nhật mỗi khi có thay đổi tech stack hoặc quy trình.*

**Mọi exception phải có phê duyệt bằng văn bản từ CTO trước khi áp dụng.**