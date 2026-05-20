export interface CartItem {
  id: string;
  productId?: string;
  name: string;
  variant: string;
  detail: string;
  price: number;
  image: string;
  quantity: number;
}

export interface RecommendationItem {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
}
