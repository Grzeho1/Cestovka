import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPackageBySlug } from "@/lib/packages";
import PackageDetail from "@/components/PackageDetail";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) return {};
  return {
    title: pkg.title,
    description: pkg.perex,
    openGraph: {
      title: pkg.title,
      description: pkg.perex,
    },
  };
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);

  if (!pkg) {
    notFound();
  }

  return <PackageDetail pkg={pkg} />;
}
