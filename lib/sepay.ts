/**
 * SePay Payment Integration
 * SePay is a Vietnamese payment gateway that supports automatic bank transfer detection
 * via webhook & QR code generation.
 *
 * SePay API docs: https://my.sepay.vn/developer/api
 */

const SEPAY_API_BASE = "https://my.sepay.vn/api";

export interface SePayWebhookPayload {
  id: number;
  transaction_date: string; // ISO date string
  amount: number;
  content: string; // Nội dung chuyển khoản (chứa mã đơn hàng)
  bank_code: string;
  bank_account_number: string;
  bank_account_name: string;
  gateway: string;
}

export interface SePayCreateQRResponse {
  qr_link: string;
  qr_image: string;
  content: string;
  amount: number;
  status: string;
}

export interface SePayTransaction {
  id: number;
  transaction_date: string;
  amount: number;
  content: string;
  bank_code: string;
  bank_account_number: string;
  bank_account_name: string;
  error_code: string | null;
  error_desc: string | null;
}

// Lấy cấu hình SePay từ environment variables
function getConfig() {
  const apiKey = process.env.SEPAY_API_KEY;
  const bankAccount = process.env.SEPAY_BANK_ACCOUNT;
  const bankCode = process.env.SEPAY_BANK_CODE;
  const bankName = process.env.SEPAY_BANK_NAME;

  if (!apiKey) {
    throw new Error("Missing SEPAY_API_KEY environment variable");
  }
  if (!bankAccount) {
    throw new Error("Missing SEPAY_BANK_ACCOUNT environment variable");
  }

  return { apiKey, bankAccount, bankCode, bankName };
}

/**
 * Tạo QR thanh toán SePay
 * Khách hàng scan QR và chuyển khoản với nội dung chứa mã đơn hàng
 */
export async function createSePayQR(params: {
  amount: number;
  orderCode: string;
  desc?: string;
}): Promise<SePayCreateQRResponse> {
  const { apiKey, bankAccount, bankCode, bankName } = getConfig();

  const content = params.desc
    ? `${params.orderCode} ${params.desc}`
    : params.orderCode;

  const res = await fetch(`${SEPAY_API_BASE}/payment/qr`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      bank_account: bankAccount,
      bank_code: bankCode ?? "MB",
      bank_name: bankName ?? "MB Bank",
      amount: params.amount,
      content,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`SePay QR creation failed: ${res.status} ${errorText}`);
  }

  return res.json();
}

/**
 * Lấy danh sách giao dịch từ SePay
 * Dùng để kiểm tra xem đã có giao dịch nào khớp với mã đơn hàng chưa
 */
export async function getSePayTransactions(params?: {
  from_date?: string;
  to_date?: string;
  limit?: number;
  page?: number;
}): Promise<SePayTransaction[]> {
  const { apiKey } = getConfig();

  const queryParams = new URLSearchParams();
  if (params?.from_date) queryParams.set("from_date", params.from_date);
  if (params?.to_date) queryParams.set("to_date", params.to_date);
  if (params?.limit) queryParams.set("limit", String(params.limit));
  if (params?.page) queryParams.set("page", String(params.page));

  const queryString = queryParams.toString();
  const url = `${SEPAY_API_BASE}/transaction/list${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`SePay get transactions failed: ${res.status} ${errorText}`);
  }

  const data = await res.json();
  return data.transactions ?? [];
}

/**
 * Xác thực webhook từ SePay
 * SePay gửi webhook kèm header X-API-Key hoặc X-Signature để xác thực
 */
export function verifyWebhookSignature(
  signature: string | null,
  body: string
): boolean {
  if (!signature) return false;

  const apiKey = process.env.SEPAY_API_KEY;
  if (!apiKey) return false;

  // SePay gửi API key trong header X-API-Key
  return signature === apiKey;
}

/**
 * Trích xuất mã đơn hàng từ nội dung chuyển khoản
 * Format: SZ-YYYYMMDD-XXXXXX
 */
export function extractOrderCode(content: string): string | null {
  const match = content.match(/SZ-\d{8}-[A-Z0-9]{6}/);
  return match ? match[0] : null;
}
