"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  BadgePercent,
  Bell,
  Boxes,
  CalendarDays,
  ChevronDown,
  CreditCard,
  Gauge,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Star,
  TrendingUp,
  Users,
  UserRoundCog,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AdminSectionKey } from "@/lib/admin-navigation";
import { cn } from "@/lib/utils";
import { ProductManager } from "@/components/admin/ProductManager";

const navGroups = [
  {
    label: "Quản lý",
    items: [
      { label: "Tổng quan", icon: LayoutDashboard, href: "/admin" },
      { label: "Sản phẩm", icon: Package, href: "/admin/products" },
      { label: "Danh mục", icon: Boxes, href: "/admin/categories" },
      { label: "Đơn hàng", icon: ShoppingBag, badge: "12", href: "/admin/orders" },
      { label: "Khách hàng", icon: Users, href: "/admin/customers" },
      { label: "Banner", icon: Gauge, href: "/admin/banners" },
      { label: "Khuyến mãi", icon: BadgePercent, href: "/admin/promotions" },
      { label: "Đánh giá", icon: Star, href: "/admin/reviews" },
    ],
  },
  {
    label: "Hệ thống",
    items: [
      { label: "Nhân viên", icon: UserRoundCog, href: "/admin/staff" },
      { label: "Vai trò", icon: ShieldCheck, href: "/admin/roles" },
      { label: "Cài đặt", icon: Settings, href: "/admin/settings" },
      { label: "Nhật ký hoạt động", icon: Activity, href: "/admin/activity-log" },
    ],
  },
];

const kpis = [
  { label: "Tổng doanh thu", value: "1.250.000.000đ", delta: "+12.5%", icon: CreditCard },
  { label: "Đơn hàng", value: "320", delta: "+8.3%", icon: ShoppingBag },
  { label: "Khách hàng mới", value: "245", delta: "+15.7%", icon: Users },
  { label: "Sản phẩm", value: "156", delta: "+3.2%", icon: Package },
];

const revenueData = [
  { day: "01/05", revenue: 62 },
  { day: "04/05", revenue: 96 },
  { day: "07/05", revenue: 118 },
  { day: "10/05", revenue: 82 },
  { day: "13/05", revenue: 106 },
  { day: "16/05", revenue: 142 },
  { day: "19/05", revenue: 128 },
  { day: "22/05", revenue: 124 },
  { day: "25/05", revenue: 164 },
  { day: "28/05", revenue: 152 },
  { day: "31/05", revenue: 204 },
];

const orderMix = [
  { name: "Đang xử lý", value: 35, color: "#ef4444" },
  { name: "Đang giao", value: 30, color: "#60a5fa" },
  { name: "Đã giao", value: 25, color: "#22c55e" },
  { name: "Đã hủy", value: 10, color: "#6b7280" },
];

const analyticsData = [
  { label: "T2", views: 540, carts: 210 },
  { label: "T3", views: 680, carts: 248 },
  { label: "T4", views: 610, carts: 236 },
  { label: "T5", views: 760, carts: 290 },
  { label: "T6", views: 820, carts: 322 },
  { label: "T7", views: 940, carts: 356 },
  { label: "CN", views: 710, carts: 270 },
];

const orders = [
  { id: "#DH10045", customer: "Nguyễn Văn An", date: "31/05/2024 14:30", total: "5.650.000đ", status: "Đang xử lý" },
  { id: "#DH10044", customer: "Trần Thị Mai", date: "31/05/2024 13:15", total: "2.850.000đ", status: "Đang giao" },
  { id: "#DH10043", customer: "Lê Minh Tùng", date: "31/05/2024 11:20", total: "7.250.000đ", status: "Đã giao" },
  { id: "#DH10042", customer: "Phạm Quốc Bảo", date: "31/05/2024 10:05", total: "1.450.000đ", status: "Đang xử lý" },
  { id: "#DH10041", customer: "Hoàng Văn Nam", date: "31/05/2024 09:45", total: "3.950.000đ", status: "Đã hủy" },
];

const bestSellers = [
  { rank: 1, name: "Honda Winner X", sold: 120, price: "46.160.000đ", image: "/images/products/motorbike-red.png" },
  { rank: 2, name: "Yamaha Exciter 155", sold: 98, price: "49.500.000đ", image: "/images/products/motorbike-blue.png" },
  { rank: 3, name: "Motul 7100 10W-40", sold: 89, price: "550.000đ", image: "/images/products/motor-oil.png" },
  { rank: 4, name: "AGV K1 S Rossi", sold: 75, price: "4.500.000đ", image: "/images/products/helmet.png" },
];

const customerActivity = [
  { label: "Khách quay lại", value: "68%", note: "+6.4% tuần này" },
  { label: "Giỏ hàng bỏ quên", value: "14%", note: "-2.1% tuần này" },
  { label: "Đánh giá mới", value: "42", note: "4.8/5 trung bình" },
];

const quickActions = ["Tạo sản phẩm", "Duyệt đơn hàng", "Tạo mã giảm giá", "Cập nhật banner"];

const systemStatus = [
  { label: "Thanh toán", value: "Ổn định" },
  { label: "Kho hàng", value: "Đồng bộ" },
  { label: "Giao vận", value: "99.2%" },
];

