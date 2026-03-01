"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  return (
    <footer className="bg-deep text-sand/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-1 mb-4">
              <span className="font-heading text-2xl font-bold text-sand">
                Nusantara
              </span>
              <span className="font-heading text-2xl font-bold text-ember">
                Travel
              </span>
            </div>
            <p className="text-sand/60 text-sm leading-relaxed">
              {t("description")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading text-lg font-bold text-sand mb-4">
              {t("links")}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}`}
                  className="text-sm text-sand/60 hover:text-ember transition-colors"
                >
                  {tNav("home")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/baliky`}
                  className="text-sm text-sand/60 hover:text-ember transition-colors"
                >
                  {tNav("packages")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-bold text-sand mb-4">
              {t("contact")}
            </h4>
            <ul className="space-y-2 text-sm text-sand/60">
              <li>{t("email")}</li>
              <li>{t("address")}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sand/10 mt-12 pt-8 text-center text-sm text-sand/40">
          &copy; {new Date().getFullYear()} Nusantara Travel. {t("rights")}
        </div>
      </div>
    </footer>
  );
}
