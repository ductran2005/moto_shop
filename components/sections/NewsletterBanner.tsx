"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Không gửi được đăng ký.");
      }

      setEmail("");
      setStatus("success");
      setMessage("Đăng ký thành công. Vui lòng kiểm tra email xác nhận.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Không gửi được đăng ký.");
    }
  }

  return (
    <section className="relative min-h-[320px] overflow-hidden bg-[var(--color-bg-primary)] py-8 sm:min-h-0 sm:py-7">
      <Image
        src="/images/ChatGPT Image 16_57_27 15 thg 5, 2026.png"
        alt="Xe máy thể thao trong banner đăng ký SpeedZone"
        fill
        sizes="100vw"
        className="h-full w-full object-cover object-[78%_center] sm:object-[72%_center] md:object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/45" />
      <div className="speed-container relative mx-auto grid max-w-[1344px] gap-6 md:grid-cols-[minmax(0,1fr)_minmax(280px,1.1fr)] md:items-center lg:gap-12">
        <div className="min-w-0">
          <h2 className="font-heading max-w-xl text-[clamp(1.8rem,8vw,2.4rem)] font-black uppercase leading-tight tracking-wide sm:text-4xl md:text-5xl">
            <span className="block text-[var(--color-accent)]">Đăng Ký Nhận Ưu Đãi & Tin</span>
            <span className="block text-white">Tức Mới Nhất</span>
          </h2>
          <p className="mt-3 text-zinc-300">Nhận ngay voucher 100K cho đơn hàng đầu tiên</p>
        </div>
        <form className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap" onSubmit={handleSubmit}>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Nhập email của bạn"
            className="h-12 min-w-0 flex-1 rounded-full border border-white/20 bg-black/55 px-6 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-[var(--color-accent)]"
            required
          />
          <Button type="submit" className="h-12 rounded-full px-8" disabled={status === "sending"}>
            {status === "sending" ? "Đang gửi..." : "Đăng Ký Ngay"}
          </Button>
          {message ? (
            <p
              className={`w-full text-sm ${
                status === "success" ? "text-emerald-300" : "text-red-300"
              }`}
            >
              {message}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}

export default NewsletterBanner;
