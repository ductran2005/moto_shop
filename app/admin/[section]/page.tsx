import { notFound } from "next/navigation";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { adminSections, type AdminSectionKey } from "@/lib/admin-navigation";

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;

  if (!(adminSections as readonly string[]).includes(section)) {
    notFound();
  }

  return <AdminDashboard section={section as AdminSectionKey} />;
}
