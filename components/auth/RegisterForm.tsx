"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { SocialLogin } from "@/components/auth/SocialLogin";
import { createClient } from "@/lib/supabase/client";
import type { RegisterFormCopy } from "@/types/auth";

interface RegisterFormProps {
  copy: RegisterFormCopy;
}

export function RegisterForm({ copy }: RegisterFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!fullName.trim()) {
      setError("Vui lòng nhập họ và tên.");
      return;
    }

    if (!email.trim()) {
      setError("Vui lòng nhập email.");
      return;
    }

    if (password.trim().length < 6) {
      setError("Mật khẩu cần tối thiểu 6 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận chưa khớp.");
      return;
    }

    setError("");
    setIsLoading(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    });

    if (signUpError) {
      setIsLoading(false);
      setError(signUpError.message);
      return;
    }

    if (!data.session) {
      setIsLoading(false);
      setError("Đăng ký thành công. Vui lòng kiểm tra email để xác nhận tài khoản.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <section className="flex min-h-[620px] items-center justify-center bg-[#111111] px-5 py-8 sm:px-8 lg:min-h-[760px] lg:rounded-r-2xl lg:px-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-normal text-white sm:text-[2rem]">
            {copy.headingLead} <span className="text-[#e31e24]">{copy.headingAccent}</span>
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">{copy.subtitle}</p>
        </div>

        <form className="mt-9" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-4">
            <label className="relative block">
              <span className="sr-only">{copy.fullNamePlaceholder}</span>
              <UserRound
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-zinc-400"
              />
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                type="text"
                autoComplete="name"
                placeholder={copy.fullNamePlaceholder}
                className="h-[52px] w-full rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] pl-11 pr-4 text-white outline-none transition placeholder:text-zinc-500 focus:border-[#e31e24] focus:shadow-[0_0_0_3px_rgba(227,30,36,0.14)]"
              />
            </label>

            <label className="relative block">
              <span className="sr-only">{copy.emailPlaceholder}</span>
              <Mail
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-zinc-400"
              />
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                autoComplete="email"
                placeholder={copy.emailPlaceholder}
                className="h-[52px] w-full rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] pl-11 pr-4 text-white outline-none transition placeholder:text-zinc-500 focus:border-[#e31e24] focus:shadow-[0_0_0_3px_rgba(227,30,36,0.14)]"
              />
            </label>

            <label className="relative block">
              <span className="sr-only">{copy.passwordPlaceholder}</span>
              <LockKeyhole
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-zinc-400"
              />
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder={copy.passwordPlaceholder}
                className="h-[52px] w-full rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] pl-11 pr-12 text-white outline-none transition placeholder:text-zinc-500 focus:border-[#e31e24] focus:shadow-[0_0_0_3px_rgba(227,30,36,0.14)]"
              />
              <button
                type="button"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-white"
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </label>

            <label className="relative block">
              <span className="sr-only">{copy.confirmPasswordPlaceholder}</span>
              <LockKeyhole
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-zinc-400"
              />
              <input
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder={copy.confirmPasswordPlaceholder}
                className="h-[52px] w-full rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] pl-11 pr-4 text-white outline-none transition placeholder:text-zinc-500 focus:border-[#e31e24] focus:shadow-[0_0_0_3px_rgba(227,30,36,0.14)]"
              />
            </label>
          </div>

          {error ? <p className="mt-3 text-sm text-[#ff6a70]">{error}</p> : null}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-7 flex h-[52px] w-full items-center justify-center rounded-lg bg-[#e31e24] text-sm font-bold uppercase text-white transition-all duration-200 hover:bg-[#c41a1f] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Đang xử lý..." : copy.submitLabel}
          </button>
        </form>

        <div className="my-8 flex items-center gap-4 text-sm text-zinc-500">
          <span className="h-px flex-1 bg-[#2a2a2a]" />
          <span>{copy.dividerLabel}</span>
          <span className="h-px flex-1 bg-[#2a2a2a]" />
        </div>

        <SocialLogin />

        <p className="mt-8 text-center text-sm text-zinc-400">
          {copy.loginPrompt}{" "}
          <Link href="/login" className="font-medium text-[#e31e24] transition hover:text-[#ff4b52]">
            {copy.loginLabel}
          </Link>
        </p>
      </div>
    </section>
  );
}

export default RegisterForm;
