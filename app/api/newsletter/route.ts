import { Resend } from "resend";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type NewsletterPayload = {
  email?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  return value;
}

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as NewsletterPayload;
    const subscriberEmail = email?.trim().toLowerCase();

    if (!subscriberEmail || !emailPattern.test(subscriberEmail)) {
      return NextResponse.json({ error: "Email không hợp lệ." }, { status: 400 });
    }

    const resend = new Resend(getRequiredEnv("RESEND_API_KEY"));
    const ownerEmail = getRequiredEnv("NEWSLETTER_OWNER_EMAIL");
    const fromEmail = getRequiredEnv("RESEND_FROM_EMAIL");
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME?.trim() || "SpeedZone";

    const [customerResult, ownerResult] = await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: [subscriberEmail],
        subject: `${siteName} xác nhận đăng ký nhận ưu đãi`,
        text: `Cảm ơn bạn đã đăng ký nhận ưu đãi từ ${siteName}. Chúng tôi sẽ gửi tin tức và khuyến mãi mới nhất đến email này.`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
            <h2 style="margin: 0 0 12px; color: #e8001d;">Đăng ký nhận ưu đãi thành công</h2>
            <p>Cảm ơn bạn đã đăng ký nhận ưu đãi từ <strong>${siteName}</strong>.</p>
            <p>Chúng tôi sẽ gửi tin tức mới nhất, voucher và khuyến mãi dành riêng cho bạn đến email này.</p>
          </div>
        `,
      }),
      resend.emails.send({
        from: fromEmail,
        to: [ownerEmail],
        subject: `Có khách đăng ký nhận ưu đãi - ${siteName}`,
        text: `Có khách vừa đăng ký nhận ưu đãi.\nEmail: ${subscriberEmail}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
            <h2 style="margin: 0 0 12px; color: #e8001d;">Có khách đăng ký nhận ưu đãi</h2>
            <p>Một khách hàng vừa đăng ký nhận ưu đãi trên website.</p>
            <p><strong>Email khách:</strong> ${subscriberEmail}</p>
          </div>
        `,
      }),
    ]);

    if (customerResult.error || ownerResult.error) {
      console.error("Resend newsletter error:", {
        customer: customerResult.error,
        owner: ownerResult.error,
      });
      return NextResponse.json(
        { error: "Không gửi được email. Vui lòng thử lại sau." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Newsletter email error:", error);
    return NextResponse.json(
      { error: "Không gửi được email. Vui lòng thử lại sau." },
      { status: 500 },
    );
  }
}
