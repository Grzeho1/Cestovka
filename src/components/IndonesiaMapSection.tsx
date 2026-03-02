"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { getActivePackages } from "@/lib/packages";
import IndonesiaMapLazy from "./map/IndonesiaMapLazy";
import type { Package } from "@/lib/types";

export default function IndonesiaMapSection() {
  const t = useTranslations("map");
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    getActivePackages().then(setPackages);
  }, []);

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
        />
      </div>
    </section>
  );
}
