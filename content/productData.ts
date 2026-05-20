export type ProductCategory =
  | "Xe Máy"
  | "Dầu Nhớt"
  | "Phụ Tùng"
  | "Đồ Chơi Xe"
  | "Chăm Sóc Xe"
  | "Khuyến Mãi";

export const productCategories = [
  { title: "Xe Máy", subtitle: "Đa dạng mẫu mã", icon: "bike", sectionId: "xe-may-products" },
  { title: "Dầu Nhớt", subtitle: "Chính hãng 100%", icon: "oil", sectionId: "dau-nhot-products" },
  { title: "Phụ Tùng", subtitle: "Đảm bảo - Chất lượng", icon: "gear", sectionId: "phu-tung-products" },
  { title: "Đồ Chơi Xe", subtitle: "Cá tính - Phong cách", icon: "scooter", sectionId: "do-choi-xe-products" },
  { title: "Chăm Sóc Xe", subtitle: "Sạch đẹp như mới", icon: "care", sectionId: "bao-duong-products" },
  { title: "Khuyến Mãi", subtitle: "Ưu đãi hấp dẫn", icon: "sale", sectionId: "khuyen-mai-products" },
] as const;

export const products = [
  { id: "honda-winner-x", brand: "Honda", name: "Honda Winner X", salePrice: "46.160.000đ", originalPrice: "48.900.000đ", badge: "HOT", rating: 4.9, reviewCount: 126, image: "/images/products/motorbike-red.png", category: "Xe Máy" },
  { id: "yamaha-exciter-155", brand: "Yamaha", name: "Yamaha Exciter 155", salePrice: "49.500.000đ", originalPrice: "52.000.000đ", badge: "-5%", rating: 4.8, reviewCount: 96, image: "/images/products/motorbike-blue.png", category: "Xe Máy" },
  { id: "honda-winner-x-sport", brand: "Honda", name: "Honda Winner X Sport", salePrice: "48.300.000đ", originalPrice: "50.900.000đ", badge: "HOT", rating: 4.8, reviewCount: 64, image: "/images/products/motorbike-red.png", category: "Xe Máy" },
  { id: "yamaha-exciter-155-gp", brand: "Yamaha", name: "Yamaha Exciter 155 GP", salePrice: "50.200.000đ", originalPrice: "53.000.000đ", badge: "-5%", rating: 4.8, reviewCount: 82, image: "/images/products/motorbike-blue.png", category: "Xe Máy" },
  { id: "honda-winner-x-abs", brand: "Honda", name: "Honda Winner X ABS", salePrice: "47.900.000đ", originalPrice: "50.500.000đ", badge: "-5%", rating: 4.7, reviewCount: 71, image: "/images/products/motorbike-red.png", category: "Xe Máy" },
  { id: "yamaha-exciter-155-premium", brand: "Yamaha", name: "Yamaha Exciter 155 Premium", salePrice: "51.100.000đ", originalPrice: "53.900.000đ", badge: "-5%", rating: 4.9, reviewCount: 58, image: "/images/products/motorbike-blue.png", category: "Xe Máy" },
  { id: "honda-winner-x-black", brand: "Honda", name: "Honda Winner X Black", salePrice: "47.400.000đ", originalPrice: "49.900.000đ", badge: "-5%", rating: 4.8, reviewCount: 69, image: "/images/products/motorbike-red.png", category: "Xe Máy" },
  { id: "yamaha-exciter-155-monster", brand: "Yamaha", name: "Yamaha Exciter 155 Monster", salePrice: "52.300.000đ", originalPrice: "55.000.000đ", badge: "-5%", rating: 4.9, reviewCount: 44, image: "/images/products/motorbike-blue.png", category: "Xe Máy" },
  { id: "honda-winner-x-racing", brand: "Honda", name: "Honda Winner X Racing", salePrice: "49.100.000đ", originalPrice: "51.900.000đ", badge: "-5%", rating: 4.8, reviewCount: 53, image: "/images/products/motorbike-red.png", category: "Xe Máy" },
  { id: "yamaha-exciter-155-limited", brand: "Yamaha", name: "Yamaha Exciter 155 Limited", salePrice: "53.200.000đ", originalPrice: "56.000.000đ", badge: "HOT", rating: 4.9, reviewCount: 39, image: "/images/products/motorbike-blue.png", category: "Xe Máy" },
  { id: "honda-winner-x-special", brand: "Honda", name: "Honda Winner X Special", salePrice: "48.800.000đ", originalPrice: "51.300.000đ", badge: "-5%", rating: 4.7, reviewCount: 61, image: "/images/products/motorbike-red.png", category: "Xe Máy" },
  { id: "yamaha-exciter-155-racing", brand: "Yamaha", name: "Yamaha Exciter 155 Racing", salePrice: "51.700.000đ", originalPrice: "54.500.000đ", badge: "-5%", rating: 4.8, reviewCount: 47, image: "/images/products/motorbike-blue.png", category: "Xe Máy" },
  { id: "motul-7100-10w40", brand: "Motul", name: "Motul 7100 10W-40", salePrice: "550.000đ", originalPrice: "650.000đ", badge: "-15%", rating: 4.9, reviewCount: 256, image: "/images/products/motor-oil.png", category: "Dầu Nhớt" },
  { id: "castrol-power1-ultimate", brand: "Castrol", name: "Castrol Power1 Ultimate", salePrice: "420.000đ", originalPrice: "490.000đ", badge: "-15%", rating: 4.7, reviewCount: 142, image: "/images/products/motor-oil.png", category: "Dầu Nhớt" },
  { id: "motul-300v-10w40", brand: "Motul", name: "Motul 300V 10W-40", salePrice: "690.000đ", originalPrice: "790.000đ", badge: "-13%", rating: 4.9, reviewCount: 118, image: "/images/products/motor-oil.png", category: "Dầu Nhớt" },
  { id: "shell-advance-ultra", brand: "Shell", name: "Shell Advance Ultra", salePrice: "460.000đ", originalPrice: "530.000đ", badge: "-13%", rating: 4.8, reviewCount: 87, image: "/images/products/motor-oil.png", category: "Dầu Nhớt" },
  { id: "repsol-moto-racing", brand: "Repsol", name: "Repsol Moto Racing", salePrice: "510.000đ", originalPrice: "590.000đ", badge: "-14%", rating: 4.7, reviewCount: 69, image: "/images/products/motor-oil.png", category: "Dầu Nhớt" },
  { id: "liqui-moly-street-race", brand: "Liqui Moly", name: "Liqui Moly Street Race", salePrice: "620.000đ", originalPrice: "710.000đ", badge: "-13%", rating: 4.8, reviewCount: 74, image: "/images/products/motor-oil.png", category: "Dầu Nhớt" },
  { id: "michelin-city-grip-2", brand: "Michelin", name: "Michelin City Grip 2", salePrice: "650.000đ", originalPrice: "760.000đ", badge: "HOT", rating: 4.7, reviewCount: 74, image: "/images/products/motorcycle-tire.png", category: "Phụ Tùng" },
  { id: "ngk-maintenance-kit", brand: "NGK", name: "Bộ Phụ Tùng Bảo Dưỡng", salePrice: "890.000đ", originalPrice: "1.050.000đ", badge: "-15%", rating: 4.8, reviewCount: 51, image: "/images/products/chain-kit.png", category: "Phụ Tùng" },
  { id: "brembo-brake-pad", brand: "Brembo", name: "Bố Thắng Brembo", salePrice: "780.000đ", originalPrice: "920.000đ", badge: "-15%", rating: 4.8, reviewCount: 63, image: "/images/products/brake-pad.png", category: "Phụ Tùng" },
  { id: "denso-iridium-plug", brand: "Denso", name: "Bugi Iridium Denso", salePrice: "320.000đ", originalPrice: "390.000đ", badge: "-18%", rating: 4.7, reviewCount: 88, image: "/images/products/spark-plug.png", category: "Phụ Tùng" },
  { id: "did-chain-kit", brand: "DID", name: "Bộ Nhông Sên Dĩa DID", salePrice: "1.250.000đ", originalPrice: "1.450.000đ", badge: "-14%", rating: 4.9, reviewCount: 46, image: "/images/products/chain-kit.png", category: "Phụ Tùng" },
  { id: "yss-rear-shock", brand: "YSS", name: "Phuộc Sau YSS", salePrice: "2.150.000đ", originalPrice: "2.450.000đ", badge: "-12%", rating: 4.8, reviewCount: 39, image: "/images/products/rear-shock.png", category: "Phụ Tùng" },
  { id: "agv-k1-s-rossi", brand: "AGV", name: "AGV K1 S Rossi", salePrice: "4.500.000đ", originalPrice: "5.100.000đ", badge: "-12%", rating: 4.8, reviewCount: 36, image: "/images/products/helmet.png", category: "Đồ Chơi Xe" },
  { id: "shoei-gt-air-2", brand: "Shoei", name: "Shoei GT-Air 2", salePrice: "12.500.000đ", originalPrice: "13.900.000đ", badge: "-10%", rating: 4.9, reviewCount: 28, image: "/images/products/helmet.png", category: "Đồ Chơi Xe" },
  { id: "givi-top-box", brand: "Givi", name: "Thùng Sau Givi", salePrice: "2.300.000đ", originalPrice: "2.650.000đ", badge: "-13%", rating: 4.7, reviewCount: 54, image: "/images/products/top-box.png", category: "Đồ Chơi Xe" },
  { id: "rizoma-mirror", brand: "Rizoma", name: "Gương Rizoma", salePrice: "1.450.000đ", originalPrice: "1.700.000đ", badge: "-15%", rating: 4.8, reviewCount: 41, image: "/images/products/mirror.png", category: "Đồ Chơi Xe" },
  { id: "sc-project-exhaust", brand: "SC Project", name: "Pô SC Project", salePrice: "8.900.000đ", originalPrice: "9.800.000đ", badge: "-9%", rating: 4.9, reviewCount: 33, image: "/images/products/exhaust.png", category: "Đồ Chơi Xe" },
  { id: "speedzone-care-kit", brand: "SpeedZone", name: "Bộ Chăm Sóc Xe Cao Cấp", salePrice: "10.000đ", originalPrice: "450.000đ", badge: "10K", rating: 4.8, reviewCount: 42, image: "/images/products/care-kit.png", category: "Chăm Sóc Xe" },
  { id: "sonax-shampoo", brand: "Sonax", name: "Dung Dịch Rửa Xe Sonax", salePrice: "10.000đ", originalPrice: "310.000đ", badge: "10K", rating: 4.7, reviewCount: 77, image: "/images/products/care-kit.png", category: "Chăm Sóc Xe" },
  { id: "3m-wax", brand: "3M", name: "Sáp Bóng Xe 3M", salePrice: "10.000đ", originalPrice: "410.000đ", badge: "10K", rating: 4.8, reviewCount: 59, image: "/images/products/care-kit.png", category: "Chăm Sóc Xe" },
  { id: "mothers-polish", brand: "Mothers", name: "Dung Dịch Đánh Bóng", salePrice: "10.000đ", originalPrice: "500.000đ", badge: "10K", rating: 4.8, reviewCount: 48, image: "/images/products/care-kit.png", category: "Chăm Sóc Xe" },
  { id: "turtle-wax-cleaner", brand: "Turtle Wax", name: "Làm Sạch Nhanh Turtle Wax", salePrice: "10.000đ", originalPrice: "350.000đ", badge: "10K", rating: 4.7, reviewCount: 66, image: "/images/products/care-kit.png", category: "Chăm Sóc Xe" },
  { id: "promo-honda-winner-x-sport", brand: "Honda", name: "Honda Winner X Sport", salePrice: "48.300.000đ", originalPrice: "50.900.000đ", badge: "HOT", rating: 4.8, reviewCount: 64, image: "/images/products/motorbike-red.png", category: "Khuyến Mãi" },
] as const;
