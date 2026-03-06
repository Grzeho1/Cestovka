"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function CTABanner() {
  const t = useTranslations("ctaBanner");
  const locale = useLocale();

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-ember to-ember/85 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-white/5" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="animate-fade-in-up font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
          {t("title")}
        </h2>
        <p className="animate-fade-in-up animation-delay-100 text-white/80 text-lg max-w-2xl mx-auto mb-8">
          {t("subtitle")}
        </p>
        <Link
          href={`/${locale}/contact`}
          className="animate-fade-in-up animation-delay-200 inline-flex items-center px-8 py-4 bg-white text-ember font-bold rounded-[0.4rem] hover:bg-sand transition-colors text-lg"
        >
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}
