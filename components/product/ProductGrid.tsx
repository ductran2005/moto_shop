import { ProductCard } from "@/components/ui/ProductCard";
import type { products } from "@/components/product/product-data";

type ProductGridProps = {
  products: typeof products[number][];
};

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;
