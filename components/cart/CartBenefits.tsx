import { Headset, RefreshCw, ShieldCheck, Truck } from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Sản phẩm chính hãng",
    subtitle: "100% chính hãng",
  },
  {
    icon: Truck,
    title: "Giao hàng toàn quốc",
    subtitle: "Nhanh chóng - An toàn",
  },
  {
    icon: RefreshCw,
    title: "Đổi trả dễ dàng",
    subtitle: "Trong 7 ngày nếu có lỗi",
  },
  {
    icon: Headset,
    title: "Hỗ trợ 24/7",
    subtitle: "Tư vấn kỹ thuật mọi lúc",
  },
];

export function CartBenefits() {
  return (
    <section className="grid gap-5 rounded-lg border border-white/8 bg-white/[0.025] px-5 py-6 md:grid-cols-2 xl:grid-cols-4">
      {benefits.map(({ icon: Icon, title, subtitle }) => (
        <div key={title} className="flex items-center gap-4">
          <Icon className="size-7 shrink-0 text-[var(--color-accent)]" />
          <div>
            <p className="text-xs font-bold uppercase text-white">{title}</p>
            <p className="mt-1 text-xs text-zinc-400">{subtitle}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

export default CartBenefits;
