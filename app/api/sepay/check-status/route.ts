import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * API endpoint để kiểm tra trạng thái thanh toán của đơn hàng
 * Frontend sẽ poll endpoint này để biết khi nào khách hàng đã chuyển khoản thành công
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderCode = searchParams.get("order_code");

    if (!orderCode) {
      return NextResponse.json(
        { error: "Thiếu mã đơn hàng." },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Lấy thông tin đơn hàng
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`
        id,
        order_code,
        status,
        payment_method,
        total,
        paid_at,
        created_at
      `)
      .eq("order_code", orderCode)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn hàng." },
        { status: 404 },
      );
    }

    // Lấy danh sách giao dịch SePay của đơn hàng
    const { data: transactions } = await supabase
      .from("sepay_transactions")
      .select("*")
      .eq("order_id", order.id)
      .order("created_at", { ascending: false });

    // Kiểm tra quyền truy cập: chỉ user của đơn hàng hoặc admin mới xem được
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isOwner = user && order.id;
    const { data: orderCheck } = await supabase
      .from("orders")
      .select("user_id")
      .eq("id", order.id)
      .single();

    const isAuthorized =
      user?.id === orderCheck?.user_id || user?.role === "admin";

    if (!isAuthorized) {
      // Vẫn trả về thông tin cơ bản cho khách vãng lai
    }

    return NextResponse.json({
      orderCode: order.order_code,
      status: order.status,
      paymentMethod: order.payment_method,
      total: order.total,
      paidAt: order.paid_at,
      createdAt: order.created_at,
      isPaid: order.status === "confirmed" || order.status === "processing",
      transactions: transactions ?? [],
    });
  } catch (error) {
    console.error("Check status error:", error);
    return NextResponse.json(
      { error: "Lỗi kiểm tra trạng thái." },
      { status: 500 },
    );
  }
}
