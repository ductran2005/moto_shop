import { createClient } from "@/lib/supabase/server";
import { createSePayQR } from "@/lib/sepay";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      paymentMethod,
      subtotal,
      discount,
      shippingFee,
      total,
      fullName,
      phone,
      address,
      note,
      shippingOption,
      items,
    } = body;

    // Validate required fields
    if (!fullName || !phone || !address || !total || !items) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin bắt buộc." },
        { status: 400 },
      );
    }

    // Get authenticated user (nullable for guest checkout)
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id ?? null;

    // Create order in database
    const { data: orderId, error: orderError } = await supabase.rpc(
      "create_order",
      {
        p_user_id: userId,
        p_payment_method: paymentMethod ?? "sepay",
        p_subtotal: subtotal ?? total,
        p_discount: discount ?? 0,
        p_shipping_fee: shippingFee ?? 0,
        p_total: total,
        p_full_name: fullName,
        p_phone: phone,
        p_address: address,
        p_note: note ?? null,
        p_shipping_option: shippingOption ?? "standard",
        p_items: JSON.stringify(items),
      },
    );

    if (orderError) {
      console.error("Create order error:", orderError);
      return NextResponse.json(
        { error: "Không thể tạo đơn hàng. Vui lòng thử lại." },
        { status: 500 },
      );
    }

    // Get the order code for SePay
    const { data: order } = await supabase
      .from("orders")
      .select("order_code")
      .eq("id", orderId)
      .single();

    if (!order) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn hàng." },
        { status: 500 },
      );
    }

    const orderCode = order.order_code;

    // If payment method is sepay, generate QR code
    if (paymentMethod === "sepay") {
      try {
        const qrData = await createSePayQR({
          amount: total,
          orderCode,
        });

        return NextResponse.json({
          orderId,
          orderCode,
          qrImage: qrData.qr_image,
          qrLink: qrData.qr_link,
          amount: total,
          paymentMethod: "sepay",
        });
      } catch (sepayError) {
        // If SePay QR generation fails, still create the order
        // User can pay via manual transfer with order code
        console.error("SePay QR generation error:", sepayError);

        return NextResponse.json({
          orderId,
          orderCode,
          qrImage: null,
          qrLink: null,
          amount: total,
          paymentMethod: "sepay",
          warning: "Không thể tạo mã QR. Vui lòng chuyển khoản thủ công với nội dung: " + orderCode,
        });
      }
    }

    // For other payment methods
    return NextResponse.json({
      orderId,
      orderCode,
      paymentMethod,
    });
  } catch (error) {
    console.error("Create payment error:", error);
    return NextResponse.json(
      { error: "Lỗi xử lý thanh toán. Vui lòng thử lại." },
      { status: 500 },
    );
  }
}
