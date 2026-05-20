"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  CalendarDays,
  ChevronDown,
  CircleDot,
  Eraser,
  Gauge,
  MessageCircle,
  Minimize2,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { getChatProductSuggestions, type ChatProductSuggestion } from "@/lib/chat-products";

type ChatRole = "assistant" | "user";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
  suggestions?: ChatProductSuggestion[];
};

const storageKey = "speedzone-moto-ai-chat";

const quickActions = [
  "Tư vấn chọn xe",
  "Xe tay ga",
  "Xe số",
  "Xe côn tay",
  "Xe điện",
  "Trả góp",
  "Bảng giá",
  "Đặt lịch xem xe",
];

const welcomeMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Xin chào anh/chị 👋 Em có thể tư vấn mẫu xe phù hợp nhu cầu, ngân sách và hỗ trợ trả góp nhanh ạ.",
  timestamp: new Date().toISOString(),
  suggestions: getChatProductSuggestions("xe côn tay thể thao đi làm đi phượt", 3),
};

function formatTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function createMessage(role: ChatRole, content: string, suggestions?: ChatProductSuggestion[]): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    content,
    timestamp: new Date().toISOString(),
    suggestions,
  };
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2">
      {[0, 1, 2].map((item) => (
        <motion.span
          key={item}
          className="size-1.5 rounded-full bg-orange-400"
          animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: item * 0.12 }}
        />
      ))}
    </div>
  );
}

