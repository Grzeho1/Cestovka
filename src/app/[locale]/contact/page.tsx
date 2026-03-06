"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("contact");
  const tFooter = useTranslations("footer");
  const locale = useLocale();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Send email via Resend/SendGrid
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    setIsLoading(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-14 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-sand rounded-[1.2rem] p-8">
            <div className="w-16 h-16 bg-forest rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl">&#10003;</span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-deep mb-4">
              {t("success")}
            </h1>
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-deep mb-3">
            {t("title")}
          </h1>
          <p className="text-mist text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-deep mb-2">
                    {t("name")} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep mb-2">
                    {t("email")} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-deep mb-2">
                  {t("phone")}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-deep mb-2">
                  {t("message")} *
                </label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t("messagePlaceholder")}
                  className="w-full px-4 py-3 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-3 bg-ember text-white font-medium rounded-[0.4rem] hover:bg-ember/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? t("sending") : t("submit")}
              </button>
            </form>
          </div>

          {/* Contact info */}
          <div>
            <h2 className="font-heading text-xl font-bold text-deep mb-6">
              {t("infoTitle")}
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-deep mb-1">
                  {t("emailLabel")}
                </div>
                <div className="text-mist text-sm">{tFooter("email")}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-deep mb-1">
                  {t("addressLabel")}
                </div>
                <div className="text-mist text-sm">{tFooter("address")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
