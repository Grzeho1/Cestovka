import { useTranslations } from "next-intl";

export default function Testimonials() {
  const t = useTranslations("testimonials");

  const items = [
    { key: "0", rating: 5 },
    { key: "1", rating: 5 },
    { key: "2", rating: 5 },
  ] as const;

  return (
    <section className="py-16 sm:py-24 bg-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-sand mb-3">
            {t("title")}
          </h2>
          <p className="text-mist text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[1.8rem]">
          {items.map(({ key, rating }) => (
            <div
              key={key}
              className="bg-deep/50 border border-sand/10 rounded-[1.2rem] p-6 flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: rating }).map((_, i) => (
                  <span key={i} className="text-gold text-lg">★</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-sand/80 leading-relaxed flex-1 mb-6">
                &ldquo;{t(`items.${key}.text`)}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center flex-shrink-0">
                  <span className="text-sand text-sm font-medium">{t(`items.${key}.initials`)}</span>
                </div>
                <div>
                  <div className="text-sand font-medium text-sm">{t(`items.${key}.name`)}</div>
                  <div className="text-mist text-xs">
                    {t(`items.${key}.location`)} &middot; {t(`items.${key}.trip`)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