const sectionContent = {
  products: {
    eyebrow: "Quản lý catalog",
    title: "Sản phẩm",
    description: "Theo dõi tồn kho, giá bán và hiệu suất từng SKU.",
    stats: [
      { label: "Đang bán", value: "156" },
      { label: "Sắp hết hàng", value: "12" },
      { label: "Chờ duyệt", value: "08" },
      { label: "Giá trị tồn kho", value: "2.4 tỷ" },
    ],
    actions: ["Thêm sản phẩm", "Nhập hàng loạt", "Xuất danh sách"],
    columns: ["Sản phẩm", "SKU", "Tồn kho", "Giá bán", "Trạng thái"],
    rows: [
      ["Honda Winner X", "MC-WIN-X", "18", "46.160.000đ", "Đang bán"],
      ["Yamaha Exciter 155", "MC-EX-155", "11", "49.500.000đ", "Đang bán"],
      ["Motul 7100 10W-40", "OIL-7100", "42", "550.000đ", "Đang bán"],
      ["AGV K1 S Rossi", "HEL-K1-S", "04", "4.500.000đ", "Sắp hết"],
    ],
  },
  categories: {
    eyebrow: "Cấu trúc cửa hàng",
    title: "Danh mục",
    description: "Tổ chức catalog để khách tìm sản phẩm nhanh hơn.",
    stats: [
      { label: "Danh mục", value: "18" },
      { label: "Đang hiển thị", value: "16" },
      { label: "Ẩn", value: "02" },
      { label: "Sản phẩm gán", value: "156" },
    ],
    actions: ["Tạo danh mục", "Sắp xếp menu", "Gộp danh mục"],
    columns: ["Danh mục", "Sản phẩm", "Thứ tự", "SEO", "Trạng thái"],
    rows: [
      ["Xe máy", "24", "01", "Tốt", "Hiển thị"],
      ["Dầu nhớt", "36", "02", "Tốt", "Hiển thị"],
      ["Mũ bảo hiểm", "21", "03", "Cần tối ưu", "Hiển thị"],
      ["Phụ kiện", "75", "04", "Tốt", "Hiển thị"],
    ],
  },
  orders: {
    eyebrow: "Vận hành bán hàng",
    title: "Đơn hàng",
    description: "Xử lý thanh toán, giao vận và ngoại lệ đơn hàng.",
    stats: [
      { label: "Đơn hôm nay", value: "48" },
      { label: "Chờ xử lý", value: "12" },
      { label: "Đang giao", value: "96" },
      { label: "Tỷ lệ hoàn tất", value: "92%" },
    ],
    actions: ["Tạo đơn", "In phiếu giao", "Đồng bộ vận chuyển"],
    columns: ["Mã đơn", "Khách hàng", "Tổng tiền", "Thanh toán", "Trạng thái"],
    rows: [
      ["#DH10045", "Nguyễn Văn An", "5.650.000đ", "Đã thanh toán", "Đang xử lý"],
      ["#DH10044", "Trần Thị Mai", "2.850.000đ", "COD", "Đang giao"],
      ["#DH10043", "Lê Minh Tùng", "7.250.000đ", "Đã thanh toán", "Đã giao"],
      ["#DH10042", "Phạm Quốc Bảo", "1.450.000đ", "COD", "Đang xử lý"],
    ],
  },
  customers: {
    eyebrow: "CRM",
    title: "Khách hàng",
    description: "Theo dõi giá trị vòng đời và mức độ gắn bó.",
    stats: [
      { label: "Tổng khách", value: "4.820" },
      { label: "Khách mới", value: "245" },
      { label: "VIP", value: "118" },
      { label: "Tỷ lệ quay lại", value: "68%" },
    ],
    actions: ["Thêm khách", "Phân nhóm", "Gửi chiến dịch"],
    columns: ["Khách hàng", "Số đơn", "Chi tiêu", "Phân nhóm", "Gần nhất"],
    rows: [
      ["Nguyễn Văn An", "12", "42.500.000đ", "VIP", "Hôm nay"],
      ["Trần Thị Mai", "04", "9.250.000đ", "Mới", "Hôm nay"],
      ["Lê Minh Tùng", "08", "18.400.000đ", "Thân thiết", "Hôm qua"],
      ["Phạm Quốc Bảo", "02", "3.250.000đ", "Mới", "2 ngày trước"],
    ],
  },
  banners: {
    eyebrow: "Nội dung",
    title: "Banner",
    description: "Quản lý chiến dịch hình ảnh trên trang chủ và landing page.",
    stats: [
      { label: "Đang chạy", value: "06" },
      { label: "Lên lịch", value: "03" },
      { label: "CTR trung bình", value: "4.8%" },
      { label: "Hết hạn sớm", value: "02" },
    ],
    actions: ["Tạo banner", "Lên lịch", "Xem preview"],
    columns: ["Chiến dịch", "Vị trí", "CTR", "Thời gian", "Trạng thái"],
    rows: [
      ["Summer Ride", "Hero", "5.2%", "01/05 - 31/05", "Đang chạy"],
      ["Oil Care", "Homepage mid", "3.8%", "05/05 - 20/05", "Đang chạy"],
      ["Helmet Week", "Product grid", "4.1%", "20/05 - 31/05", "Lên lịch"],
      ["Member Sale", "Popup", "6.0%", "10/05 - 18/05", "Sắp hết"],
    ],
  },
  promotions: {
    eyebrow: "Tăng trưởng",
    title: "Khuyến mãi",
    description: "Thiết kế ưu đãi nhưng vẫn giữ biên lợi nhuận khỏe.",
    stats: [
      { label: "Đang hoạt động", value: "09" },
      { label: "Đã dùng hôm nay", value: "126" },
      { label: "Doanh thu hỗ trợ", value: "184tr" },
      { label: "Tỷ lệ chuyển đổi", value: "11.2%" },
    ],
    actions: ["Tạo mã", "Tạo flash sale", "Nhân bản ưu đãi"],
    columns: ["Mã", "Loại", "Đã dùng", "Ngân sách", "Trạng thái"],
    rows: [
      ["RIDE10", "Giảm 10%", "82", "30tr", "Đang chạy"],
      ["FREESHIP", "Miễn phí ship", "24", "12tr", "Đang chạy"],
      ["HELMET15", "Giảm 15%", "20", "18tr", "Đang chạy"],
      ["VIP20", "Nhóm VIP", "00", "25tr", "Lên lịch"],
    ],
  },
  reviews: {
    eyebrow: "Uy tín",
    title: "Đánh giá",
    description: "Duyệt phản hồi và xử lý các trải nghiệm chưa tốt.",
    stats: [
      { label: "Chờ duyệt", value: "17" },
      { label: "Điểm trung bình", value: "4.8" },
      { label: "5 sao", value: "84%" },
      { label: "Cần phản hồi", value: "06" },
    ],
    actions: ["Duyệt hàng loạt", "Lọc tiêu cực", "Xuất báo cáo"],
    columns: ["Khách hàng", "Sản phẩm", "Điểm", "Ngày", "Trạng thái"],
    rows: [
      ["Nguyễn Văn An", "Motul 7100", "5 sao", "31/05", "Đã duyệt"],
      ["Trần Thị Mai", "AGV K1 S", "4 sao", "31/05", "Chờ duyệt"],
      ["Lê Minh Tùng", "Winner X", "5 sao", "30/05", "Đã duyệt"],
      ["Phạm Quốc Bảo", "Phanh đĩa", "2 sao", "30/05", "Cần phản hồi"],
    ],
  },
  staff: {
    eyebrow: "Tổ chức",
    title: "Nhân viên",
    description: "Quản lý tài khoản nội bộ và phân công vận hành.",
    stats: [
      { label: "Nhân viên", value: "24" },
      { label: "Đang online", value: "11" },
      { label: "Ca hôm nay", value: "18" },
      { label: "Chờ kích hoạt", value: "03" },
    ],
    actions: ["Thêm nhân viên", "Phân ca", "Xuất danh sách"],
    columns: ["Nhân viên", "Bộ phận", "Vai trò", "Lần cuối", "Trạng thái"],
    rows: [
      ["Hà Minh", "Kho", "Quản lý kho", "5 phút trước", "Online"],
      ["Linh Chi", "CSKH", "Nhân viên", "12 phút trước", "Online"],
      ["Quốc Bảo", "Vận hành", "Supervisor", "Hôm qua", "Offline"],
      ["Mai Anh", "Marketing", "Editor", "Hôm nay", "Online"],
    ],
  },
  roles: {
    eyebrow: "Phân quyền",
    title: "Vai trò",
    description: "Kiểm soát quyền truy cập theo nhóm trách nhiệm.",
    stats: [
      { label: "Vai trò", value: "06" },
      { label: "Quyền hệ thống", value: "42" },
      { label: "Người dùng admin", value: "03" },
      { label: "Cập nhật gần nhất", value: "Hôm nay" },
    ],
    actions: ["Tạo vai trò", "Ma trận quyền", "Nhật ký thay đổi"],
    columns: ["Vai trò", "Người dùng", "Quyền", "Mức truy cập", "Trạng thái"],
    rows: [
      ["Admin", "03", "42", "Toàn quyền", "Hoạt động"],
      ["Quản lý kho", "04", "18", "Kho hàng", "Hoạt động"],
      ["CSKH", "08", "12", "Đơn hàng", "Hoạt động"],
      ["Marketing", "05", "09", "Nội dung", "Hoạt động"],
    ],
  },
  settings: {
    eyebrow: "Cấu hình",
    title: "Cài đặt",
    description: "Tinh chỉnh vận hành cửa hàng và tích hợp hệ thống.",
    stats: [
      { label: "Kênh thanh toán", value: "04" },
      { label: "Đơn vị giao hàng", value: "03" },
      { label: "Thông báo", value: "12" },
      { label: "Tích hợp", value: "08" },
    ],
    actions: ["Lưu cấu hình", "Kiểm tra kết nối", "Sao lưu"],
    columns: ["Nhóm cài đặt", "Giá trị", "Cập nhật", "Người sửa", "Trạng thái"],
    rows: [
      ["Thanh toán", "4 cổng", "Hôm nay", "Admin", "Ổn định"],
      ["Vận chuyển", "3 đối tác", "Hôm qua", "Admin", "Ổn định"],
      ["Email", "SMTP", "28/05", "Admin", "Cần kiểm tra"],
      ["Thuế", "VAT 10%", "20/05", "Admin", "Ổn định"],
    ],
  },
  "activity-log": {
    eyebrow: "Giám sát",
    title: "Nhật ký hoạt động",
    description: "Theo dõi thay đổi quan trọng trong toàn bộ hệ thống.",
    stats: [
      { label: "Sự kiện hôm nay", value: "128" },
      { label: "Cảnh báo", value: "04" },
      { label: "Đăng nhập admin", value: "09" },
      { label: "Thay đổi quyền", value: "02" },
    ],
    actions: ["Xuất log", "Lọc cảnh báo", "Đánh dấu đã xem"],
    columns: ["Thời gian", "Người dùng", "Hành động", "Khu vực", "Mức độ"],
    rows: [
      ["14:30", "Admin", "Cập nhật giá", "Sản phẩm", "Thông tin"],
      ["13:18", "Hà Minh", "Điều chỉnh tồn kho", "Kho", "Thông tin"],
      ["11:42", "Admin", "Đổi quyền", "Vai trò", "Cảnh báo"],
      ["09:10", "Hệ thống", "Lỗi SMTP", "Cài đặt", "Cảnh báo"],
    ],
  },
} satisfies Record<Exclude<AdminSectionKey, "overview">, {
  eyebrow: string;
  title: string;
  description: string;
  stats: Array<{ label: string; value: string }>;
  actions: string[];
  columns: string[];
  rows: string[][];
}>;

