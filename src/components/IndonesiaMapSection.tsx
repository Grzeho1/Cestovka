"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { getActivePackages } from "@/lib/packages";
import IndonesiaMapLazy from "./map/IndonesiaMapLazy";
import PackageCard from "./PackageCard";
import type { Package } from "@/lib/types";
import type { Area } from "@/lib/areas";

export default function IndonesiaMapSection() {
  const t = useTranslations("map");
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);

  useEffect(() => {
    getActivePackages().then(setPackages);
  }, []);

  const filteredPackages = useMemo(() => {
    if (!selectedArea) return [];
    return packages.filter((p) => p.area === selectedArea);
  }, [packages, selectedArea]);

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-deep mb-3">
            {t("title")}
          </h2>
          <p className="text-mist text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <IndonesiaMapLazy
          className="h-[350px] sm:h-[500px]"
          packages={packages}
          mode="overview"
          onAreaClick={(area) => setSelectedArea(area)}
        />

        {/* Package cards panel for selected area */}
        {selectedArea && (
          <div className="mt-8 animate-fade-in-up">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading text-2xl font-bold text-deep">
                {selectedArea}
                <span className="text-mist font-body text-base font-normal ml-3">
                  {filteredPackages.length} {t("packages")}
                </span>
              </h3>
              <button
                onClick={() => setSelectedArea(null)}
                className="text-mist hover:text-deep text-sm font-medium transition-colors"
              >
                ✕ {t("closeArea")}
              </button>
            </div>

            {filteredPackages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPackages.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-sand rounded-[1.2rem]">
                <p className="text-mist text-lg">{t("noPackagesYet")}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
