"use client";

import Image from "next/image";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import type { FormEvent } from "react";

import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type ProductStatus = "active" | "draft" | "hidden";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
};

type ProductRow = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  sku: string | null;
  brand: string;
  description: string | null;
  sale_price: number;
  original_price: number | null;
  image_url: string;
  badge: string | null;
  rating: number;
  review_count: number;
  stock_quantity: number;
  status: ProductStatus;
  is_featured: boolean;
  categories: { name: string; slug: string } | null;
};

type ProductFormState = {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category_id: string;
  sale_price: string;
  original_price: string;
  stock_quantity: string;
  image_url: string;
  badge: string;
  status: ProductStatus;
  is_featured: boolean;
  description: string;
};

const emptyForm: ProductFormState = {
  name: "",
  slug: "",
  sku: "",
  brand: "SpeedZone",
  category_id: "",
  sale_price: "",
  original_price: "",
  stock_quantity: "0",
  image_url: "/images/products/motor-oil.png",
  badge: "",
  status: "active",
  is_featured: false,
  description: "",
};

function formatCurrency(value: number) {
  return `${value.toLocaleString("vi-VN")}đ`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toForm(product: ProductRow): ProductFormState {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku ?? "",
    brand: product.brand,
    category_id: product.category_id ?? "",
    sale_price: String(product.sale_price),
    original_price: product.original_price === null ? "" : String(product.original_price),
    stock_quantity: String(product.stock_quantity),
    image_url: product.image_url,
    badge: product.badge ?? "",
    status: product.status,
    is_featured: product.is_featured,
    description: product.description ?? "",
  };
}

function statusLabel(status: ProductStatus) {
  return status === "active" ? "Đang bán" : status === "draft" ? "Nháp" : "Ẩn";
}

