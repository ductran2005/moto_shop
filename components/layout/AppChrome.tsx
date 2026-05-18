"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";

interface AppChromeUser {
  email: string | null;
  fullName: string | null;
}

export function AppChrome({
  children,
  user,
}: {
  children: ReactNode;
  user: AppChromeUser | null;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar user={user} />}
      {children}
    </>
  );
}
