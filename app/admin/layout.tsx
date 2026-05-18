import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getProfileRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const role = await getProfileRole(supabase, user);

  if (role !== "admin") {
    redirect("/");
  }

  return children;
}
