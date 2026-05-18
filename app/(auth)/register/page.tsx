import type { Metadata } from "next";
import { BadgeCheck, LockKeyhole, ShieldCheck } from "lucide-react";

import { HeroBrand } from "@/components/auth/HeroBrand";
import { RegisterForm } from "@/components/auth/RegisterForm";
import type { FooterTrustItem, RegisterFormCopy } from "@/types/auth";

export const metadata: Metadata = {
  title: "Đăng ký | SpeedZone",
  description:
    "Tạo tài khoản SpeedZone để mua sắm xe máy, dầu nhớt, phụ tùng và phụ kiện chính hãng.",
};

const REGISTER_FORM_COPY: RegisterFormCopy = {
  headingLead: "Tạo",
  headingAccent: "tài khoản",
  subtitle: "Đăng ký để bắt đầu hành trình cùng SpeedZone",
  fullNamePlaceholder: "Họ và tên",
  emailPlaceholder: "Email",
  passwordPlaceholder: "Mật khẩu",
  confirmPasswordPlaceholder: "Nhập lại mật khẩu",
  submitLabel: "Đăng ký",
  dividerLabel: "hoặc đăng ký với",
  loginPrompt: "Đã có tài khoản?",
  loginLabel: "Đăng nhập",
};

const FOOTER_TRUST_ITEMS: FooterTrustItem[] = [
  {
    icon: ShieldCheck,
    title: "Bảo mật tuyệt đối",
    subtitle: "Thông tin của bạn luôn được bảo vệ",
  },
  {
    icon: LockKeyhole,
    title: "Dễ dàng & nhanh chóng",
    subtitle: "Đăng ký chỉ trong vài giây",
  },
  {
    icon: BadgeCheck,
    title: "Uy tín hàng đầu",
    subtitle: "Hơn 50.000+ khách hàng tin tưởng",
  },
];

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-20 text-white">
      <div className="grid min-h-[calc(100vh-226px)] lg:grid-cols-2">
        <HeroBrand description="Tạo tài khoản để khám phá xe máy chính hãng, phụ tùng và ưu đãi dành riêng cho thành viên SpeedZone." />
        <RegisterForm copy={REGISTER_FORM_COPY} />
      </div>

      <footer className="border-t border-white/10 bg-black px-5 py-7 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
          {FOOTER_TRUST_ITEMS.map(({ icon: Icon, title, subtitle }) => (
            <div key={title} className="flex items-center gap-4">
              <Icon aria-hidden="true" className="size-6 shrink-0 text-zinc-300" />
              <div>
                <p className="text-xs font-semibold uppercase text-white">{title}</p>
                <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-7 text-center text-xs text-zinc-500">© 2024 SpeedZone. All Rights Reserved.</p>
      </footer>
    </main>
  );
}
