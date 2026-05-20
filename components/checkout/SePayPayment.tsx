"use client";

import Image from "next/image";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { clearGuestCart } from "@/lib/guest-cart";

interface SePayPaymentProps {
  orderCode: string;
  qrImage: string | null;
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface PaymentStatus {
  isPaid: boolean;
  status: string;
  paidAt: string | null;
  transactions: Array<{
    amount: number;
    content: string;
    transaction_date: string;
    bank_code: string;
  }>;
}

// Ngân hàng nhận thanh toán
const BANK_INFO = {
  bankName: process.env.NEXT_PUBLIC_SEPAY_BANK_NAME || "MB Bank",
  bankCode: process.env.NEXT_PUBLIC_SEPAY_BANK_CODE || "tpb",
  accountNumber: process.env.NEXT_PUBLIC_SEPAY_ACCOUNT || "",
  accountName: process.env.NEXT_PUBLIC_SEPAY_ACCOUNT_NAME || "SPEEDZONE SHOP",
};

export function SePayPayment({
  orderCode,
  qrImage,
  amount,
  onSuccess,
  onError,
}: SePayPaymentProps) {
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const [isManualChecking, setIsManualChecking] = useState(false);
  const [manualCheckResult, setManualCheckResult] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tự động tạo link VietQR dự phòng miễn phí nếu SePay API bị lỗi/không trả về mã QR
  const displayQrImage = useMemo(() => {
    if (qrImage) return qrImage;

    const bankCode = BANK_INFO.bankCode.toLowerCase();
    const bankAccount = BANK_INFO.accountNumber;
    const accountName = encodeURIComponent(BANK_INFO.accountName);
    const description = encodeURIComponent(orderCode);

    return `https://img.vietqr.io/image/${bankCode}-${bankAccount}-compact2.png?amount=${amount}&addInfo=${description}&accountName=${accountName}`;
  }, [qrImage, amount, orderCode]);

  const formatCurrency = (value: number) =>
    `${value.toLocaleString("vi-VN")}đ`;

  // Copy to clipboard
  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  // Poll payment status
  const checkPaymentStatus = useCallback(async (isManual = false) => {
    if (isManual) {
      setIsManualChecking(true);
      setManualCheckResult(null);
    }
    try {
      const res = await fetch(
        `/api/sepay/check-status?order_code=${orderCode}`,
      );
      const data = await res.json();

      if (res.ok) {
        setStatus(data);

        if (data.isPaid) {
          // Payment successful - stop polling
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
          setIsPolling(false);

          // Clear guest cart if exists
          try {
            clearGuestCart();
          } catch {
            // Ignore
          }

          onSuccess?.();
        } else if (isManual) {
          setManualCheckResult("Hệ thống chưa tìm thấy giao dịch. Vui lòng đợi 1-2 phút hoặc kiểm tra lại thông tin chuyển khoản.");
          setTimeout(() => setManualCheckResult(null), 6000);
        }
      } else if (isManual) {
        setManualCheckResult("Có lỗi xảy ra khi kiểm tra trạng thái. Vui lòng thử lại sau.");
        setTimeout(() => setManualCheckResult(null), 6000);
      }
    } catch (error) {
      console.error("Payment status check error:", error);
      if (isManual) {
        setManualCheckResult("Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.");
        setTimeout(() => setManualCheckResult(null), 6000);
      }
    } finally {
      if (isManual) {
        setIsManualChecking(false);
      }
    }
  }, [orderCode, onSuccess]);

  // Start polling when component mounts
  useEffect(() => {
    // Initial check
    checkPaymentStatus();

    // Poll every 10 seconds
    setIsPolling(true);
    pollingRef.current = setInterval(() => {
      setPollCount((prev) => prev + 1);
      checkPaymentStatus();
    }, 10_000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [checkPaymentStatus]);

  // Clear cart when payment is confirmed
  useEffect(() => {
    if (status?.isPaid) {
      try {
        clearGuestCart();
      } catch {
        // Ignore
      }
    }
  }, [status?.isPaid]);

  // If payment is already confirmed, show success
  if (status?.isPaid) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-6 text-center">
        <CheckCircle2 className="size-12 text-emerald-400" />
        <div>
          <h3 className="text-lg font-bold text-white">
            Thanh toán thành công!
          </h3>
          <p className="mt-1 text-sm text-zinc-400">
            Đơn hàng <span className="font-mono text-emerald-300">{orderCode}</span> đã được
            xác nhận.
          </p>
          <p className="mt-2 text-xs text-zinc-500">
            Chúng tôi sẽ liên hệ và giao hàng trong thời gian sớm nhất.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Instructions */}
      <div className="rounded-lg border border-amber-400/20 bg-amber-400/10 p-4 text-sm">
        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 size-4 shrink-0 text-amber-400" />
          <div>
            <p className="text-amber-300">
              Vui lòng chuyển khoản với nội dung bên dưới để thanh toán.
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Đơn hàng sẽ được tự động xác nhận sau khi nhận được tiền (thường 1-2 phút).
            </p>
          </div>
        </div>
      </div>

      {/* Order code & amount */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-black/25 p-4">
          <p className="text-xs text-zinc-500">Mã đơn hàng</p>
          <div className="mt-1 flex items-center gap-2">
            <code className="text-sm font-bold text-[var(--color-accent)]">
              {orderCode}
            </code>
            <button
              type="button"
              onClick={() => copyToClipboard(orderCode, "orderCode")}
              className="rounded p-1 text-zinc-500 hover:bg-white/10 hover:text-white"
              title="Sao chép mã đơn hàng"
            >
              {copied === "orderCode" ? (
                <CheckCircle2 className="size-4 text-emerald-400" />
              ) : (
                <Copy className="size-4" />
              )}
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/25 p-4">
          <p className="text-xs text-zinc-500">Số tiền</p>
          <p className="mt-1 text-lg font-bold text-white">
            {formatCurrency(amount)}
          </p>
        </div>
      </div>

      {/* QR Code */}
      {displayQrImage && (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-6">
          <div className="relative size-52 overflow-hidden rounded-lg bg-white p-3">
            <Image
              src={displayQrImage}
              alt="QR thanh toán SePay"
              fill
              sizes="208px"
              className="object-contain"
              unoptimized
            />
          </div>
          <p className="text-xs text-zinc-500">
            Quét mã QR bằng ứng dụng ngân hàng để thanh toán
          </p>
        </div>
      )}

      {/* Bank transfer info */}
      <div className="rounded-lg border border-white/10 bg-black/25 p-4">
        <h4 className="mb-3 text-sm font-bold text-white">
          Thông tin chuyển khoản
        </h4>

        <div className="grid gap-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-zinc-400">Ngân hàng</span>
            <span className="font-semibold text-white">{BANK_INFO.bankName}</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-zinc-400">Số tài khoản</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">
                {BANK_INFO.accountNumber}
              </span>
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(BANK_INFO.accountNumber, "accountNumber")
                }
                className="rounded p-1 text-zinc-500 hover:bg-white/10 hover:text-white"
                title="Sao chép số tài khoản"
              >
                {copied === "accountNumber" ? (
                  <CheckCircle2 className="size-4 text-emerald-400" />
                ) : (
                  <Copy className="size-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-zinc-400">Chủ tài khoản</span>
            <span className="font-semibold text-white">
              {BANK_INFO.accountName}
            </span>
          </div>
        </div>

        {/* Nội dung chuyển khoản */}
        <div className="mt-4 rounded-md border border-dashed border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 p-3">
          <p className="text-xs text-zinc-500">Nội dung chuyển khoản</p>
          <div className="mt-1 flex items-center gap-2">
            <code className="text-sm font-bold text-[var(--color-accent)]">
              {orderCode}
            </code>
            <button
              type="button"
              onClick={() => copyToClipboard(orderCode, "content")}
              className="rounded p-1 text-zinc-500 hover:bg-white/10 hover:text-white"
              title="Sao chép nội dung chuyển khoản"
            >
              {copied === "content" ? (
                <CheckCircle2 className="size-4 text-emerald-400" />
              ) : (
                <Copy className="size-4" />
              )}
            </button>
          </div>
          <p className="mt-1 text-xs text-amber-400/80">
            ⚠️ Sao chép chính xác nội dung trên để hệ thống tự động xác nhận đơn hàng.
          </p>
        </div>
      </div>

      {/* Open banking app link */}
      <a
        href={`https://api.sepay.vn/payment/qr?bank=${BANK_INFO.accountNumber}&amount=${amount}&content=${orderCode}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[var(--color-accent)] text-sm font-bold uppercase text-white transition hover:bg-[var(--color-accent-hover)]"
      >
        <ExternalLink className="size-4" />
        Mở ứng dụng ngân hàng
      </a>

      {/* Tôi đã chuyển khoản button */}
      <button
        type="button"
        disabled={isManualChecking || !isPolling}
        onClick={() => checkPaymentStatus(true)}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-sm font-bold uppercase text-emerald-400 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isManualChecking ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Đang xác nhận giao dịch...
          </>
        ) : (
          <>
            <CheckCircle2 className="size-4" />
            Tôi đã chuyển khoản thành công
          </>
        )}
      </button>

      {/* Manual check feedback */}
      {manualCheckResult && (
        <div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-3 text-center text-xs text-amber-300">
          {manualCheckResult}
        </div>
      )}

      {/* Polling status */}
      <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
        {isPolling && (
          <>
            {pollCount > 0 ? (
              <>
                <RefreshCw className="size-3 animate-spin" />
                <span>Đang chờ xác nhận thanh toán... ({pollCount})</span>
              </>
            ) : (
              <>
                <Loader2 className="size-3 animate-spin" />
                <span>Đang kiểm tra trạng thái...</span>
              </>
            )}
          </>
        )}
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 rounded-lg border border-orange-400/20 bg-orange-400/10 p-3 text-xs">
        <AlertTriangle className="mt-px size-4 shrink-0 text-orange-400" />
        <p className="text-orange-300">
          Nếu đã chuyển khoản nhưng đơn hàng chưa được xác nhận sau 5 phút, vui lòng
          liên hệ hotline SpeedZone để được hỗ trợ.
        </p>
      </div>
    </div>
  );
}

export default SePayPayment;
