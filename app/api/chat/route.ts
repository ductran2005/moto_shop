import { NextResponse } from "next/server";
import { getCatalogPrompt } from "@/lib/chat-products";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatPayload = {
  messages?: ChatMessage[];
};

const systemPrompt = `
Bạn là Moto AI Support, nhân viên tư vấn showroom xe máy cao cấp SpeedZone.
Nhiệm vụ: tư vấn xe máy, xe tay ga, xe số, xe côn tay, xe điện, phụ kiện, bảo dưỡng, trả góp, bảo hành và đặt lịch xem xe.
Phong cách trả lời:
- Ngắn gọn, rõ ràng, tự nhiên như nhân viên showroom thật.
- Ưu tiên hỏi đúng nhu cầu: ngân sách, mục đích đi học/đi làm/đi phượt, chiều cao, thích tiết kiệm hay thể thao.
- Không bịa chính sách tài chính chi tiết. Với trả góp, nói cần CMND/CCCD, trả trước dự kiến 20-30%, nhân viên sẽ chốt hồ sơ.
- Luôn chốt bằng một câu hỏi hoặc bước tiếp theo để tăng khả năng chốt đơn.
- Có thể dùng emoji nhẹ: 🏍️ 🔥 ⚡

Sản phẩm và dịch vụ tham khảo:
${getCatalogPrompt()}
`.trim();

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json({ error: "Thiếu GROQ_API_KEY." }, { status: 500 });
    }

    const payload = (await request.json()) as ChatPayload;
    const messages = (payload.messages ?? [])
      .filter((message) => message.content?.trim())
      .slice(-12)
      .map((message) => ({
        role: message.role,
        content: message.content.trim(),
      }));

    if (!messages.length) {
      return NextResponse.json({ error: "Thiếu nội dung chat." }, { status: 400 });
    }

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL?.trim() || "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        temperature: 0.55,
        max_completion_tokens: 520,
        stream: true,
      }),
    });

    if (!groqResponse.ok || !groqResponse.body) {
      const errorText = await groqResponse.text();
      console.error("Groq chat error:", errorText);
      return NextResponse.json({ error: "Không kết nối được Moto AI." }, { status: 500 });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let buffer = "";

    const stream = new ReadableStream({
      async start(controller) {
        const reader = groqResponse.body?.getReader();

        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              const trimmed = line.trim();

              if (!trimmed.startsWith("data:")) continue;

              const data = trimmed.slice(5).trim();

              if (data === "[DONE]") {
                controller.close();
                return;
              }

              try {
                const parsed = JSON.parse(data) as {
                  choices?: Array<{ delta?: { content?: string } }>;
                };
                const content = parsed.choices?.[0]?.delta?.content;

                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch {
                continue;
              }
            }
          }
        } catch (error) {
          console.error("Groq stream read error:", error);
          controller.error(error);
          return;
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Moto chat route error:", error);
    return NextResponse.json({ error: "Moto AI đang bận. Vui lòng thử lại." }, { status: 500 });
  }
}
