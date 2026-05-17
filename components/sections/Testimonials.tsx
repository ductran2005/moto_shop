"use client";

import { useEffect, useState } from "react";

const testimonials = [
  {
    name: "Anh Tuấn",
    city: "TP. Hồ Chí Minh",
    text: "Dầu nhớt chính hãng, giao hàng nhanh, tư vấn rất nhiệt tình. Sẽ ủng hộ dài dài!",
  },
  {
    name: "Anh Hoàng",
    city: "Hà Nội",
    text: "Mua xe ở đây thủ tục nhanh gọn, giá tốt hơn chỗ khác.",
  },
  {
    name: "Anh Duy",
    city: "Đà Nẵng",
    text: "Phụ tùng chất lượng, shop uy tín, đóng gói cẩn thận.",
  },
  {
    name: "Chị Linh",
    city: "Cần Thơ",
    text: "Nhân viên tư vấn đúng nhu cầu, phụ kiện lắp lên xe rất vừa và đẹp.",
  },
  {
    name: "Anh Khánh",
    city: "Hải Phòng",
    text: "Đặt hàng nhanh, đóng gói chắc chắn, sản phẩm nhận đúng như tư vấn.",
  },
  {
    name: "Chị Mai",
    city: "Bình Dương",
    text: "Giá hợp lý, đổi trả dễ, lần sau vẫn sẽ quay lại mua thêm.",
  },
];

const testimonialsPerPage = 3;
const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);

export function Testimonials() {
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActivePage((page) => (page + 1) % totalPages);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  const visibleTestimonials = testimonials.slice(
    activePage * testimonialsPerPage,
    activePage * testimonialsPerPage + testimonialsPerPage,
  );

  return (
    <section className="relative overflow-hidden bg-[var(--color-bg-primary)] py-12 md:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_35%,rgba(255,255,255,0.12),transparent_26%)]" />
      <div className="noise-overlay absolute inset-0 opacity-60" />
      <div className="speed-container relative">
        <h2 className="font-heading mb-9 text-center text-4xl font-black uppercase text-white">
          Khách Hàng Nói Về Chúng Tôi
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {visibleTestimonials.map((item, index) => (
            <article
              key={item.name}
              className="rounded-[8px] border border-white/10 bg-[var(--color-bg-card)]/90 p-7 shadow-2xl"
            >
              <span className="font-heading text-6xl font-black leading-none text-[var(--color-accent)]">“</span>
              <p className="-mt-3 min-h-20 text-sm leading-7 text-zinc-200">{item.text}</p>
              <div className="mt-5 text-amber-400">★★★★★</div>
              <div className="mt-6 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-zinc-200 to-zinc-500 text-sm font-black text-zinc-900">
                  {activePage * testimonialsPerPage + index + 1}
                </span>
                <span>
                  <span className="block font-bold text-white">{item.name}</span>
                  <span className="text-sm text-zinc-400">{item.city}</span>
                </span>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActivePage(index)}
              aria-label={`Xem nhóm đánh giá ${index + 1}`}
              className={`h-2 rounded-full transition ${
                index === activePage ? "w-6 bg-[var(--color-accent)]" : "w-2 bg-zinc-600 hover:bg-zinc-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
