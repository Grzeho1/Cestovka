"use client";

import React, { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getPackageBySlug } from "@/lib/packages";
import type { Package } from "@/lib/types";
import Link from "next/link";

export default function ReservationPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    persons: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);

  const t = useTranslations("reservation");
  const locale = useLocale();

  const { slug } = React.use(params) || { slug: "" };

  useEffect(() => {
    getPackageBySlug(slug).then((data) => {
      setPkg(data);
      setLoading(false);
    });
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Send reservation via email API (Resend/SendGrid)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitted(true);
    setIsLoading(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-14 flex items-center justify-center">
        <div className="text-mist">Loading...</div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen pt-14 flex items-center justify-center">
        <div className="text-mist">Package not found.</div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-14 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-sand rounded-[1.2rem] p-8">
            <div className="w-16 h-16 bg-forest rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl">&#10003;</span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-deep mb-4">
              {t("success")}
            </h1>
            <p className="text-mist mb-6">{t("subtitle")}</p>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center px-6 py-3 bg-ember text-white font-medium rounded-[0.4rem] hover:bg-ember/90 transition-colors"
            >
              {t("back")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-14">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-deep mb-3">
            {t("title")}
          </h1>
          <p className="text-mist text-lg">{t("subtitle")}</p>
        </div>

        {/* Package Info */}
        <div className="bg-sand rounded-[1.2rem] p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl font-bold text-deep mb-1">
                {pkg.title}
              </h2>
              <p className="text-mist text-sm">
                {pkg.duration_days} {t("days")}, {pkg.area}
              </p>
            </div>
            <div className="text-right">
              <span className="text-ember font-bold text-xl">
                &euro;{pkg.price_from}
              </span>
              <span className="text-mist text-sm"> / {t("person")}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-deep mb-2"
              >
                {t("name")} *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent"
                placeholder={t("name")}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-deep mb-2"
              >
                {t("email")} *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent"
                placeholder={t("email")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-deep mb-2"
              >
                {t("phone")}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent"
                placeholder={t("phone")}
              />
            </div>

            <div>
              <label
                htmlFor="persons"
                className="block text-sm font-medium text-deep mb-2"
              >
                {t("persons")} *
              </label>
              <select
                id="persons"
                name="persons"
                required
                value={formData.persons}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent"
              >
                <option value="">{t("selectPersons")}</option>
                {Array.from(
                  { length: pkg.max_persons },
                  (_, i) => i + 1
                ).map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-deep mb-2"
            >
              {t("date")}
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-deep mb-2"
            >
              {t("message")}
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent"
              placeholder={t("messagePlaceholder")}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-ember text-white font-medium rounded-[0.4rem] hover:bg-ember/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t("sending") : t("submit")}
            </button>
            <Link
              href={`/${locale}/balik/${slug}`}
              className="px-6 py-3 bg-sand text-deep font-medium rounded-[0.4rem] hover:bg-sand/80 transition-colors text-center"
            >
              {t("back")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