export function ProductManager() {
  const supabase = createClient();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const stats = useMemo(() => {
    const active = products.filter((product) => product.status === "active").length;
    const lowStock = products.filter((product) => product.stock_quantity > 0 && product.stock_quantity <= 5).length;
    const draft = products.filter((product) => product.status === "draft").length;
    const inventoryValue = products.reduce(
      (total, product) => total + product.sale_price * product.stock_quantity,
      0,
    );

    return [
      { label: "Đang bán", value: active.toLocaleString("vi-VN") },
      { label: "Sắp hết hàng", value: lowStock.toLocaleString("vi-VN") },
      { label: "Nháp", value: draft.toLocaleString("vi-VN") },
      { label: "Giá trị tồn kho", value: formatCurrency(inventoryValue) },
    ];
  }, [products]);

  async function loadData() {
    setIsLoading(true);
    setError(null);

    const [categoriesResult, productsResult] = await Promise.all([
      supabase
        .from("categories")
        .select("id, name, slug")
        .order("sort_order", { ascending: true }),
      supabase
        .from("products")
        .select(
          "id, category_id, name, slug, sku, brand, description, sale_price, original_price, image_url, badge, rating, review_count, stock_quantity, status, is_featured, categories(name, slug)",
        )
        .order("created_at", { ascending: false }),
    ]);

    if (categoriesResult.error || productsResult.error) {
      setError(
        categoriesResult.error?.message ??
          productsResult.error?.message ??
          "Không tải được dữ liệu sản phẩm.",
      );
    } else {
      setCategories((categoriesResult.data ?? []) as CategoryRow[]);
      setProducts((productsResult.data ?? []) as unknown as ProductRow[]);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateForm<K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openCreateForm() {
    setForm({
      ...emptyForm,
      category_id: categories[0]?.id ?? "",
    });
    setIsFormOpen(true);
    setMessage(null);
    setError(null);
  }

  function openEditForm(product: ProductRow) {
    setForm(toForm(product));
    setIsFormOpen(true);
    setMessage(null);
    setError(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const salePrice = Number(form.sale_price);
    const originalPrice = form.original_price ? Number(form.original_price) : null;
    const stockQuantity = Number(form.stock_quantity);

    if (!form.name.trim() || !salePrice || salePrice < 0) {
      setError("Tên sản phẩm và giá bán là bắt buộc.");
      return;
    }

    startTransition(async () => {
      const payload = {
        category_id: form.category_id || null,
        name: form.name.trim(),
        slug: (form.slug || slugify(form.name)).trim(),
        sku: form.sku.trim() || null,
        brand: form.brand.trim() || "SpeedZone",
        description: form.description.trim() || null,
        sale_price: salePrice,
        original_price: originalPrice,
        image_url: form.image_url.trim() || "/images/products/motor-oil.png",
        badge: form.badge.trim() || null,
        stock_quantity: Number.isFinite(stockQuantity) ? stockQuantity : 0,
        status: form.status,
        is_featured: form.is_featured,
      };

      const result = form.id
        ? await supabase.from("products").update(payload).eq("id", form.id)
        : await supabase.from("products").insert(payload);

      if (result.error) {
        setError(result.error.message);
        return;
      }

      setMessage(form.id ? "Đã cập nhật sản phẩm." : "Đã thêm sản phẩm mới.");
      setIsFormOpen(false);
      setForm(emptyForm);
      await loadData();
    });
  }

  function handleDelete(product: ProductRow) {
    const confirmed = window.confirm(`Xóa sản phẩm "${product.name}"?`);
    if (!confirmed) return;

    setMessage(null);
    setError(null);
    startTransition(async () => {
      const { error: deleteError } = await supabase.from("products").delete().eq("id", product.id);

      if (deleteError) {
        setError(deleteError.message);
        return;
      }

      setMessage("Đã xóa sản phẩm.");
      await loadData();
    });
  }

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm text-red-300">Quản lý catalog</p>
          <h1 className="mt-2 font-heading text-3xl font-bold uppercase tracking-[0.08em]">Sản phẩm</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Thêm, sửa, xóa sản phẩm trong database Supabase. Sản phẩm đang bán có thể hiển thị
            ra catalog và được dùng cho giỏ hàng.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-500 bg-red-500 px-4 text-sm font-medium text-white transition hover:bg-red-600"
        >
          <Plus className="h-4 w-4" />
          Thêm sản phẩm
        </button>
      </section>

      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}
      {message ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {message}
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.035] p-5">
            <p className="text-sm text-zinc-400">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold">{item.value}</p>
          </div>
        ))}
      </section>

      {isFormOpen ? (
        <section className="rounded-2xl border border-white/8 bg-white/[0.035] p-5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="font-heading text-lg font-semibold uppercase tracking-[0.08em] text-white">
              {form.id ? "Sửa sản phẩm" : "Thêm sản phẩm"}
            </h2>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="rounded-xl border border-white/10 px-3 py-2 text-sm text-zinc-300 transition hover:text-white"
            >
              Đóng
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-4">
            <label className="grid gap-2 text-sm lg:col-span-2">
              <span className="text-zinc-400">Tên sản phẩm</span>
              <input
                value={form.name}
                onChange={(event) => {
                  updateForm("name", event.target.value);
                  if (!form.id) updateForm("slug", slugify(event.target.value));
                }}
                className="h-11 rounded-2xl border border-white/8 bg-black/20 px-4 text-white outline-none transition focus:border-red-500/40"
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-zinc-400">Slug</span>
              <input
                value={form.slug}
                onChange={(event) => updateForm("slug", slugify(event.target.value))}
                className="h-11 rounded-2xl border border-white/8 bg-black/20 px-4 text-white outline-none transition focus:border-red-500/40"
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-zinc-400">SKU</span>
              <input
                value={form.sku}
                onChange={(event) => updateForm("sku", event.target.value)}
                className="h-11 rounded-2xl border border-white/8 bg-black/20 px-4 text-white outline-none transition focus:border-red-500/40"
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-zinc-400">Thương hiệu</span>
              <input
                value={form.brand}
                onChange={(event) => updateForm("brand", event.target.value)}
                className="h-11 rounded-2xl border border-white/8 bg-black/20 px-4 text-white outline-none transition focus:border-red-500/40"
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-zinc-400">Danh mục</span>
              <select
                value={form.category_id}
                onChange={(event) => updateForm("category_id", event.target.value)}
                className="h-11 rounded-2xl border border-white/8 bg-black/20 px-4 text-white outline-none transition focus:border-red-500/40"
              >
                <option value="" className="bg-[#101012]">Chưa chọn</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id} className="bg-[#101012]">
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-zinc-400">Giá bán</span>
              <input
                type="number"
                value={form.sale_price}
                onChange={(event) => updateForm("sale_price", event.target.value)}
                className="h-11 rounded-2xl border border-white/8 bg-black/20 px-4 text-white outline-none transition focus:border-red-500/40"
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-zinc-400">Giá gốc</span>
              <input
                type="number"
                value={form.original_price}
                onChange={(event) => updateForm("original_price", event.target.value)}
                className="h-11 rounded-2xl border border-white/8 bg-black/20 px-4 text-white outline-none transition focus:border-red-500/40"
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-zinc-400">Tồn kho</span>
              <input
                type="number"
                value={form.stock_quantity}
                onChange={(event) => updateForm("stock_quantity", event.target.value)}
                className="h-11 rounded-2xl border border-white/8 bg-black/20 px-4 text-white outline-none transition focus:border-red-500/40"
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-zinc-400">Badge</span>
              <input
                value={form.badge}
                onChange={(event) => updateForm("badge", event.target.value)}
                placeholder="HOT, -15%"
                className="h-11 rounded-2xl border border-white/8 bg-black/20 px-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500/40"
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="text-zinc-400">Trạng thái</span>
              <select
                value={form.status}
                onChange={(event) => updateForm("status", event.target.value as ProductStatus)}
                className="h-11 rounded-2xl border border-white/8 bg-black/20 px-4 text-white outline-none transition focus:border-red-500/40"
              >
                <option value="active" className="bg-[#101012]">Đang bán</option>
                <option value="draft" className="bg-[#101012]">Nháp</option>
                <option value="hidden" className="bg-[#101012]">Ẩn</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm lg:col-span-2">
              <span className="text-zinc-400">Ảnh sản phẩm</span>
              <input
                value={form.image_url}
                onChange={(event) => updateForm("image_url", event.target.value)}
                className="h-11 rounded-2xl border border-white/8 bg-black/20 px-4 text-white outline-none transition focus:border-red-500/40"
              />
            </label>
            <label className="flex items-center gap-3 pt-7 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(event) => updateForm("is_featured", event.target.checked)}
                className="h-4 w-4 accent-red-500"
              />
              Sản phẩm nổi bật
            </label>
            <label className="grid gap-2 text-sm lg:col-span-4">
              <span className="text-zinc-400">Mô tả</span>
              <textarea
                value={form.description}
                onChange={(event) => updateForm("description", event.target.value)}
                rows={3}
                className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-red-500/40"
              />
            </label>
            <div className="flex justify-end gap-3 lg:col-span-4">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="rounded-2xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 transition hover:text-white"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {form.id ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="rounded-2xl border border-white/8 bg-white/[0.035] p-5">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="font-heading text-lg font-semibold uppercase tracking-[0.08em] text-white">
            Danh sách sản phẩm
          </h2>
          <button
            type="button"
            onClick={() => void loadData()}
            className="text-sm font-medium text-red-400 transition hover:text-red-300"
          >
            Tải lại
          </button>
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center text-zinc-400">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Đang tải sản phẩm...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-white/8 bg-black/20 p-8 text-center text-sm text-zinc-400">
            Chưa có sản phẩm nào trong database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                <tr>
                  <th className="pb-4 font-medium">Sản phẩm</th>
                  <th className="pb-4 font-medium">SKU</th>
                  <th className="pb-4 font-medium">Danh mục</th>
                  <th className="pb-4 font-medium">Tồn kho</th>
                  <th className="pb-4 font-medium">Giá bán</th>
                  <th className="pb-4 font-medium">Trạng thái</th>
                  <th className="pb-4 text-right font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-white/6">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-white">
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            sizes="56px"
                            className="object-contain p-1.5"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-white">{product.name}</p>
                          <p className="mt-1 truncate text-xs text-zinc-500">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-zinc-300">{product.sku ?? "Không có"}</td>
                    <td className="py-4 text-zinc-300">{product.categories?.name ?? "Chưa gán"}</td>
                    <td className={cn("py-4", product.stock_quantity <= 5 ? "text-amber-300" : "text-zinc-300")}>
                      {product.stock_quantity}
                    </td>
                    <td className="py-4 font-medium text-red-300">{formatCurrency(product.sale_price)}</td>
                    <td className="py-4">
                      <span className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium",
                        product.status === "active"
                          ? "bg-emerald-500/12 text-emerald-300"
                          : product.status === "draft"
                            ? "bg-amber-500/12 text-amber-300"
                            : "bg-zinc-500/12 text-zinc-300",
                      )}>
                        {statusLabel(product.status)}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(product)}
                          className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-zinc-300 transition hover:border-red-500/40 hover:text-white"
                          aria-label={`Sửa ${product.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-zinc-300 transition hover:border-red-500/40 hover:text-red-300"
                          aria-label={`Xóa ${product.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default ProductManager;
