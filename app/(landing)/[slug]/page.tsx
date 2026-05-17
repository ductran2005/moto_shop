import { notFound } from "next/navigation";

interface LandingPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LandingPage({ params }: LandingPageProps) {
  const { slug } = await params;

  if (slug !== "speedzone") {
    notFound();
  }

  return null;
}
