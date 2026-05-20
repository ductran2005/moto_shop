import type { CartItem } from "@/types/cart";

const GUEST_CART_KEY = "speedzone_guest_cart";

export type GuestCartInput = {
  productId: string;
  name: string;
  brand: string;
  price: number;
  image: string;
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readGuestCart(): CartItem[] {
  if (!canUseStorage()) return [];

  try {
    const rawValue = window.localStorage.getItem(GUEST_CART_KEY);
    if (!rawValue) return [];

    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? (parsedValue as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function writeGuestCart(items: CartItem[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

export function addGuestCartItem(product: GuestCartInput) {
  const currentItems = readGuestCart();
  const itemId = `guest:${product.productId}`;
  const existingItem = currentItems.find((item) => item.id === itemId);

  const nextItems = existingItem
    ? currentItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item,
      )
    : [
        ...currentItems,
        {
          id: itemId,
          productId: product.productId,
          name: product.name,
          variant: product.brand,
          detail: "Sản phẩm trong giỏ hàng",
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ];

  writeGuestCart(nextItems);
  window.dispatchEvent(new Event("speedzone-guest-cart-change"));
}

export function updateGuestCartItem(id: string, quantity: number) {
  const nextItems = readGuestCart().map((item) =>
    item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
  );

  writeGuestCart(nextItems);
  window.dispatchEvent(new Event("speedzone-guest-cart-change"));
}

export function removeGuestCartItem(id: string) {
  writeGuestCart(readGuestCart().filter((item) => item.id !== id));
  window.dispatchEvent(new Event("speedzone-guest-cart-change"));
}

export function clearGuestCart() {
  writeGuestCart([]);
  window.dispatchEvent(new Event("speedzone-guest-cart-change"));
}
