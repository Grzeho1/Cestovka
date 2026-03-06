import { Metadata } from "next";
import PackageGrid from "@/components/PackageGrid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isCs = locale === "cs";
  return {
    title: isCs
      ? "Cestovní balíky Indonésie"
      : "Indonesia Travel Packages",
    description: isCs
      ? "Vyberte si z pečlivě připravených balíků – Bali, East Java, Lombok a další destinace Indonésie. Malé skupiny, český průvodce."
      : "Choose from our carefully curated Indonesia travel packages – Bali, East Java, Lombok and more. Small groups, local guides.",
  };
}

export default function PackagesPage() {
  return (
    <div className="pt-14">
      <PackageGrid showFilter />
    </div>
  );
}
