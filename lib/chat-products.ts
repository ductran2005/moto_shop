import { products } from "@/content/productData";

export type ChatProductSuggestion = {
  id: string;
  brand: string;
  name: string;
  price: string;
  badge: string;
  image: string;
  category: string;
  reason: string;
};

const productReasons: Record<string, string> = {
  "honda-winner-x": "Côn tay thể thao, hợp đi làm và đi tour cuối tuần.",
  "yamaha-exciter-155": "Máy bốc, dáng trẻ, phù hợp khách thích cảm giác lái mạnh.",
  "honda-winner-x-abs": "Có ABS, cân bằng giữa an toàn và phong cách thể thao.",
  "yamaha-exciter-155-premium": "Bản cao cấp, hợp khách muốn xe nổi bật và nhiều trang bị.",
  "michelin-city-grip-2": "Lốp bám đường tốt, đáng nâng cấp cho xe đi phố.",
  "agv-k1-s-rossi": "Mũ fullface thể thao, hợp xe côn tay và đi xa.",
  "givi-top-box": "Thêm cốp chứa đồ cho nhu cầu đi làm, đi học hằng ngày.",
  "speedzone-care-kit": "Bộ chăm sóc xe gọn, dễ dùng tại nhà.",
};

const scooterSuggestions: ChatProductSuggestion[] = [
  {
    id: "vision-125-premium",
    brand: "Honda",
    name: "Honda Vision 125 Premium",
    price: "Từ 34.000.000đ",
    badge: "Gợi ý",
    image: "/images/products/motorbike-red.png",
    category: "Xe tay ga",
    reason: "Nhẹ, dễ chạy, hợp đi học và đi làm trong phố.",
  },
  {
    id: "yamaha-janus",
    brand: "Yamaha",
    name: "Yamaha Janus",
    price: "Từ 32.000.000đ",
    badge: "Tiết kiệm",
    image: "/images/products/motorbike-blue.png",
    category: "Xe tay ga",
    reason: "Thiết kế trẻ, chi phí hợp lý, dễ xoay trở.",
  },
];

const electricSuggestions: ChatProductSuggestion[] = [
  {
    id: "vinfast-feliz-s",
    brand: "VinFast",
    name: "VinFast Feliz S",
    price: "Từ 29.900.000đ",
    badge: "Xe điện",
    image: "/images/products/motorbike-blue.png",
    category: "Xe điện",
    reason: "Êm, tiết kiệm chi phí vận hành, hợp đi phố mỗi ngày.",
  },
  {
    id: "vinfast-vento-s",
    brand: "VinFast",
    name: "VinFast Vento S",
    price: "Từ 56.000.000đ",
    badge: "Premium",
    image: "/images/products/motorbike-red.png",
    category: "Xe điện",
    reason: "Ngoại hình hiện đại, hợp khách thích xe điện cao cấp.",
  },
];

const baseSuggestions = products
  .filter((product) =>
    [
      "honda-winner-x",
      "yamaha-exciter-155",
      "honda-winner-x-abs",
      "yamaha-exciter-155-premium",
      "michelin-city-grip-2",
      "agv-k1-s-rossi",
      "givi-top-box",
      "speedzone-care-kit",
    ].includes(product.id),
  )
  .map<ChatProductSuggestion>((product) => ({
    id: product.id,
    brand: product.brand,
    name: product.name,
    price: product.salePrice,
    badge: product.badge,
    image: product.image,
    category: product.category,
    reason: productReasons[product.id] ?? "Đang có sẵn tại showroom.",
  }));

export const chatProductCatalog = [...baseSuggestions, ...scooterSuggestions, ...electricSuggestions];

export function getChatProductSuggestions(input: string, limit = 3) {
  const query = input.toLowerCase();
  const scores = chatProductCatalog.map((product) => {
    let score = 0;
    const haystack = `${product.brand} ${product.name} ${product.category} ${product.reason}`.toLowerCase();

    if (haystack.includes("winner") && /winner|honda|côn|con|phượt|phuot|tour|thể thao|the thao/.test(query)) score += 4;
    if (haystack.includes("exciter") && /exciter|yamaha|côn|con|bốc|boc|trẻ|tre|thể thao|the thao/.test(query)) score += 4;
    if (product.category === "Xe tay ga" && /tay ga|đi học|di hoc|đi làm|di lam|nhẹ|nhe|nữ|nu|phố|pho/.test(query)) score += 5;
    if (product.category === "Xe điện" && /xe điện|xe dien|điện|dien|tiết kiệm|tiet kiem|êm|em/.test(query)) score += 5;
    if (product.category === "Phụ Tùng" && /lốp|lop|phụ tùng|phu tung|bảo dưỡng|bao duong|thay/.test(query)) score += 4;
    if (product.category === "Đồ Chơi Xe" && /mũ|mu|nón|non|phụ kiện|phu kien|đồ chơi|do choi|fullface|cốp|cop/.test(query)) score += 4;
    if (product.category === "Chăm Sóc Xe" && /rửa|rua|chăm sóc|cham soc|sạch|sach|bóng|bong/.test(query)) score += 4;
    if (/trả góp|tra gop|góp|gop|ngân sách|ngan sach|giá|gia|bao nhiêu|bao nhieu/.test(query)) score += 1;

    return { product, score };
  });

  const ranked = scores
    .filter((item) => item.score > 0)
    .sort((first, second) => second.score - first.score)
    .map((item) => item.product);

  return (ranked.length ? ranked : chatProductCatalog.slice(0, limit)).slice(0, limit);
}

export function getCatalogPrompt() {
  return chatProductCatalog
    .map(
      (product) =>
        `- ${product.name} (${product.category}, ${product.brand}): ${product.price}. ${product.reason}`,
    )
    .join("\n");
}
