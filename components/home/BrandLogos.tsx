import Image from "next/image";

const brands = [
  { name: "Honda", logo: "/images/brands/honda.svg" },
  { name: "Yamaha", logo: "/images/brands/yamaha.svg" },
  { name: "Suzuki", logo: "/images/brands/suzuki.svg" },
  { name: "Kawasaki", logo: "/images/brands/kawasaki.svg" },
  { name: "Motul", logo: "/images/brands/motul.svg" },
  { name: "Castrol", logo: "/images/brands/castrol.svg" },
  { name: "Michelin", logo: "/images/brands/michelin.svg" },
  { name: "NGK", logo: "/images/brands/ngk.svg" },
];

export function BrandLogos() {
  const marqueeBrands = [...brands, ...brands];

  return (
    <section className="overflow-hidden bg-[var(--color-bg-primary)] py-8">
      <div className="speed-container">
        <p className="mb-7 text-center text-xs font-bold uppercase tracking-[0.25em] text-zinc-300">
          Thương Hiệu Chính Hãng
        </p>
      </div>
      <div className="brand-marquee flex w-max items-center gap-14 px-8">
        {marqueeBrands.map((brand, index) => (
          <span
            key={`${brand.name}-${index}`}
            className="relative flex h-16 min-w-40 items-center justify-center rounded-md bg-white px-5 opacity-90 transition duration-300 hover:opacity-100"
          >
            <span className="relative h-9 w-full">
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                sizes="160px"
                className="object-contain"
              />
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}

export default BrandLogos;