function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -3 }}
      className={cn(
        "rounded-2xl border border-white/8 bg-white/[0.035] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-colors hover:border-red-500/25",
        className,
      )}
    >
      {children}
    </motion.section>
  );
}

function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <h2 className="font-heading text-lg font-semibold uppercase tracking-[0.08em] text-white">{title}</h2>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="text-sm font-medium text-red-400 transition hover:text-red-300"
        >
          {action}
        </button>
      )}
    </div>
  );
}

function ActionDialog({
  title,
  description,
  formKind,
  onClose,
}: {
  title: string;
  description: string;
  formKind?: "product" | "category" | "order" | "customer" | "banner" | "promotion" | "staff" | "role";
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-[#101012] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.48)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-red-300">Thao tác</p>
            <h3 className="mt-2 text-xl font-semibold">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 p-2 text-zinc-400 transition hover:text-white"
            aria-label="Đóng hộp thoại"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-4 text-sm leading-6 text-zinc-400">{description}</p>
        {formKind ? <ActionForm kind={formKind} /> : <WorkflowPanel title={title} />}
      </motion.div>
    </motion.div>
  );
}

const workflowFields: Record<string, Array<{ label: string; placeholder: string }>> = {
  "Nhập hàng loạt": [
    { label: "Tệp dữ liệu", placeholder: "products.xlsx" },
    { label: "Chế độ nhập", placeholder: "Cập nhật nếu trùng SKU" },
  ],
  "Xuất danh sách": [
    { label: "Định dạng", placeholder: "Excel (.xlsx)" },
    { label: "Phạm vi", placeholder: "Toàn bộ dữ liệu" },
  ],
  "Sắp xếp menu": [
    { label: "Nhóm menu", placeholder: "Danh mục chính" },
    { label: "Kiểu sắp xếp", placeholder: "Kéo thả thủ công" },
  ],
  "Gộp danh mục": [
    { label: "Danh mục nguồn", placeholder: "Phụ tùng cũ" },
    { label: "Danh mục đích", placeholder: "Phụ kiện" },
  ],
  "In phiếu giao": [
    { label: "Mẫu in", placeholder: "Phiếu giao tiêu chuẩn" },
    { label: "Số bản", placeholder: "1" },
  ],
  "Đồng bộ vận chuyển": [
    { label: "Đối tác", placeholder: "GHN" },
    { label: "Phạm vi", placeholder: "Đơn đang giao" },
  ],
  "Thêm khách": [
    { label: "Họ tên", placeholder: "Nguyễn Văn An" },
    { label: "Số điện thoại", placeholder: "090..." },
  ],
  "Phân nhóm": [
    { label: "Điều kiện", placeholder: "Chi tiêu > 10.000.000đ" },
    { label: "Tên nhóm", placeholder: "VIP" },
  ],
  "Gửi chiến dịch": [
    { label: "Chiến dịch", placeholder: "Khách quay lại tháng 5" },
    { label: "Kênh gửi", placeholder: "Email + SMS" },
  ],
  "Lên lịch": [
    { label: "Ngày bắt đầu", placeholder: "2026-05-18" },
    { label: "Khung giờ", placeholder: "08:00" },
  ],
  "Xem preview": [
    { label: "Thiết bị", placeholder: "Desktop" },
    { label: "Trang hiển thị", placeholder: "Trang chủ" },
  ],
  "Tạo flash sale": [
    { label: "Tên đợt sale", placeholder: "Flash Sale 20h" },
    { label: "Thời lượng", placeholder: "4 giờ" },
  ],
  "Nhân bản ưu đãi": [
    { label: "Ưu đãi nguồn", placeholder: "RIDE10" },
    { label: "Mã mới", placeholder: "RIDE10-JUNE" },
  ],
  "Duyệt hàng loạt": [
    { label: "Phạm vi", placeholder: "Đánh giá 4-5 sao" },
    { label: "Số lượng", placeholder: "17 đánh giá" },
  ],
  "Lọc tiêu cực": [
    { label: "Điểm tối đa", placeholder: "2 sao" },
    { label: "Từ khóa", placeholder: "giao chậm, lỗi" },
  ],
  "Xuất báo cáo": [
    { label: "Kỳ báo cáo", placeholder: "Tháng này" },
    { label: "Định dạng", placeholder: "PDF" },
  ],
  "Phân ca": [
    { label: "Ca làm", placeholder: "Ca sáng" },
    { label: "Nhân viên", placeholder: "Chọn nhân viên" },
  ],
  "Tạo vai trò": [
    { label: "Tên vai trò", placeholder: "Quản lý kho" },
    { label: "Mức truy cập", placeholder: "Kho hàng" },
  ],
  "Ma trận quyền": [
    { label: "Vai trò", placeholder: "CSKH" },
    { label: "Nhóm quyền", placeholder: "Đơn hàng" },
  ],
  "Nhật ký thay đổi": [
    { label: "Khoảng thời gian", placeholder: "7 ngày qua" },
    { label: "Người thao tác", placeholder: "Tất cả" },
  ],
  "Lưu cấu hình": [
    { label: "Nhóm cấu hình", placeholder: "Thanh toán" },
    { label: "Môi trường", placeholder: "Production" },
  ],
  "Kiểm tra kết nối": [
    { label: "Dịch vụ", placeholder: "SMTP" },
    { label: "Mức kiểm tra", placeholder: "Đầy đủ" },
  ],
  "Sao lưu": [
    { label: "Phạm vi", placeholder: "Toàn bộ cấu hình" },
    { label: "Nơi lưu", placeholder: "Cloud backup" },
  ],
  "Xuất log": [
    { label: "Khoảng thời gian", placeholder: "24 giờ qua" },
    { label: "Định dạng", placeholder: "CSV" },
  ],
  "Lọc cảnh báo": [
    { label: "Mức độ", placeholder: "Cảnh báo" },
    { label: "Khu vực", placeholder: "Tất cả" },
  ],
  "Đánh dấu đã xem": [
    { label: "Phạm vi", placeholder: "4 cảnh báo" },
    { label: "Người xác nhận", placeholder: "Admin" },
  ],
  "Duyệt đơn hàng": [
    { label: "Phạm vi", placeholder: "Đơn chờ xử lý" },
    { label: "Số lượng", placeholder: "12 đơn" },
  ],
  "Cập nhật banner": [
    { label: "Banner", placeholder: "Summer Ride" },
    { label: "Vị trí", placeholder: "Hero" },
  ],
};

function WorkflowPanel({ title }: { title: string }) {
  const fields = workflowFields[title] ?? [
    { label: "Phạm vi", placeholder: "Toàn bộ dữ liệu liên quan" },
    { label: "Ghi chú", placeholder: "Nhập thông tin bổ sung" },
  ];

  return (
    <form className="mt-5 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <Field key={field.label} label={field.label} placeholder={field.placeholder} />
        ))}
      </div>
      <label className="grid gap-2 text-sm">
        <span className="text-zinc-400">Ghi chú</span>
        <textarea
          placeholder="Thêm ghi chú cho thao tác này..."
          className="min-h-24 rounded-2xl border border-white/8 bg-white/[0.035] px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500/40"
        />
      </label>
      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          className="rounded-2xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 transition hover:border-white/20 hover:text-white"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="rounded-2xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600"
        >
          Xác nhận
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="text-zinc-400">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="h-11 rounded-2xl border border-white/8 bg-white/[0.035] px-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500/40"
      />
    </label>
  );
}

