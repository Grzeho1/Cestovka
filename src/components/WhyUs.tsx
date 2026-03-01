"use client";

import { useTranslations } from "next-intl";

const features = [
  { key: "localKnowledge" as const, icon: "\u{1F5FA}\uFE0F" },
  { key: "smallGroups" as const, icon: "\u{1F465}" },
  { key: "authentic" as const, icon: "\u{1F33F}" },
  { key: "czech" as const, icon: "\u{1F1E8}\u{1F1FF}" },
];

export default function WhyUs() {
  const t = useTranslations("whyUs");

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-deep mb-3">
            {t("title")}
          </h2>
          <p className="text-mist text-lg max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ key, icon }, i) => (
            <div
              key={key}
              className="animate-fade-in-up bg-white border border-sand rounded-[1rem] p-6 text-center hover:shadow-md transition-shadow"
              style={{ animationDelay: `${0.1 + i * 0.1}s` }}
            >
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="font-heading text-lg font-bold text-deep mb-2">
                {t(key)}
              </h3>
              <p className="text-mist text-sm leading-relaxed">
                {t(`${key}Desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
