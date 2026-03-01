"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const otherLocale = locale === "cs" ? "en" : "cs";

  function switchLocale() {
    const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
    router.push(`/${otherLocale}${pathWithoutLocale}`);
  }

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/baliky`, label: t("packages") },
    { href: `/${locale}/o-nas`, label: t("about") },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-[12px] bg-cream/80 border-b border-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-1">
            <span className="font-heading text-xl font-bold text-deep">
              Nusantara
            </span>
            <span className="font-heading text-xl font-bold text-ember">
              Travel
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-ember"
                    : "text-deep/70 hover:text-deep"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <button
              onClick={switchLocale}
              className="text-xs font-medium text-mist hover:text-deep transition-colors uppercase border border-sand rounded-full px-2.5 py-1"
            >
              {otherLocale}
            </button>

            {/* Admin login */}
            <Link
              href={`/${locale}/admin`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-deep/70 hover:text-deep border border-sand rounded-[0.4rem] transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {t("login")}
            </Link>

            {/* CTA */}
            <Link
              href={`/${locale}/kontakt`}
              className="hidden sm:inline-flex items-center px-4 py-1.5 bg-ember text-white text-sm font-medium rounded-[0.4rem] hover:bg-ember/90 transition-colors"
            >
              {t("cta")}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1.5 text-deep"
              aria-label={t("menu")}
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-cream/95 backdrop-blur-[12px] border-t border-sand">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block text-sm font-medium py-2 ${
                  pathname === link.href
                    ? "text-ember"
                    : "text-deep/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`/${locale}/admin`}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-1.5 text-sm font-medium text-deep/70 py-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {t("login")}
            </Link>
            <Link
              href={`/${locale}/kontakt`}
              onClick={() => setMobileOpen(false)}
              className="block text-center px-4 py-2.5 bg-ember text-white text-sm font-medium rounded-[0.4rem]"
            >
              {t("cta")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