function SelectField({
  label,
  options,
}: {
  label: string;
  options: string[];
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="text-zinc-400">{label}</span>
      <select className="h-11 rounded-2xl border border-white/8 bg-white/[0.035] px-4 text-white outline-none transition focus:border-red-500/40">
        {options.map((option) => (
          <option key={option} className="bg-[#101012]">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ActionForm({ kind }: { kind: NonNullable<Parameters<typeof ActionDialog>[0]["formKind"]> }) {
  const submitLabel = {
    product: "Lưu sản phẩm",
    category: "Lưu danh mục",
    order: "Tạo đơn hàng",
    customer: "Lưu khách hàng",
    banner: "Lưu banner",
    promotion: "Lưu khuyến mãi",
    staff: "Lưu nhân viên",
    role: "Lưu vai trò",
  }[kind];

  return (
    <form className="mt-5 space-y-4">
      {kind === "product" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tên sản phẩm" placeholder="Honda Winner X" />
            <Field label="SKU" placeholder="MC-WIN-X" />
            <SelectField label="Danh mục" options={["Xe máy", "Dầu nhớt", "Mũ bảo hiểm", "Phụ kiện"]} />
            <Field label="Giá bán" placeholder="46160000" type="number" />
            <Field label="Tồn kho" placeholder="18" type="number" />
            <SelectField label="Trạng thái" options={["Đang bán", "Nháp", "Ẩn"]} />
          </div>
          <label className="grid gap-2 text-sm">
            <span className="text-zinc-400">Mô tả ngắn</span>
            <textarea
              placeholder="Mô tả nổi bật của sản phẩm..."
              className="min-h-24 rounded-2xl border border-white/8 bg-white/[0.035] px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500/40"
            />
          </label>
        </>
      )}

      {kind === "category" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tên danh mục" placeholder="Mũ bảo hiểm" />
          <Field label="Slug" placeholder="mu-bao-hiem" />
          <Field label="Thứ tự hiển thị" placeholder="03" type="number" />
          <SelectField label="Trạng thái" options={["Hiển thị", "Ẩn"]} />
        </div>
      )}

      {kind === "order" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Khách hàng" placeholder="Nguyễn Văn An" />
            <Field label="Số điện thoại" placeholder="090..." />
            <SelectField label="Thanh toán" options={["COD", "Đã thanh toán", "Chuyển khoản"]} />
            <SelectField label="Giao vận" options={["Giao tiêu chuẩn", "Giao nhanh"]} />
          </div>
          <Field label="Sản phẩm" placeholder="Tìm và thêm sản phẩm..." />
        </>
      )}

      {kind === "customer" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Họ tên" placeholder="Nguyễn Văn An" />
          <Field label="Số điện thoại" placeholder="090..." />
          <Field label="Email" placeholder="customer@email.com" type="email" />
          <SelectField label="Phân nhóm" options={["Mới", "Thân thiết", "VIP"]} />
        </div>
      )}

      {kind === "banner" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tên chiến dịch" placeholder="Summer Ride" />
            <SelectField label="Vị trí" options={["Hero", "Homepage mid", "Popup", "Product grid"]} />
            <Field label="Ngày bắt đầu" placeholder="2026-05-18" type="date" />
            <Field label="Ngày kết thúc" placeholder="2026-05-31" type="date" />
          </div>
          <Field label="Ảnh banner" placeholder="Chọn hoặc tải ảnh lên" />
        </>
      )}

      {kind === "promotion" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Mã giảm giá" placeholder="RIDE10" />
          <SelectField label="Loại ưu đãi" options={["Giảm phần trăm", "Giảm tiền", "Miễn phí ship"]} />
          <Field label="Giá trị" placeholder="10" type="number" />
          <Field label="Ngân sách" placeholder="30000000" type="number" />
          <Field label="Ngày bắt đầu" placeholder="2026-05-18" type="date" />
          <Field label="Ngày kết thúc" placeholder="2026-05-31" type="date" />
        </div>
      )}

      {kind === "staff" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Họ tên" placeholder="Hà Minh" />
          <Field label="Email" placeholder="staff@speedzone.vn" type="email" />
          <SelectField label="Bộ phận" options={["Kho", "CSKH", "Marketing", "Vận hành"]} />
          <SelectField label="Vai trò" options={["Nhân viên", "Supervisor", "Quản lý kho", "Editor"]} />
        </div>
      )}

      {kind === "role" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tên vai trò" placeholder="Quản lý kho" />
            <SelectField label="Mức truy cập" options={["Toàn quyền", "Kho hàng", "Đơn hàng", "Nội dung"]} />
          </div>
          <label className="grid gap-2 text-sm">
            <span className="text-zinc-400">Mô tả quyền</span>
            <textarea
              placeholder="Mô tả phạm vi quyền của vai trò..."
              className="min-h-24 rounded-2xl border border-white/8 bg-white/[0.035] px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500/40"
            />
          </label>
        </>
      )}

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          className="rounded-2xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 transition hover:border-white/20 hover:text-white"
        >
          Lưu nháp
        </button>
        <button
          type="submit"
          className="rounded-2xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function Sidebar({
  collapsed,
  mobileOpen,
  onCollapse,
  onCloseMobile,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  onCollapse: () => void;
  onCloseMobile: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.button
            aria-label="Đóng menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
            onClick={onCloseMobile}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 92 : 276 }}
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-white/8 bg-[#09090b]/96 px-4 py-5 backdrop-blur-2xl lg:flex lg:flex-col",
          mobileOpen && "!flex !w-[min(86vw,320px)] flex-col",
        )}
      >
        <div className="mb-8 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-red-500 to-red-800 shadow-[0_0_24px_rgba(239,68,68,0.32)]">
              <TrendingUp className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="font-heading text-xl font-bold uppercase leading-none">SpeedZone</p>
                <p className="mt-1 text-xs text-zinc-400">Admin Panel</p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onCollapse}
            className="hidden rounded-xl border border-white/10 p-2 text-zinc-400 transition hover:border-red-500/40 hover:text-white lg:block"
            aria-label="Thu gọn sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-xl border border-white/10 p-2 text-zinc-400 lg:hidden"
            aria-label="Đóng sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="space-y-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              {(!collapsed || mobileOpen) && <p className="mb-3 px-3 text-xs uppercase tracking-[0.18em] text-zinc-500">{group.label}</p>}
              <div className="space-y-1.5">
                {group.items.map(({ label, icon: Icon, href, badge }) => {
                  const active = href === "/admin" ? pathname === href : pathname.startsWith(href);

                  return (
                  <Link
                    key={label}
                    href={href}
                    onClick={onCloseMobile}
                    className={cn(
                      "group flex h-11 w-full items-center justify-between rounded-2xl px-3 text-sm text-zinc-300 transition",
                      active
                        ? "bg-red-500/14 text-white shadow-[0_0_24px_rgba(239,68,68,0.18)] ring-1 ring-red-500/35"
                        : "hover:bg-white/[0.05] hover:text-white",
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <Icon className="h-[18px] w-[18px] shrink-0" />
                      {(!collapsed || mobileOpen) && <span className="truncate">{label}</span>}
                    </span>
                    {(!collapsed || mobileOpen) && badge && (
                      <span className="rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-semibold text-white">{badge}</span>
                    )}
                  </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {(!collapsed || mobileOpen) && (
          <div className="mt-auto overflow-hidden rounded-2xl border border-white/8 bg-black/35">
            <div className="relative h-28">
              <Image src="/images/products/motorbike-red.png" alt="" fill className="object-cover opacity-65" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
            </div>
            <div className="p-4">
              <p className="font-medium text-white">SpeedZone Admin</p>
              <p className="mt-1 text-xs text-zinc-400">Quản trị hệ thống</p>
            </div>
          </div>
        )}
      </motion.aside>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const classes =
    status === "Đã giao"
      ? "bg-emerald-500/12 text-emerald-300"
      : status === "Đang giao"
        ? "bg-sky-500/12 text-sky-300"
        : status === "Đã hủy"
          ? "bg-red-500/12 text-red-300"
          : "bg-amber-500/12 text-amber-300";

  return <span className={cn("rounded-full px-3 py-1 text-xs font-medium", classes)}>{status}</span>;
}

function SectionWorkspace({
  section,
  onAction,
}: {
  section: Exclude<AdminSectionKey, "overview">;
  onAction: (
    title: string,
    description: string,
    formKind?: "product" | "category" | "order" | "customer" | "banner" | "promotion" | "staff" | "role",
  ) => void;
}) {
  const content = sectionContent[section];

  if (section === "products") {
    return <ProductManager />;
  }

  const primaryFormKind:
    | "product"
    | "category"
    | "order"
    | "customer"
    | "banner"
    | "promotion"
    | "staff"
    | "role"
    | undefined =
    section === "categories"
        ? "category"
        : section === "orders"
          ? "order"
          : section === "customers"
            ? "customer"
          : section === "banners"
            ? "banner"
            : section === "promotions"
              ? "promotion"
              : section === "staff"
                ? "staff"
                : section === "roles"
                  ? "role"
                : undefined;

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm text-red-300">{content.eyebrow}</p>
          <h1 className="mt-2 font-heading text-3xl font-bold uppercase tracking-[0.08em]">{content.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">{content.description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {content.actions.map((action, index) => (
            <button
              key={action}
              type="button"
              onClick={() =>
                onAction(
                  action,
                  `${action} cho khu vực ${content.title.toLowerCase()}.`,
                  index === 0 ? primaryFormKind : undefined,
                )
              }
              className={cn(
                "rounded-2xl border px-4 py-2.5 text-sm transition",
                index === 0
                  ? "border-red-500 bg-red-500 text-white hover:bg-red-600"
                  : "border-white/10 bg-white/[0.035] text-zinc-200 hover:border-red-500/35 hover:bg-red-500/10",
              )}
            >
              {action}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {content.stats.map((item) => (
          <Panel key={item.label} className="p-5">
            <p className="text-sm text-zinc-400">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold">{item.value}</p>
          </Panel>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.8fr]">
        <Panel>
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="font-heading text-lg font-semibold uppercase tracking-[0.08em] text-white">
              Danh sách {content.title.toLowerCase()}
            </h2>
            <button
              type="button"
              onClick={() => onAction("Bộ lọc", `Thiết lập bộ lọc cho danh sách ${content.title.toLowerCase()}.`)}
              className="text-sm font-medium text-red-400 transition hover:text-red-300"
            >
              Bộ lọc
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                <tr>
                  {content.columns.map((column) => (
                    <th key={column} className="pb-4 font-medium">{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {content.rows.map((row) => (
                  <tr key={row.join("-")} className="border-t border-white/6">
                    {row.map((cell, index) => (
                      <td key={`${cell}-${index}`} className={cn("py-4", index === row.length - 1 ? "text-red-300" : index === 0 ? "text-white" : "text-zinc-300")}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="grid gap-6">
          <Panel>
            <SectionTitle title="Việc cần xử lý" />
            <div className="space-y-3">
              {content.actions.map((action, index) => (
                <div key={action} className="rounded-2xl border border-white/6 bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{action}</p>
                    <span className="rounded-full bg-red-500/12 px-2.5 py-1 text-xs text-red-300">0{index + 2}</span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">Ưu tiên xử lý trong ca hiện tại.</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <SectionTitle title="Ghi chú vận hành" />
            <div className="space-y-3 text-sm text-zinc-300">
              <p className="rounded-2xl border border-white/6 bg-black/20 p-4">Dữ liệu được đồng bộ gần nhất lúc 14:30.</p>
              <p className="rounded-2xl border border-white/6 bg-black/20 p-4">Không có lỗi chặn luồng xử lý chính.</p>
            </div>
          </Panel>
        </div>
      </section>
    </div>
  );
}

export function AdminDashboard({ section }: { section: AdminSectionKey }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [activeAction, setActiveAction] = useState<{
    title: string;
    description: string;
    formKind?: "product" | "category" | "order" | "customer" | "banner" | "promotion" | "staff" | "role";
  } | null>(null);
  const [openPopover, setOpenPopover] = useState<"date" | "notifications" | "profile" | null>(null);
  const chartsReady = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  async function handleSignOut() {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#050507] text-white">
      <AnimatePresence>
        {activeAction && (
          <ActionDialog
            title={activeAction.title}
            description={activeAction.description}
            formKind={activeAction.formKind}
            onClose={() => setActiveAction(null)}
          />
        )}
      </AnimatePresence>
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCollapse={() => setCollapsed((value) => !value)}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div
        className={cn(
          "min-h-screen transition-[padding] duration-300 lg:pl-[276px]",
          collapsed && "lg:pl-[92px]",
        )}
      >
        <header className="sticky top-0 z-20 border-b border-white/8 bg-[#050507]/72 px-4 py-4 backdrop-blur-2xl sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="rounded-2xl border border-white/10 p-3 text-zinc-300 lg:hidden"
                aria-label="Mở sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>
              <label className="relative hidden sm:block">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  placeholder="Tìm đơn hàng, sản phẩm..."
                  className="h-12 w-[280px] rounded-2xl border border-white/8 bg-white/[0.035] pl-11 pr-4 text-sm outline-none transition placeholder:text-zinc-500 focus:border-red-500/40"
                />
              </label>
            </div>

            <div className="flex items-center justify-between gap-2 sm:justify-end sm:gap-3">
              <div className="relative flex-1 sm:flex-none">
              <button
                type="button"
                onClick={() => setOpenPopover((value) => (value === "date" ? null : "date"))}
                className="inline-flex h-11 w-full min-w-0 items-center justify-center gap-2 rounded-2xl border border-white/8 bg-white/[0.035] px-3 text-xs text-zinc-200 sm:h-12 sm:w-auto sm:px-4 sm:text-sm"
              >
                <CalendarDays className="h-4 w-4 text-red-400" />
                <span className="truncate">01/05/2024 - 31/05/2024</span>
                <ChevronDown className="hidden h-4 w-4 text-zinc-500 sm:block" />
              </button>
              <AnimatePresence>
                {openPopover === "date" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-[calc(100%+12px)] z-30 w-64 rounded-2xl border border-white/10 bg-[#101012]/95 p-3 shadow-[0_18px_48px_rgba(0,0,0,0.36)]"
                  >
                    {["Hôm nay", "7 ngày qua", "30 ngày qua", "Tháng này"].map((range) => (
                      <button
                        key={range}
                        type="button"
                        onClick={() => {
                          setOpenPopover(null);
                          setActiveAction({ title: range, description: `Đã chọn bộ lọc thời gian: ${range}.` });
                        }}
                        className="block w-full rounded-xl px-3 py-2 text-left text-sm text-zinc-300 transition hover:bg-red-500/12 hover:text-white"
                      >
                        {range}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
              <div className="relative">
              <button
                type="button"
                onClick={() => setOpenPopover((value) => (value === "notifications" ? null : "notifications"))}
                className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/8 bg-white/[0.035] text-zinc-300 transition hover:border-red-500/30 hover:text-white sm:h-12 sm:w-12"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
              </button>
              <AnimatePresence>
                {openPopover === "notifications" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-[calc(100%+12px)] z-30 w-72 rounded-2xl border border-white/10 bg-[#101012]/95 p-3 shadow-[0_18px_48px_rgba(0,0,0,0.36)]"
                  >
                    {["12 đơn hàng chờ xử lý", "4 đánh giá cần phản hồi", "2 banner sắp hết hạn"].map((item) => (
                      <div key={item} className="rounded-xl px-3 py-2 text-sm text-zinc-300">
                        {item}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenPopover((value) => (value === "profile" ? null : "profile"))}
                  aria-expanded={openPopover === "profile"}
                  className="flex h-11 items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.035] px-2.5 transition hover:border-red-500/30 sm:h-12 sm:px-3 sm:pr-4"
                >
                  <Image src="/images/products/helmet.png" alt="" width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
                  <span className="hidden text-left sm:block">
                    <span className="block text-sm font-medium">Admin</span>
                    <span className="block text-xs text-zinc-500">Quản trị viên</span>
                  </span>
                  <ChevronDown className={cn("hidden h-4 w-4 text-zinc-500 transition sm:block", openPopover === "profile" && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {openPopover === "profile" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-[calc(100%+12px)] z-30 w-52 rounded-2xl border border-white/10 bg-[#101012]/95 p-2 shadow-[0_18px_48px_rgba(0,0,0,0.36)] backdrop-blur-xl"
                    >
                      <button
                        type="button"
                        onClick={() => void handleSignOut()}
                        disabled={isSigningOut}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-200 transition hover:bg-red-500/12 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <LogOut className="h-4 w-4 text-red-400" />
                        <span>{isSigningOut ? "Đang đăng xuất..." : "Đăng xuất"}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {section !== "overview" ? (
          <SectionWorkspace
            section={section}
            onAction={(title, description, formKind) => setActiveAction({ title, description, formKind })}
          />
        ) : (
        <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section>
            <p className="text-sm text-zinc-400">Xin chào, <span className="text-red-400">Admin</span>. Chúc bạn một ngày làm việc hiệu quả.</p>
            <h1 className="mt-2 font-heading text-3xl font-bold uppercase tracking-[0.08em]">Tổng quan</h1>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map(({ label, value, delta, icon: Icon }) => (
              <Panel key={label} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-zinc-400">{label}</p>
                    <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
                    <p className="mt-3 text-sm text-emerald-400">{delta} so với tháng trước</p>
                  </div>
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-red-500/14 text-red-300 shadow-[0_0_24px_rgba(239,68,68,0.15)]">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </Panel>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
            <Panel>
              <SectionTitle
                title="Doanh thu"
                action="Theo ngày"
                onAction={() => setActiveAction({ title: "Theo ngày", description: "Đổi chế độ xem biểu đồ doanh thu theo ngày." })}
              />
              <div className="h-[320px]">
                {chartsReady && (
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ef4444" stopOpacity={0.38} />
                          <stop offset="100%" stopColor="#ef4444" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
                      <XAxis dataKey="day" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          background: "#111113",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "16px",
                        }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={3} fill="url(#revenueFill)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Panel>

            <Panel>
              <SectionTitle title="Tỷ lệ đơn hàng" />
              <div className="grid items-center gap-5 md:grid-cols-[220px_1fr] xl:grid-cols-1 2xl:grid-cols-[220px_1fr]">
                <div className="relative h-[220px]">
                  {chartsReady && (
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                      <PieChart>
                        <Pie data={orderMix} dataKey="value" innerRadius={66} outerRadius={96} paddingAngle={2}>
                          {orderMix.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                  <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                    <div>
                      <p className="text-3xl font-semibold">320</p>
                      <p className="text-sm text-zinc-400">Tổng đơn</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {orderMix.map((item) => (
                    <div key={item.name} className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex items-center gap-3 text-zinc-300">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.name}
                      </span>
                      <span>{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
            <Panel>
              <SectionTitle
                title="Đơn hàng mới nhất"
                action="Xem tất cả"
                onAction={() => setActiveAction({ title: "Tất cả đơn hàng", description: "Mở danh sách đầy đủ các đơn hàng gần đây." })}
              />
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                    <tr>
                      <th className="pb-4 font-medium">Mã đơn</th>
                      <th className="pb-4 font-medium">Khách hàng</th>
                      <th className="pb-4 font-medium">Ngày đặt</th>
                      <th className="pb-4 font-medium">Tổng tiền</th>
                      <th className="pb-4 font-medium">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-t border-white/6">
                        <td className="py-4 text-zinc-300">{order.id}</td>
                        <td className="py-4">{order.customer}</td>
                        <td className="py-4 text-zinc-400">{order.date}</td>
                        <td className="py-4">{order.total}</td>
                        <td className="py-4"><StatusBadge status={order.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <Panel>
              <SectionTitle
                title="Sản phẩm bán chạy"
                action="Xem tất cả"
                onAction={() => setActiveAction({ title: "Tất cả sản phẩm bán chạy", description: "Mở danh sách đầy đủ sản phẩm bán chạy." })}
              />
              <div className="space-y-4">
                {bestSellers.map((product) => (
                  <div key={product.name} className="flex items-center gap-4 rounded-2xl border border-white/6 bg-black/20 p-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/8 text-sm">{product.rank}</span>
                    <Image src={product.image} alt="" width={56} height={56} className="h-14 w-14 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{product.name}</p>
                      <p className="mt-1 text-sm text-zinc-400">Đã bán: {product.sold}</p>
                    </div>
                    <p className="text-sm font-semibold text-red-400">{product.price}</p>
                  </div>
                ))}
              </div>
            </Panel>
          </section>

          <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-[0.9fr_1.15fr_0.85fr]">
            <Panel>
              <SectionTitle title="Hoạt động khách hàng" />
              <div className="space-y-4">
                {customerActivity.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/6 bg-black/20 p-4">
                    <p className="text-sm text-zinc-400">{item.label}</p>
                    <div className="mt-2 flex items-end justify-between gap-3">
                      <p className="text-2xl font-semibold">{item.value}</p>
                      <p className="text-sm text-red-300">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel>
              <SectionTitle title="Analytics" />
              <div className="h-[250px]">
                {chartsReady && (
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart data={analyticsData}>
                      <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
                      <XAxis dataKey="label" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          background: "#111113",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "16px",
                        }}
                      />
                      <Bar dataKey="views" radius={[8, 8, 0, 0]} fill="#27272a" />
                      <Bar dataKey="carts" radius={[8, 8, 0, 0]} fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Panel>

            <div className="grid gap-6">
              <Panel>
                <SectionTitle title="Tăng trưởng doanh thu" />
                <p className="text-4xl font-semibold">+18.4%</p>
                <p className="mt-2 text-sm text-zinc-400">So với cùng kỳ tháng trước</p>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/8">
                  <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-red-500 to-red-700" />
                </div>
              </Panel>

              <Panel>
                <SectionTitle title="Quick actions" />
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  {quickActions.map((action) => (
                    <button
                      key={action}
                      type="button"
                      onClick={() =>
                        setActiveAction({
                          title: action,
                          description: `Mở quy trình nhanh: ${action.toLowerCase()}.`,
                          formKind:
                            action === "Tạo sản phẩm"
                              ? "product"
                              : action === "Tạo mã giảm giá"
                                ? "promotion"
                                : undefined,
                        })
                      }
                      className="rounded-2xl border border-white/8 bg-white/[0.035] px-4 py-3 text-left text-sm transition hover:border-red-500/35 hover:bg-red-500/10"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </Panel>
            </div>
          </section>

          <Panel>
            <SectionTitle title="System status" />
            <div className="grid gap-4 md:grid-cols-3">
              {systemStatus.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/6 bg-black/20 p-4">
                  <p className="text-sm text-zinc-400">{item.label}</p>
                  <p className="mt-2 text-lg font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
        )}
      </div>
    </main>
  );
}
