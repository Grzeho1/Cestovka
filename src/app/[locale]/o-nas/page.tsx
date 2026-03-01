import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutUs" });
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutUs" });

  const philosophy = [
    { title: t("p1Title"), text: t("p1Text") },
    { title: t("p2Title"), text: t("p2Text") },
    { title: t("p3Title"), text: t("p3Text") },
    { title: t("p4Title"), text: t("p4Text") },
  ];

  const whyIndonesia = [
    { title: t("w1Title"), text: t("w1Text") },
    { title: t("w2Title"), text: t("w2Text") },
    { title: t("w3Title"), text: t("w3Text") },
    { title: t("w4Title"), text: t("w4Text") },
    { title: t("w5Title"), text: t("w5Text") },
    { title: t("w6Title"), text: t("w6Text") },
  ];

  return (
    <div className="pt-14 bg-cream">

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <span className="animate-fade-in-up inline-block text-xs font-medium tracking-widest uppercase text-ember mb-6">
          {t("heroTag")}
        </span>
        <h1 className="animate-fade-in-up animation-delay-100 font-heading text-4xl sm:text-5xl font-bold text-deep leading-tight mb-6">
          {t("heroTitle")}{" "}
          <em className="not-italic text-ember">{t("heroTitleHighlight")}</em>
        </h1>
        <p className="animate-fade-in-up animation-delay-200 text-deep/60 text-lg leading-relaxed max-w-2xl">
          {t("heroSubtitle")}
        </p>
      </section>

      {/* Philosophy */}
      <section className="border-t border-sand">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="text-xs font-medium tracking-widest uppercase text-ember mb-12">
            {t("philosophyTitle")}
          </h2>
          <div className="divide-y divide-sand">
            {philosophy.map((item, i) => (
              <div key={i} className="grid grid-cols-[2rem_1fr_2fr] gap-6 sm:gap-10 py-7 items-start">
                <span className="font-heading text-sm font-bold text-ember/40 pt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-heading text-base font-bold text-deep leading-snug">
                  {item.title}
                </h3>
                <p className="text-deep/60 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Indonesia */}
      <section className="border-t border-sand bg-deep/[0.025]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="text-xs font-medium tracking-widest uppercase text-ember mb-12">
            {t("whyIndonesiaTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 divide-y sm:divide-y-0 divide-sand">
            {whyIndonesia.map((item, i) => (
              <div key={i} className="py-6 sm:py-5 border-b border-sand last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
                <h3 className="font-heading text-sm font-bold text-deep mb-1.5">
                  {item.title}
                </h3>
                <p className="text-deep/55 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-sand">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
          <div>
            <h2 className="font-heading text-2xl font-bold text-deep mb-3">
              {t("ctaTitle")}
            </h2>
            <p className="text-deep/60 text-sm leading-relaxed max-w-md">
              {t("ctaText")}
            </p>
          </div>
          <Link
            href={`/${locale}/kontakt`}
            className="shrink-0 inline-flex items-center px-6 py-3 bg-ember text-white text-sm font-medium rounded-[0.4rem] hover:bg-ember/90 transition-colors"
          >
            {t("ctaBtn")}
          </Link>
        </div>
      </section>

    </div>
  );
}
