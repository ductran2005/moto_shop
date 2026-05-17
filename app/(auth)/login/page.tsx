import type { Metadata } from "next";
import { BadgeCheck, LockKeyhole, ShieldCheck } from "lucide-react";

import { HeroBrand } from "@/components/auth/HeroBrand";
import { LoginForm } from "@/components/auth/LoginForm";
import type { FooterTrustItem, LoginFormCopy } from "@/types/auth";

export const metadata: Metadata = {
  title: "Đăng nhập | SpeedZone",
  description:
    "Đăng nhập SpeedZone để tiếp tục mua sắm xe máy, dầu nhớt, phụ tùng và phụ kiện chính hãng.",
};

const LOGIN_FORM_COPY: LoginFormCopy = {
  headingLead: "Chào mừng",
  headingAccent: "trở lại!",
  subtitle: "Đăng nhập để tiếp tục hành trình cùng SpeedZone",
  identifierPlaceholder: "Email hoặc số điện thoại",
  passwordPlaceholder: "Mật khẩu",
  rememberLabel: "Ghi nhớ đăng nhập",
  forgotPasswordLabel: "Quên mật khẩu?",
  submitLabel: "Đăng nhập",
  dividerLabel: "hoặc đăng nhập với",
  registerPrompt: "Chưa có tài khoản?",
  registerLabel: "Đăng ký ngay",
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
    subtitle: "Đăng nhập chỉ trong vài giây",
  },
  {
    icon: BadgeCheck,
    title: "Uy tín hàng đầu",
    subtitle: "Hơn 50.000+ khách hàng tin tưởng",
  },
];

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-20 text-white">
        <div className="grid min-h-[calc(100vh-226px)] lg:grid-cols-2">
          <HeroBrand />
          <LoginForm copy={LOGIN_FORM_COPY} />
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
          <p className="mt-7 text-center text-xs text-zinc-500">
            © 2024 SpeedZone. All Rights Reserved.
          </p>
        </footer>
    </main>
  );
}
