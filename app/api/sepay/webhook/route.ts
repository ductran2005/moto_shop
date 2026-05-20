import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  verifyWebhookSignature,
  extractOrderCode,
  type SePayWebhookPayload,
} from "@/lib/sepay";

/**
 * SePay Webhook endpoint
 * SePay sẽ gửi POST request đến endpoint này khi có giao dịch mới
 *
 * Cấu hình trên SePay:
 * - Webhook URL: https://your-domain.com/api/sepay/webhook
 * - Phương thức: POST
 * - Header: X-API-Key = SEPAY_API_KEY
 */
export async function POST(request: Request) {
  try {
    // Verify webhook signature
    const apiKeyHeader = request.headers.get("X-API-Key");
    const bodyText = await request.text();
    const body = JSON.parse(bodyText) as SePayWebhookPayload[];

    if (!verifyWebhookSignature(apiKeyHeader, bodyText)) {
      console.warn("SePay webhook: Invalid signature");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    // SePay gửi mảng các giao dịch
    const transactions = Array.isArray(body) ? body : [body];
    const supabase = createAdminClient();

    for (const tx of transactions) {
      try {
        // Trích xuất mã đơn hàng từ nội dung chuyển khoản
        const orderCode = extractOrderCode(tx.content);

        if (!orderCode) {
          console.log("SePay webhook: No order code found in transaction", tx.id);
          continue;
        }

        // Tìm đơn hàng theo mã
        const { data: order } = await supabase
          .from("orders")
          .select("id, status, total")
          .eq("order_code", orderCode)
          .single();

        if (!order) {
          console.log(`SePay webhook: Order ${orderCode} not found`);
          continue;
        }

        // Kiểm tra số tiền khớp với tổng đơn hàng (cho phép sai số 1,000đ)
        const amountDiff = Math.abs(tx.amount - order.total);
        if (amountDiff > 1000) {
          console.warn(
            `SePay webhook: Amount mismatch for order ${orderCode}. Expected: ${order.total}, Received: ${tx.amount}`,
          );
          // Vẫn lưu giao dịch nhưng không xác nhận đơn hàng
        }

        // Lưu giao dịch SePay
        const { error: upsertError } = await supabase
          .from("sepay_transactions")
          .upsert(
            {
              order_id: order.id,
              sepay_id: tx.id,
              transaction_date: tx.transaction_date,
              amount: tx.amount,
              content: tx.content,
              bank_code: tx.bank_code,
              bank_account_number: tx.bank_account_number,
              bank_account_name: tx.bank_account_name,
              raw_payload: tx,
              is_processed: amountDiff <= 1000, // Chỉ đánh dấu đã xử lý nếu số tiền khớp
              processed_at: amountDiff <= 1000 ? new Date().toISOString() : null,
            },
            {
              onConflict: "sepay_id",
            },
          );

        if (upsertError) {
          console.error("SePay webhook: Error saving transaction:", upsertError);
          continue;
        }

        // Nếu số tiền khớp, cập nhật trạng thái đơn hàng
        if (amountDiff <= 1000 && order.status === "pending") {
          const { error: updateError } = await supabase
            .from("orders")
            .update({
              status: "confirmed",
              paid_at: new Date().toISOString(),
            })
            .eq("id", order.id);

          if (updateError) {
            console.error("SePay webhook: Error updating order:", updateError);
          } else {
            console.log(`SePay webhook: Order ${orderCode} confirmed successfully`);
          }
        }
      } catch (txError) {
        console.error("SePay webhook: Error processing transaction:", txError);
        continue;
      }
    }

    // Trả về 200 để SePay biết đã nhận được webhook
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SePay webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
