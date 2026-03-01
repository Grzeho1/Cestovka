import { Metadata } from "next";
import Hero from "@/components/Hero";
import PackageGrid from "@/components/PackageGrid";
import WhyUs from "@/components/WhyUs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isCs = locale === "cs";
  return {
    title: isCs
      ? "Nusantara Travel – Cestovní kancelář zaměřená na Indonésii"
      : "Nusantara Travel – Indonesia Travel Agency",
    description: isCs
      ? "Malé skupiny, autentické zážitky a místní průvodci. Prozkoumejte ostrovy, sopky a džungle Indonésie s česky mluvícím průvodcem."
      : "Small groups, authentic experiences, and local guides. Explore Indonesia's islands, volcanoes and jungles.",
    openGraph: {
      title: isCs
        ? "Nusantara Travel – Cestovní kancelář zaměřená na Indonésii"
        : "Nusantara Travel – Indonesia Travel Agency",
      description: isCs
        ? "Malé skupiny, autentické zážitky a místní průvodci. Prozkoumejte ostrovy, sopky a džungle Indonésie."
        : "Small groups, authentic experiences, and local guides. Explore Indonesia.",
    },
  };
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <PackageGrid limit={3} />
      <WhyUs />
    </>
  );
}
