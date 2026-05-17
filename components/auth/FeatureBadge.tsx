import type { FeatureBadgeItem } from "@/types/auth";

export function FeatureBadge({ icon: Icon, title, subtitle }: FeatureBadgeItem) {
  return (
    <div className="flex items-center gap-4 text-white">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-[#e31e24]/35 bg-black/25 text-[#e31e24]">
        <Icon aria-hidden="true" className="size-5" strokeWidth={2.1} />
      </span>
      <div>
        <p className="text-sm font-semibold uppercase text-white">{title}</p>
        <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>
      </div>
    </div>
  );
}

export default FeatureBadge;
