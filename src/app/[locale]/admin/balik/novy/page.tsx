"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { createPackage, uploadImage } from "@/lib/packages";
import { AREAS } from "@/lib/areas";
import type { ItineraryDay, RoutePoint } from "@/lib/types";
import Link from "next/link";

const LocationPicker = dynamic(
  () => import("@/components/map/LocationPicker"),
  { ssr: false }
);

export default function NewPackagePage() {
  const locale = useLocale();
  const t = useTranslations("admin");
  const router = useRouter();

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    area: "",
    duration_days: "",
    max_persons: "",
    price_from: "",
    currency: "EUR",
    perex: "",
    description: "",
    included: "",
    excluded: "",
    highlights: "",
    badge: "",
    active: true,
    featured: false,
  });

  const [itinerary, setItinerary] = useState<ItineraryDay[]>([
    { day: 1, title: "", text: "" },
  ]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let coverUrl = "";

    // Upload cover if selected
    if (coverFile) {
      const path = `covers/${formData.slug}-${Date.now()}.${coverFile.name.split(".").pop()}`;
      const url = await uploadImage(coverFile, path);
      if (url) coverUrl = url;
    }

    // Upload gallery images
    const galleryUrls: string[] = [];
    for (const file of galleryFiles) {
      const path = `gallery/${formData.slug}-${Date.now()}-${file.name}`;
      const url = await uploadImage(file, path);
      if (url) galleryUrls.push(url);
    }

    const created = await createPackage({
      slug: formData.slug,
      title: formData.title,
      area: formData.area,
      duration_days: parseInt(formData.duration_days),
      max_persons: parseInt(formData.max_persons),
      price_from: parseFloat(formData.price_from),
      currency: formData.currency,
      perex: formData.perex,
      description: formData.description,
      itinerary,
      included: formData.included.split("\n").filter(Boolean),
      excluded: formData.excluded.split("\n").filter(Boolean),
      highlights: formData.highlights
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      badge: formData.badge || undefined,
      cover_url: coverUrl,
      gallery_urls: galleryUrls,
      active: formData.active,
      featured: formData.featured,
      route_points: itinerary
        .filter((d) => d.location)
        .map((d) => d.location!),
    });

    setSaving(false);

    if (created) {
      router.push(`/${locale}/admin`);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const addItineraryDay = () => {
    setItinerary((prev) => [
      ...prev,
      { day: prev.length + 1, title: "", text: "" },
    ]);
  };

  const updateItineraryDay = (
    index: number,
    field: string,
    value: string
  ) => {
    setItinerary((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const updateItineraryLocation = (index: number, location: RoutePoint) => {
    setItinerary((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, location } : item
      )
    );
  };

  const removeItineraryDay = (index: number) => {
    setItinerary((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, day: i + 1 }))
    );
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setGalleryFiles((prev) => [...prev, ...files]);
  };

  return (
    <div className="pt-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-3xl font-bold text-deep">
            {t("newPackage")}
          </h1>
          <Link
            href={`/${locale}/admin`}
            className="px-6 py-3 bg-sand text-deep font-medium rounded-[0.4rem] hover:bg-sand/80 transition-colors"
          >
            {t("back")}
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white rounded-[1.2rem] p-6 shadow-sm">
            <h2 className="font-heading text-xl font-bold text-deep mb-6">
              {t("sectionBasic")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-deep mb-2">
                  {t("fieldTitle")}
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-deep mb-2">
                  {t("fieldSlug")}
                </label>
                <input
                  type="text"
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-deep mb-2">
                  {t("fieldArea")}
                </label>
                <select
                  name="area"
                  required
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent bg-white"
                >
                  <option value="">– vyber oblast –</option>
                  {AREAS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-deep mb-2">
                  {t("fieldDays")}
                </label>
                <input
                  type="number"
                  name="duration_days"
                  required
                  min="1"
                  value={formData.duration_days}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-deep mb-2">
                  {t("fieldMaxPersons")}
                </label>
                <input
                  type="number"
                  name="max_persons"
                  required
                  min="1"
                  value={formData.max_persons}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-deep mb-2">
                  {t("fieldPrice")}
                </label>
                <input
                  type="number"
                  name="price_from"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price_from}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-deep mb-2">
                {t("fieldPerex")}
              </label>
              <textarea
                name="perex"
                rows={3}
                value={formData.perex}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent"
              />
            </div>

            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="rounded border-sand text-ember focus:ring-ember"
                />
                <span className="ml-2 text-sm text-deep">
                  {t("fieldActive")}
                </span>
              </label>
            </div>

            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="rounded border-sand text-ember focus:ring-ember"
                />
                <span className="ml-2 text-sm text-deep">
                  {t("fieldFeatured")}
                </span>
              </label>
            </div>
          </div>

          {/* Cover & Gallery */}
          <div className="bg-white rounded-[1.2rem] p-6 shadow-sm">
            <h2 className="font-heading text-xl font-bold text-deep mb-6">
              Fotky
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-deep mb-2">
                  Cover fotka
                </label>
                {coverPreview && (
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full max-w-xs h-40 object-cover rounded-[0.4rem] mb-3"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="block w-full text-sm text-mist file:mr-4 file:py-2 file:px-4 file:rounded-[0.4rem] file:border-0 file:text-sm file:font-medium file:bg-ember file:text-white hover:file:bg-ember/90"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-deep mb-2">
                  Galerie
                </label>
                {galleryFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {galleryFiles.map((file, i) => (
                      <div
                        key={i}
                        className="w-24 h-24 bg-sand rounded-[0.4rem] flex items-center justify-center text-xs text-mist"
                      >
                        {file.name.slice(0, 10)}...
                      </div>
                    ))}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryChange}
                  className="block w-full text-sm text-mist file:mr-4 file:py-2 file:px-4 file:rounded-[0.4rem] file:border-0 file:text-sm file:font-medium file:bg-forest file:text-white hover:file:bg-forest/90"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-[1.2rem] p-6 shadow-sm">
            <h2 className="font-heading text-xl font-bold text-deep mb-6">
              {t("sectionContent")}
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-deep mb-2">
                  {t("fieldDescription")}
                </label>
                <textarea
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-deep mb-2">
                    {t("fieldIncluded")}
                  </label>
                  <textarea
                    name="included"
                    rows={4}
                    value={formData.included}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-deep mb-2">
                    {t("fieldExcluded")}
                  </label>
                  <textarea
                    name="excluded"
                    rows={4}
                    value={formData.excluded}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-deep mb-2">
                  {t("fieldHighlights")}
                </label>
                <input
                  type="text"
                  name="highlights"
                  value={formData.highlights}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent"
                  placeholder={t("fieldHighlightsPlaceholder")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-deep mb-2">
                  {t("fieldBadge")}
                </label>
                <input
                  type="text"
                  name="badge"
                  value={formData.badge}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent"
                  placeholder={t("fieldBadgePlaceholder")}
                />
              </div>
            </div>
          </div>

          {/* Itinerary */}
          <div className="bg-white rounded-[1.2rem] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-bold text-deep">
                {t("sectionItinerary")}
              </h2>
              <button
                type="button"
                onClick={addItineraryDay}
                className="px-4 py-2 bg-forest text-white text-sm font-medium rounded-[0.4rem] hover:bg-forest/90 transition-colors"
              >
                {t("itineraryAddDay")}
              </button>
            </div>

            <div className="space-y-4">
              {itinerary.map((day, index) => (
                <div
                  key={index}
                  className="border border-sand rounded-[0.4rem] p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-deep">
                      {t("itineraryDay")} {day.day}
                    </h3>
                    {itinerary.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItineraryDay(index)}
                        className="text-ember hover:text-ember/80 text-sm"
                      >
                        {t("itineraryRemoveDay")}
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder={t("itineraryDayTitlePlaceholder")}
                      value={day.title}
                      onChange={(e) =>
                        updateItineraryDay(index, "title", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent"
                    />
                    <textarea
                      placeholder={t("itineraryDayTextPlaceholder")}
                      rows={3}
                      value={day.text}
                      onChange={(e) =>
                        updateItineraryDay(index, "text", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent"
                    />
                    <div>
                      <label className="block text-xs font-medium text-mist mb-1">
                        {t("itineraryLocation")}
                      </label>
                      <LocationPicker
                        value={day.location}
                        onChange={(point) =>
                          updateItineraryLocation(index, point)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Link
              href={`/${locale}/admin`}
              className="px-6 py-3 bg-sand text-deep font-medium rounded-[0.4rem] hover:bg-sand/80 transition-colors"
            >
              {t("back")}
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-ember text-white font-medium rounded-[0.4rem] hover:bg-ember/90 transition-colors disabled:opacity-50"
            >
              {saving ? "Ukládám..." : t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
