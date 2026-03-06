"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { Package } from "@/lib/types";

interface PackageCardProps {
  pkg: Package;
}

export default function PackageCard({ pkg }: PackageCardProps) {
  const t = useTranslations("catalog");
  const locale = useLocale();

  return (
    <Link href={`/${locale}/package/${pkg.slug}`} className="group block">
      <div className="bg-sand rounded-[1.2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1.5">
        {/* Image area */}
        <div className="relative h-52 bg-gradient-to-br from-forest via-deep to-ember/60 overflow-hidden">
          {pkg.cover_url && (
            <Image
              src={pkg.cover_url}
              alt={pkg.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}

          {/* Badge */}
          {pkg.badge && (
            <span className="absolute top-4 left-4 z-10 bg-ember text-white text-xs font-medium px-3 py-1 rounded-full">
              {pkg.badge}
            </span>
          )}

          {/* Overlay title */}
          <div className="absolute inset-0 bg-gradient-to-t from-deep/70 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="font-heading text-xl font-bold text-sand">
              {pkg.title}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Meta row */}
          <div className="flex items-center gap-4 text-sm text-mist mb-3">
            <span>{pkg.duration_days} {t("days")}</span>
            <span>{pkg.max_persons} {t("persons")}</span>
            <span>{pkg.area}</span>
          </div>

          {/* Perex */}
          <p className="text-deep/70 text-sm leading-relaxed mb-4 line-clamp-2">
            {pkg.perex}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {pkg.highlights.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-cream text-mist text-xs px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Price row */}
          <div className="flex items-center justify-between pt-3 border-t border-cream">
            <div>
              <span className="text-ember font-bold text-lg">
                €{pkg.price_from}
              </span>
              <span className="text-mist text-sm ml-1">{t("perPerson")}</span>
            </div>
            <span className="text-deep font-medium text-sm group-hover:text-ember transition-colors">
              {t("moreInfo")} &rarr;
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
