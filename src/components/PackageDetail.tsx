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

  const hasGallery = pkg.gallery_urls && pkg.gallery_urls.length > 0;
  const hasRoute = pkg.route_points && pkg.route_points.length > 0;
  const hasItinerary = pkg.itinerary.length > 0;

  return (
    <div className="pt-14 bg-white">
      {/* ══════════════════ HERO ══════════════════ */}
      <div className="relative h-[55vh] min-h-[400px] max-h-[600px]">
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
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/40 to-transparent" />

        {/* Hero content */}
        <div className="absolute inset-x-0 bottom-0 pb-10 sm:pb-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {pkg.badge && (
              <span className="inline-block bg-ember text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-4">
                {pkg.badge}
              </span>
            )}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {pkg.title}
            </h1>

            {/* Meta pills */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {pkg.area}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {pkg.duration_days} {t("daysUnit")}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                max. {pkg.max_persons} {t("personsShort")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════ MAIN CONTENT ══════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-12">

          {/* ──── LEFT COLUMN ──── */}
          <div className="min-w-0">

            {/* Perex */}
            {pkg.perex && (
              <p className="text-deep/60 text-lg sm:text-xl leading-relaxed mb-8 font-medium">
                {pkg.perex}
              </p>
            )}

            {/* Description */}
            <div className="prose prose-lg max-w-none text-deep/80 leading-relaxed mb-14">
              {pkg.description.split("\n").map((paragraph, i) => (
                paragraph.trim() ? <p key={i}>{paragraph}</p> : null
              ))}
            </div>

            {/* Highlights */}
            {pkg.highlights.length > 0 && (
              <div className="mb-14">
                <h2 className="font-heading text-2xl font-bold text-deep mb-5">
                  {t("highlights")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pkg.highlights.map((h) => (
                    <div
                      key={h}
                      className="flex items-center gap-3 bg-forest/5 border border-forest/10 rounded-xl px-4 py-3"
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-forest/15 text-forest flex items-center justify-center text-xs">
                        &#10003;
                      </span>
                      <span className="text-deep text-sm font-medium">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {hasGallery && (
              <div className="mb-14">
                <h2 className="font-heading text-2xl font-bold text-deep mb-5">
                  {t("gallery")}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {pkg.gallery_urls.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setLightboxIndex(i)}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer"
                    >
                      <Image
                        src={url}
                        alt={`${pkg.title} ${i + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-deep/0 group-hover:bg-deep/20 transition-colors duration-300" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Route Map */}
            {hasRoute && (
              <div className="mb-14">
                <h2 className="font-heading text-2xl font-bold text-deep mb-5">
                  {t("route")}
                </h2>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <IndonesiaMapLazy
                    className="h-[350px] sm:h-[450px]"
                    selectedPackage={pkg}
                    mode="detail"
                  />
                </div>
              </div>
            )}

            {/* ══════ ITINERARY TIMELINE ══════ */}
            {hasItinerary && (
              <div className="mb-14">
                <h2 className="font-heading text-2xl font-bold text-deep mb-8">
                  {t("itinerary")}
                </h2>
                <div className="relative">
                  {/* Vertical timeline line */}
                  <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-ember via-ember/40 to-transparent hidden sm:block" />

                  <div className="space-y-6">
                    {pkg.itinerary.map((item, index) => (
                      <div
                        key={item.day}
                        className="relative sm:pl-14"
                      >
                        {/* Timeline dot */}
                        <div className="hidden sm:flex absolute left-0 top-0 w-10 h-10 bg-ember text-white rounded-full items-center justify-center font-bold text-sm shadow-md z-10">
                          {item.day}
                        </div>

                        {/* Card */}
                        <div className="bg-sand/60 rounded-2xl overflow-hidden border border-sand hover:shadow-md transition-shadow duration-300">
                          {item.image_url ? (
                            <div className="sm:flex">
                              {/* Day image */}
                              <div className="relative w-full sm:w-56 h-44 sm:h-auto flex-shrink-0">
                                <Image
                                  src={item.image_url}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 640px) 100vw, 224px"
                                />
                              </div>
                              {/* Text content */}
                              <div className="p-5 sm:p-6 flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="sm:hidden inline-flex items-center justify-center w-7 h-7 bg-ember text-white rounded-full text-xs font-bold">
                                    {item.day}
                                  </span>
                                  <span className="text-xs font-bold uppercase tracking-wider text-ember">
                                    {t("day")} {item.day}
                                  </span>
                                </div>
                                <h3 className="font-heading text-lg font-bold text-deep mb-2">
                                  {item.title}
                                </h3>
                                <p className="text-deep/65 text-sm leading-relaxed">
                                  {item.text}
                                </p>
                                {item.location?.name && (
                                  <div className="flex items-center gap-1.5 mt-3 text-xs font-medium text-forest">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {item.location.name}
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="p-5 sm:p-6">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="sm:hidden inline-flex items-center justify-center w-7 h-7 bg-ember text-white rounded-full text-xs font-bold">
                                  {item.day}
                                </span>
                                <span className="text-xs font-bold uppercase tracking-wider text-ember">
                                  {t("day")} {item.day}
                                </span>
                              </div>
                              <h3 className="font-heading text-lg font-bold text-deep mb-2">
                                {item.title}
                              </h3>
                              <p className="text-deep/65 text-sm leading-relaxed">
                                {item.text}
                              </p>
                              {item.location?.name && (
                                <div className="flex items-center gap-1.5 mt-3 text-xs font-medium text-forest">
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  {item.location.name}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Included / Excluded */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
              {pkg.included.length > 0 && (
                <div className="bg-forest/5 border border-forest/10 rounded-2xl p-6">
                  <h2 className="font-heading text-lg font-bold text-deep mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 bg-forest text-white rounded-full flex items-center justify-center text-xs">&#10003;</span>
                    {t("included")}
                  </h2>
                  <ul className="space-y-2.5">
                    {pkg.included.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-deep/75 text-sm"
                      >
                        <span className="text-forest mt-0.5 flex-shrink-0">&#10003;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {pkg.excluded.length > 0 && (
                <div className="bg-ember/5 border border-ember/10 rounded-2xl p-6">
                  <h2 className="font-heading text-lg font-bold text-deep mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 bg-ember text-white rounded-full flex items-center justify-center text-xs">&#10007;</span>
                    {t("excluded")}
                  </h2>
                  <ul className="space-y-2.5">
                    {pkg.excluded.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-deep/75 text-sm"
                      >
                        <span className="text-ember mt-0.5 flex-shrink-0">&#10007;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* ──── RIGHT COLUMN: Sticky sidebar ──── */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              {/* Price card */}
              <div className="bg-white border border-sand rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-br from-ember to-ember/85 p-6 text-center">
                  <p className="text-white/70 text-sm mb-1">{t("from")}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-white font-bold text-4xl">€{pkg.price_from}</span>
                    <span className="text-white/70 text-sm">/ {t("personsShort")}</span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Quick info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-mist">{t("duration")}</span>
                      <span className="font-medium text-deep">{pkg.duration_days} {t("daysUnit")}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-mist">{t("maxPersons")}</span>
                      <span className="font-medium text-deep">{pkg.max_persons}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-mist">{t("area")}</span>
                      <span className="font-medium text-deep">{pkg.area}</span>
                    </div>
                  </div>

                  <Link
                    href={`/${locale}/reservation/${pkg.slug}`}
                    className="flex items-center justify-center w-full px-6 py-3.5 bg-ember text-white font-bold rounded-xl hover:bg-ember/90 transition-colors text-base"
                  >
                    {t("bookNow")}
                  </Link>

                  <p className="text-center text-xs text-mist mt-3">{t("noCommitment")}</p>
                </div>
              </div>

              {/* Highlights quick list */}
              {pkg.highlights.length > 0 && (
                <div className="mt-6 bg-sand/50 rounded-2xl p-5">
                  <h3 className="font-heading text-sm font-bold text-deep mb-3 uppercase tracking-wider">
                    {t("highlights")}
                  </h3>
                  <ul className="space-y-2">
                    {pkg.highlights.slice(0, 5).map((h) => (
                      <li key={h} className="flex items-center gap-2 text-sm text-deep/75">
                        <span className="text-ember text-xs">&#9679;</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ══════ MOBILE STICKY BOTTOM BAR ══════ */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-sand px-4 py-3 safe-area-bottom">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div>
              <span className="text-mist text-xs">{t("from")}</span>
              <span className="text-ember font-bold text-2xl ml-1">€{pkg.price_from}</span>
              <span className="text-mist text-xs ml-0.5">/ {t("personsShort")}</span>
            </div>
            <Link
              href={`/${locale}/reservation/${pkg.slug}`}
              className="inline-flex items-center px-6 py-2.5 bg-ember text-white font-bold rounded-xl hover:bg-ember/90 transition-colors text-sm"
            >
              {t("bookNow")}
            </Link>
          </div>
        </div>

        {/* Spacer for mobile bottom bar */}
        <div className="h-20 lg:hidden" />
      </div>

      {/* ══════ LIGHTBOX ══════ */}
      {lightboxIndex !== null && pkg.gallery_urls && (
        <div
          className="fixed inset-0 z-50 bg-deep/95 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center text-xl hover:bg-white/20 transition-colors"
          >
            &#10005;
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 text-white/60 text-sm font-medium">
            {lightboxIndex + 1} / {pkg.gallery_urls.length}
          </div>

          {lightboxIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(lightboxIndex - 1);
              }}
              className="absolute left-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center text-2xl hover:bg-white/20 transition-colors"
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
              className="absolute right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center text-2xl hover:bg-white/20 transition-colors"
            >
              &#8250;
            </button>
          )}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full h-full"
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
    </div>
  );
}
