"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="/videos/hero-poster.jpg"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for text readability - darker left, transparent right */}
      <div className="absolute inset-0 bg-gradient-to-r from-deep/80 via-deep/40 to-deep/10" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <span className="animate-fade-in-up inline-block bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              {t("tag")}
            </span>

            <h1 className="animate-fade-in-up animation-delay-100 font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {t("title")}{" "}
              <em className="text-sand not-italic font-heading italic">
                {t("titleHighlight")}
              </em>
            </h1>

            <p className="animate-fade-in-up animation-delay-200 text-white/70 text-lg sm:text-xl leading-relaxed mb-8 max-w-lg">
              {t("subtitle")}
            </p>

            <div className="animate-fade-in-up animation-delay-300 flex flex-col sm:flex-row gap-3 mb-12">
              <Link
                href={`/${locale}/baliky`}
                className="inline-flex items-center justify-center px-8 py-3.5 bg-ember text-white font-medium rounded-[0.4rem] hover:bg-ember/90 transition-colors text-lg"
              >
                {t("cta")}
              </Link>
              <Link
                href={`/${locale}/kontakt`}
                className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-white/30 text-white font-medium rounded-[0.4rem] hover:bg-white/10 transition-colors text-lg"
              >
                {t("ctaSecondary")}
              </Link>
            </div>

            <div className="animate-fade-in-up animation-delay-400 flex items-center gap-8 sm:gap-12">
              <div>
                <div className="text-3xl font-bold text-white font-heading">
                  5+
                </div>
                <div className="text-sm text-white/50">{t("statTrips")}</div>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div>
                <div className="text-3xl font-bold text-white font-heading">
                  17k+
                </div>
                <div className="text-sm text-white/50">{t("statIslands")}</div>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div>
                <div className="text-3xl font-bold text-white font-heading">
                  8
                </div>
                <div className="text-sm text-white/50">{t("statPersons")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade to page background */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cream to-transparent" />
    </section>
  );
}