function ProductSuggestionCard({ product }: { product: ChatProductSuggestion }) {
  return (
    <article className="min-w-[188px] overflow-hidden rounded-[8px] border border-white/10 bg-zinc-950 shadow-[0_16px_38px_rgba(0,0,0,0.26)]">
      <div className="relative h-24 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black">
        <span className="absolute left-2 top-2 z-10 rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
          {product.badge}
        </span>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="188px"
          className="object-contain p-2"
        />
      </div>
      <div className="space-y-1.5 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">{product.brand}</p>
        <h4 className="line-clamp-2 min-h-9 text-xs font-bold leading-[18px] text-white">{product.name}</h4>
        <p className="text-sm font-black text-orange-400">{product.price}</p>
        <p className="line-clamp-2 text-[11px] leading-4 text-zinc-400">{product.reason}</p>
      </div>
    </article>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-[86%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-2`}>
        <div
          className={`rounded-[18px] px-4 py-3 text-sm leading-6 shadow-sm ${
            isUser
              ? "rounded-br-[6px] bg-gradient-to-br from-[var(--color-accent)] to-orange-500 text-white"
              : "rounded-bl-[6px] border border-white/10 bg-white/[0.07] text-zinc-100"
          }`}
        >
          {message.content}
        </div>
        {message.suggestions?.length ? (
          <div className="flex w-full gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {message.suggestions.map((product) => (
              <ProductSuggestionCard key={product.id} product={product} />
            ))}
          </div>
        ) : null}
        <span className="px-1 text-[10px] font-medium text-zinc-500">{formatTime(message.timestamp)}</span>
      </div>
    </motion.div>
  );
}

export function MotoChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === "undefined") {
      return [welcomeMessage];
    }

    try {
      const saved = window.localStorage.getItem(storageKey);
      if (!saved) {
        return [welcomeMessage];
      }

      const parsed = JSON.parse(saved) as ChatMessage[];
      return Array.isArray(parsed) && parsed.length ? parsed : [welcomeMessage];
    } catch {
      return [welcomeMessage];
    }
  });
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const quickSuggestions = useMemo(() => quickActions, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      window.setTimeout(() => inputRef.current?.focus(), 180);
    }
  }, [isOpen, isMinimized]);

  async function sendMessage(value = input) {
    const content = value.trim();

    if (!content || isStreaming) return;

    const userMessage = createMessage("user", content);
    const botMessage = createMessage("assistant", "", getChatProductSuggestions(content, 3));
    const nextMessages = [...messages, userMessage, botMessage];

    setMessages(nextMessages);
    setInput("");
    setError("");
    setIsStreaming(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      if (!response.ok || !response.body) {
        const result = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(result.error || "Moto AI đang bận. Anh/chị thử lại giúp em.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        if (!chunk) continue;

        setMessages((current) =>
          current.map((message) =>
            message.id === botMessage.id ? { ...message, content: `${message.content}${chunk}` } : message,
          ),
        );
      }
    } catch (sendError) {
      const errorMessage =
        sendError instanceof Error ? sendError.message : "Không gửi được tin nhắn. Vui lòng thử lại.";
      setError(errorMessage);
      setMessages((current) =>
        current.map((message) =>
          message.id === botMessage.id
            ? {
                ...message,
                content:
                  "Hiện Moto AI chưa kết nối được. Anh/chị để lại nhu cầu, ngân sách và số điện thoại, nhân viên showroom sẽ hỗ trợ ngay ạ.",
              }
            : message,
        ),
      );
    } finally {
      setIsStreaming(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  function clearChat() {
    const reset = [{ ...welcomeMessage, timestamp: new Date().toISOString() }];
    setMessages(reset);
    setError("");
    window.localStorage.setItem(storageKey, JSON.stringify(reset));
  }

  return (
    <div className="fixed bottom-5 right-4 z-50 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {isOpen && !isMinimized ? (
          <motion.section
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="mb-4 flex h-[min(720px,calc(100vh-108px))] w-[calc(100vw-32px)] max-w-[420px] flex-col overflow-hidden rounded-[18px] border border-white/10 bg-[#08090b] text-white shadow-[0_24px_80px_rgba(0,0,0,0.48)]"
          >
            <header className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-black via-zinc-950 to-[#27070b] px-4 py-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_0%,rgba(255,116,32,0.32),transparent_28%),linear-gradient(135deg,rgba(232,21,42,0.22),transparent_36%)]" />
              <div className="relative flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-[12px] border border-white/15 bg-white/10 shadow-inner">
                  <Gauge className="size-6 text-orange-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-heading text-xl font-black uppercase tracking-wide">Moto AI Support</p>
                    <Sparkles className="size-4 text-orange-400" />
                  </div>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-emerald-300">
                    <CircleDot className="size-3 fill-emerald-400" />
                    Đang online
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 hover:text-white"
                  aria-label="Thu nhỏ chat"
                >
                  <Minimize2 className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 hover:text-white"
                  aria-label="Đóng chat"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="relative mt-4 grid grid-cols-3 gap-2 text-[11px] text-zinc-300">
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5">Tư vấn xe</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5">Trả góp</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5">Bảo hành</span>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,#0b0c0f,#111114)] px-4 py-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                {isStreaming ? (
                  <div className="flex justify-start">
                    <TypingIndicator />
                  </div>
                ) : null}
                <div ref={bottomRef} />
              </div>
            </div>

            <div className="border-t border-white/10 bg-[#0c0d10] p-3">
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {quickSuggestions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    onClick={() => void sendMessage(action)}
                    className="shrink-0 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white"
                  >
                    {action}
                  </button>
                ))}
              </div>

              {error ? <p className="mb-2 text-xs text-red-300">{error}</p> : null}

              <div className="flex items-end gap-2 rounded-[14px] border border-white/10 bg-black/50 p-2 shadow-inner">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder="Nhập nhu cầu mua xe của bạn..."
                  className="max-h-24 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-zinc-500"
                />
                <button
                  type="button"
                  onClick={clearChat}
                  className="grid size-10 shrink-0 place-items-center rounded-[10px] text-zinc-400 transition hover:bg-white/10 hover:text-white"
                  aria-label="Xóa lịch sử chat"
                >
                  <Eraser className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => void sendMessage()}
                  disabled={!input.trim() || isStreaming}
                  className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-gradient-to-br from-[var(--color-accent)] to-orange-500 text-white shadow-[0_12px_26px_rgba(232,21,42,0.32)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Gửi tin nhắn"
                >
                  <Send className="size-4" />
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-500">
                <span>Enter để gửi, Shift + Enter xuống dòng</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="size-3" />
                  Showroom secure
                </span>
              </div>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <div className="flex justify-end">
        <motion.button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          className="group relative flex h-16 items-center gap-3 rounded-full border border-white/10 bg-gradient-to-br from-[#111217] via-black to-[#28070b] pl-4 pr-5 text-white shadow-[0_18px_46px_rgba(0,0,0,0.42)]"
          aria-label="Mở Moto AI Support"
        >
          <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-orange-500 opacity-20 blur transition group-hover:opacity-40" />
          <span className="relative grid size-11 place-items-center rounded-full bg-[var(--color-accent)] shadow-[0_10px_24px_rgba(232,21,42,0.35)]">
            {isMinimized ? <ChevronDown className="size-5" /> : <MessageCircle className="size-5" />}
          </span>
          <span className="relative hidden text-left sm:block">
            <span className="block text-xs font-semibold uppercase tracking-wide text-orange-300">Moto AI</span>
            <span className="block text-sm font-bold">Tư vấn chọn xe</span>
          </span>
          <span className="relative grid size-7 place-items-center rounded-full border border-white/10 bg-white/10">
            <Bot className="size-4 text-orange-300" />
          </span>
        </motion.button>
      </div>

      <div className="pointer-events-none absolute -top-2 right-3 flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-1 text-[10px] font-bold text-white shadow-lg">
        <CalendarDays className="size-3" />
        Online
      </div>
    </div>
  );
}

export default MotoChatbot;
