import Image from "next/image";
import { Headset, ShieldCheck, Truck } from "lucide-react";

import { FeatureBadge } from "@/components/auth/FeatureBadge";
import type { FeatureBadgeItem } from "@/types/auth";

const FEATURE_BADGES: FeatureBadgeItem[] = [
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
    icon: Headset,
    title: "Hỗ trợ 24/7",
    subtitle: "Tư vấn kỹ thuật mọi lúc",
  },
];

export function HeroBrand() {
  return (
    <section className="relative hidden min-h-[760px] overflow-hidden lg:block">
      <Image
        src="/images/3919b023-ea89-4ffb-aa71-ebff8d7d94da.png"
        alt="Xe máy thể thao SpeedZone trong garage tối"
        fill
        priority
        sizes="50vw"
        className="object-cover object-[62%_center]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0.96)_0%,rgba(10,10,10,0.72)_42%,rgba(10,10,10,0.3)_72%,rgba(10,10,10,0.18)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_88%,rgba(227,30,36,0.3),transparent_28%)]" />

      <div className="relative z-10 flex h-full min-h-[760px] flex-col px-12 py-10 xl:px-16">
        <Image
          src="/images/speedzone-logo.png"
          alt="SpeedZone"
          width={192}
          height={72}
          className="h-auto w-44 object-contain"
        />

        <div className="mt-auto max-w-xl pb-10">
          <h1 className="font-heading text-[clamp(3rem,4vw,4.8rem)] font-black italic uppercase leading-[0.88] text-white">
            Bứt tốc
            <span className="block text-[#e31e24]">Mọi giới hạn</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-8 text-zinc-200">
            Đăng nhập để trải nghiệm thế giới xe máy chính hãng và phụ kiện chất lượng tại
            SpeedZone.
          </p>

          <div className="mt-9 grid gap-6">
            {FEATURE_BADGES.map((feature) => (
              <FeatureBadge key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroBrand;
