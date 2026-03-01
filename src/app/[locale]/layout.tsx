import type { ReactNode } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Playfair_Display, DM_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "../globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isCs = locale === "cs";
  return {
    metadataBase: new URL("https://nusantara-travel.cz"),
    title: {
      default: isCs
        ? "Nusantara Travel – Cestovní kancelář | Indonésie"
        : "Nusantara Travel – Indonesia Travel Agency",
      template: "%s | Nusantara Travel",
    },
    description: isCs
      ? "Malé skupiny, autentické zážitky a místní průvodci. Prozkoumejte ostrovy, sopky a džungle Indonésie s česky mluvícím průvodcem."
      : "Small groups, authentic experiences, and local guides. Explore Indonesia's islands, volcanoes and jungles.",
    openGraph: {
      type: "website",
      locale: isCs ? "cs_CZ" : "en_US",
      siteName: "Nusantara Travel",
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <html lang={locale} className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-body antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
