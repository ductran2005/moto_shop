const reasons = [
  {
    title: "100% Chính Hãng",
    desc: "Cam kết hàng chính hãng, nguồn gốc rõ ràng",
  },
  {
    title: "Giá Cạnh Tranh",
    desc: "Giá tốt nhất thị trường, nhiều ưu đãi",
  },
  {
    title: "Giao Hàng Nhanh",
    desc: "Giao hàng toàn quốc trong 2-3 ngày",
  },
  {
    title: "Đổi Trả Dễ Dàng",
    desc: "Đổi trả trong 7 ngày nếu có lỗi",
  },
  {
    title: "Hỗ Trợ 24/7",
    desc: "Tư vấn kỹ thuật mọi lúc mọi nơi",
  },
];

function ReasonIcon({ index }: { index: number }) {
  const icon = [
    "M12 3 5 6v5c0 4.6 2.8 8 7 10 4.2-2 7-5.4 7-10V6l-7-3Zm-3 9 2 2 4-5",
    "M20 13 13 20 4 11V4h7l9 9Zm-12-5h.01",
    "M3 7h11v10H3V7Zm11 4h4l3 3v3h-7v-6ZM7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm11 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
    "M7 7h11l-3-3m3 3-3 3M17 17H6l3 3m-3-3 3-3",
    "M4 13a8 8 0 0 1 16 0v4a2 2 0 0 1-2 2h-2v-5h4M4 14h4v5H6a2 2 0 0 1-2-2v-3Z",
  ][index];

  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-white" aria-hidden="true">
      <path d={icon} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function WhyChooseUs() {
  return (
    <section
      id="ve-chung-toi"
      className="scroll-mt-28 relative overflow-hidden bg-white py-14 md:py-16"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(232,21,42,0.08),transparent_28%),radial-gradient(circle_at_85%_100%,rgba(17,17,17,0.05),transparent_24%)]" />

      <div className="speed-container relative">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.32em] text-zinc-500">Về Chúng Tôi</p>
          <h2 className="font-heading text-4xl font-black uppercase text-zinc-950 md:text-5xl">
            Vì Sao Chọn <span className="text-[var(--color-accent)]">SpeedZone?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-600 md:text-base">
            Từ sản phẩm chính hãng đến hỗ trợ sau bán hàng, mọi điểm chạm đều được thiết kế cho người chạy xe cần sự chắc chắn và tốc độ.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {reasons.map((reason, index) => (
            <article
              key={reason.title}
              className="rounded-lg border border-zinc-200 bg-white p-5 text-left shadow-[0_14px_32px_rgba(0,0,0,0.08)]"
            >
              <div className="grid h-12 w-12 place-items-center rounded-md bg-[var(--color-accent)] shadow-[0_10px_24px_rgba(232,21,42,0.3)]">
                <ReasonIcon index={index} />
              </div>
              <h3 className="font-heading mt-5 text-lg font-black uppercase text-zinc-950">
                {reason.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{reason.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
