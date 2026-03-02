"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { Package } from "@/lib/types";
import IndonesiaMapLazy from "./map/IndonesiaMapLazy";

interface PackageDetailProps {
  pkg: Package;
}

export default function PackageDetail({ pkg }: PackageDetailProps) {
  const t = useTranslations("detail");
  const locale = useLocale();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div className="pt-14">
      {/* Hero */}
      <div className="relative h-64 sm:h-80 bg-gradient-to-br from-forest via-deep to-ember/60">
        {pkg.cover_url && (
          <Image
            src={pkg.cover_url}
            alt={pkg.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-deep/80 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {pkg.badge && (
              <span className="inline-block bg-ember text-white text-xs font-medium px-3 py-1 rounded-full mb-3">
                {pkg.badge}
              </span>
            )}
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-sand mb-2">
              {pkg.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sand/70 text-sm">
              <span>{t("area")}: {pkg.area}</span>
              <span>{t("duration")}: {pkg.duration_days} {t("daysUnit")}</span>
              <span>{t("maxPersons")}: {pkg.max_persons}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Price + CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-sand rounded-[1.2rem] p-6 mb-12">
          <div>
            <span className="text-mist text-sm">{t("from")}</span>
            <span className="text-ember font-bold text-3xl ml-2">
              €{pkg.price_from}
            </span>
            <span className="text-mist text-sm ml-1">{t("perPerson")}</span>
          </div>
          <Link
            href={`/${locale}/rezervace/${pkg.slug}`}
            className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-ember text-white font-medium rounded-[0.4rem] hover:bg-ember/90 transition-colors"
          >
            {t("bookNow")}
          </Link>
        </div>

        {/* Description */}
        <p className="text-deep/80 text-lg leading-relaxed mb-12">
          {pkg.description}
        </p>

        {/* Gallery */}
        {pkg.gallery_urls && pkg.gallery_urls.length > 0 && (
          <div className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-deep mb-4">
              {t("gallery")}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {pkg.gallery_urls.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className="relative aspect-[4/3] rounded-[0.8rem] overflow-hidden group"
                >
                  <Image
                    src={url}
                    alt={`${pkg.title} ${i + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Lightbox */}
        {lightboxIndex !== null && pkg.gallery_urls && (
          <div
            className="fixed inset-0 z-50 bg-deep/90 flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 text-white text-3xl hover:text-sand transition-colors"
            >
              &#10005;
            </button>
            {lightboxIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(lightboxIndex - 1);
                }}
                className="absolute left-4 text-white text-4xl hover:text-sand transition-colors"
              >
                &#8249;
              </button>
            )}
            {lightboxIndex < pkg.gallery_urls.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(lightboxIndex + 1);
                }}
                className="absolute right-4 text-white text-4xl hover:text-sand transition-colors"
              >
                &#8250;
              </button>
            )}
            <div
              className="relative max-w-4xl max-h-[80vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={pkg.gallery_urls[lightboxIndex]}
                alt={`${pkg.title} ${lightboxIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </div>
        )}

        {/* Highlights */}
        {pkg.highlights.length > 0 && (
          <div className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-deep mb-4">
              {t("highlights")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {pkg.highlights.map((h) => (
                <span
                  key={h}
                  className="bg-forest/10 text-forest text-sm px-4 py-1.5 rounded-full"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Route Map */}
        {pkg.route_points && pkg.route_points.length > 0 && (
          <div className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-deep mb-4">
              {t("route")}
            </h2>
            <IndonesiaMapLazy
              className="h-[300px] sm:h-[400px]"
              selectedPackage={pkg}
              mode="detail"
            />
          </div>
        )}

        {/* Itinerary */}
        {pkg.itinerary.length > 0 && (
          <div className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-deep mb-6">
              {t("itinerary")}
            </h2>
            <div className="space-y-4">
              {pkg.itinerary.map((item) => (
                <div
                  key={item.day}
                  className="bg-sand rounded-[1.2rem] p-5 flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-ember text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {t("day")} {item.day}
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-deep mb-1">
                      {item.title}
                    </h3>
                    <p className="text-deep/70 text-sm leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Included / Excluded */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {pkg.included.length > 0 && (
            <div>
              <h2 className="font-heading text-2xl font-bold text-deep mb-4">
                {t("included")}
              </h2>
              <ul className="space-y-2">
                {pkg.included.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-deep/80 text-sm"
                  >
                    <span className="text-forest mt-0.5">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {pkg.excluded.length > 0 && (
            <div>
              <h2 className="font-heading text-2xl font-bold text-deep mb-4">
                {t("excluded")}
              </h2>
              <ul className="space-y-2">
                {pkg.excluded.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-deep/80 text-sm"
                  >
                    <span className="text-ember mt-0.5">&#10007;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link
            href={`/${locale}/rezervace/${pkg.slug}`}
            className="inline-flex items-center px-8 py-3 bg-ember text-white font-medium rounded-[0.4rem] hover:bg-ember/90 transition-colors text-lg"
          >
            {t("bookNow")}
          </Link>
        </div>
      </div>
    </div>
  );
}
