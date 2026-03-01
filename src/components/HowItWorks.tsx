"use client";

import { useTranslations } from "next-intl";

const steps = [
  { key: "step1" as const, number: "01" },
  { key: "step2" as const, number: "02" },
  { key: "step3" as const, number: "03" },
];

export default function HowItWorks() {
  const t = useTranslations("howItWorks");

  return (
    <section className="py-16 sm:py-24 bg-sand/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-deep mb-3">
            {t("title")}
          </h2>
          <p className="text-mist text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-12 left-[16.6%] right-[16.6%] h-px bg-ember/20" />

          {steps.map(({ key, number }, i) => (
            <div
              key={key}
              className="animate-fade-in-up relative text-center"
              style={{ animationDelay: `${0.1 + i * 0.15}s` }}
            >
              {/* Number circle */}
              <div className="relative z-10 w-24 h-24 mx-auto mb-6 rounded-full bg-cream border-2 border-ember/20 flex items-center justify-center">
                <span className="font-heading text-3xl font-bold text-ember">
                  {number}
                </span>
              </div>

              <h3 className="font-heading text-xl font-bold text-deep mb-3">
                {t(`${key}Title`)}
              </h3>
              <p className="text-mist text-sm leading-relaxed max-w-xs mx-auto">
                {t(`${key}Desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
