import Image from "next/image";

const posts = [
  {
    title: "Cách chọn dầu nhớt phù hợp cho xe máy của bạn",
    date: "20/05/2024",
    image: "/images/blog/motor-oil-guide.png",
  },
  {
    title: "Nhận biết và thay nhông sên dĩa đúng thời điểm",
    date: "18/05/2024",
    image: "/images/blog/chain-maintenance.png",
  },
  {
    title: "Bảo dưỡng phanh đĩa đơn giản tại nhà",
    date: "15/05/2024",
    image: "/images/blog/brake-service.png",
  },
  {
    title: "Top 5 mũ bảo hiểm đáng mua nhất 2024",
    date: "10/05/2024",
    image: "/images/blog/helmet-guide.png",
  },
];

export function BlogSection() {
  return (
    <section id="kien-thuc-kinh-nghiem" className="scroll-mt-28 bg-[var(--color-bg-light)] py-12 md:py-16">
      <div className="speed-container">
        <div className="mb-8 flex items-center justify-between gap-5">
          <h2 className="font-heading text-4xl font-black uppercase text-[var(--color-text-dark)]">
            Kiến Thức & Kinh Nghiệm
          </h2>
          <a
            href="#"
            className="hidden text-xs font-bold uppercase tracking-wide text-[var(--color-text-dark)] hover:text-[var(--color-accent)] sm:block"
          >
            Xem Tất Cả Bài Viết
          </a>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {posts.map((post) => (
            <article
              key={post.title}
              className="group overflow-hidden rounded-[8px] border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/30" />
              </div>
              <div className="p-5">
                <h3 className="min-h-14 text-base font-bold leading-6 text-[var(--color-text-dark)]">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm text-zinc-500">{post.date}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BlogSection;
