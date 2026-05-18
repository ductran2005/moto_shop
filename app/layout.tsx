import type { Metadata } from "next";
import { AppChrome } from "@/components/layout/AppChrome";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpeedZone | Xe máy, dầu nhớt, phụ tùng chính hãng",
  description:
    "SpeedZone cung cấp xe máy, dầu nhớt, phụ tùng và phụ kiện chính hãng cho mọi cung đường.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from("profiles").select("full_name").eq("id", user.id).single()
    : { data: null };

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
      <body>
        <AppChrome
          user={
            user
              ? {
                  email: user.email ?? null,
                  fullName: profile?.full_name ?? null,
                }
              : null
          }
        >
          {children}
        </AppChrome>
      </body>
    </html>
  );
}
