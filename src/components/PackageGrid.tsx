"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { getActivePackages, getAreas } from "@/lib/packages";
import type { Package } from "@/lib/types";
import PackageCard from "./PackageCard";
import FilterBar from "./FilterBar";

interface PackageGridProps {
  limit?: number;
  showFilter?: boolean;
}

export default function PackageGrid({
  limit,
  showFilter = false,
}: PackageGridProps) {
  const t = useTranslations("catalog");
  const [activeArea, setActiveArea] = useState<string | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [pkgs, areaList] = await Promise.all([
        getActivePackages(),
        getAreas(),
      ]);
      setPackages(pkgs);
      setAreas(areaList);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = activeArea
    ? packages.filter((p) => p.area === activeArea)
    : packages;

  const displayed = limit ? filtered.slice(0, limit) : filtered;

  if (loading) {
    return (
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-deep mb-3">
              {t("title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1.8rem]">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-sand rounded-[1.2rem] h-96 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-deep mb-3">
            {t("title")}
          </h2>
          <p className="text-mist text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {showFilter && (
          <div className="animate-fade-in-up animation-delay-100">
            <FilterBar
              areas={areas}
              activeArea={activeArea}
              onFilter={setActiveArea}
            />
          </div>
        )}

        {displayed.length === 0 ? (
          <p className="animate-fade-in-up animation-delay-200 text-center text-mist py-12">
            {t("noResults")}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1.8rem]">
            {displayed.map((pkg, i) => (
              <div
                key={pkg.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${0.15 + i * 0.1}s` }}
              >
                <PackageCard pkg={pkg} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
