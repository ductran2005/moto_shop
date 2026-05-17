import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpeedZone | Xe máy, dầu nhớt, phụ tùng chính hãng",
  description:
    "SpeedZone cung cấp xe máy, dầu nhớt, phụ tùng và phụ kiện chính hãng cho mọi cung đường.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
