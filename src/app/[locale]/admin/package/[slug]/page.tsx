"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { getPackageBySlug, updatePackage, uploadImage } from "@/lib/packages";
import { AREAS } from "@/lib/areas";
import type { Package, ItineraryDay, RoutePoint } from "@/lib/types";
import Link from "next/link";

const LocationPicker = dynamic(
  () => import("@/components/map/LocationPicker"),
  { ssr: false }
);

export default function EditPackagePage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const locale = useLocale();
  const t = useTranslations("admin");
  const router = useRouter();

  const { slug } = React.use(params) || { slug: "" };

  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
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

  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [dayImageFiles, setDayImageFiles] = useState<Record<number, File>>({});

  useEffect(() => {
    getPackageBySlug(slug).then((data) => {
      if (!data) {
        setLoading(false);
        return;
      }
      setPkg(data);
      setFormData({
        title: data.title,
        slug: data.slug,
        area: data.area,
        duration_days: data.duration_days.toString(),
        max_persons: data.max_persons.toString(),
        price_from: data.price_from.toString(),
        currency: data.currency,
        perex: data.perex || "",
        description: data.description,
        included: data.included.join("\n"),
        excluded: data.excluded.join("\n"),
        highlights: data.highlights.join(", "),
        badge: data.badge || "",
        active: data.active,
        featured: data.featured || false,
      });
      setItinerary(data.itinerary);
      setCoverPreview(data.cover_url || "");
      setLoading(false);
    });
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkg) return;
    setSaving(true);

    let coverUrl = pkg.cover_url;

    // Upload cover if changed
    if (coverFile) {
      const path = `covers/${formData.slug}-${Date.now()}.${coverFile.name.split(".").pop()}`;
      const url = await uploadImage(coverFile, path);
      if (url) coverUrl = url;
    }

    // Upload gallery images
    const newGalleryUrls = [...(pkg.gallery_urls || [])];
    for (const file of galleryFiles) {
      const path = `gallery/${formData.slug}-${Date.now()}-${file.name}`;
      const url = await uploadImage(file, path);
      if (url) newGalleryUrls.push(url);
    }

    // Upload day images
    const updatedItinerary = [...itinerary];
    for (const [indexStr, file] of Object.entries(dayImageFiles)) {
      const idx = parseInt(indexStr);
      const path = `itinerary/${formData.slug}-day${idx + 1}-${Date.now()}.${file.name.split(".").pop()}`;
      const url = await uploadImage(file, path);
      if (url && updatedItinerary[idx]) {
        updatedItinerary[idx] = { ...updatedItinerary[idx], image_url: url };
      }
    }

    const updated = await updatePackage(pkg.id, {
      title: formData.title,
      slug: formData.slug,
      area: formData.area,
      duration_days: parseInt(formData.duration_days),
      max_persons: parseInt(formData.max_persons),
      price_from: parseFloat(formData.price_from),
      currency: formData.currency,
      perex: formData.perex,
      description: formData.description,
      itinerary: updatedItinerary,
      included: formData.included.split("\n").filter(Boolean),
      excluded: formData.excluded.split("\n").filter(Boolean),
      highlights: formData.highlights
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      badge: formData.badge || undefined,
      cover_url: coverUrl,
      gallery_urls: newGalleryUrls,
      active: formData.active,
      featured: formData.featured,
      route_points: updatedItinerary
        .filter((d) => d.location)
        .map((d) => d.location!),
    });

    setSaving(false);

    if (updated) {
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

  const updateItineraryDay = (index: number, field: string, value: string) => {
    setItinerary((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
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

  if (loading) {
    return (
      <div className="pt-14">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center text-mist">
          Loading...
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="pt-14">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center text-mist">
          Package not found.
        </div>
      </div>
    );
  }

  return (
    <div className="pt-14 bg-sand/30 min-h-screen">
      {/* Sticky top bar */}
      <div className="sticky top-14 z-30 bg-white border-b border-sand shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href={`/${locale}/admin`} className="text-mist hover:text-deep transition-colors whitespace-nowrap">
              ← {t("back")}
            </Link>
            <span className="text-sand">|</span>
            <span className="font-heading font-bold text-deep truncate">{pkg.title}</span>
          </div>
          <div className="flex items-center gap-5">
            {/* Active toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input type="checkbox" name="active" form="edit-form" checked={formData.active} onChange={handleChange} className="sr-only" />
                <div className={`w-9 h-5 rounded-full transition-colors ${formData.active ? "bg-forest" : "bg-sand border border-mist/30"}`} />
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${formData.active ? "translate-x-4" : "translate-x-0.5"}`} />
              </div>
              <span className={`text-xs font-semibold uppercase tracking-wide ${formData.active ? "text-forest" : "text-mist"}`}>
                {formData.active ? "Active" : "Inactive"}
              </span>
            </label>
            {/* Featured toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input type="checkbox" name="featured" form="edit-form" checked={formData.featured} onChange={handleChange} className="sr-only" />
                <div className={`w-9 h-5 rounded-full transition-colors ${formData.featured ? "bg-ember" : "bg-sand border border-mist/30"}`} />
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${formData.featured ? "translate-x-4" : "translate-x-0.5"}`} />
              </div>
              <span className={`text-xs font-semibold uppercase tracking-wide ${formData.featured ? "text-ember" : "text-mist"}`}>
                {formData.featured ? "Featured" : "Hidden"}
              </span>
            </label>
            <button
              type="submit"
              form="edit-form"
              disabled={saving}
              className="px-6 py-2 bg-ember text-white font-medium rounded-[0.4rem] hover:bg-ember/90 transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
            >
              {saving ? "Saving…" : t("save")}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form id="edit-form" onSubmit={handleSubmit} className="space-y-6">

          {/* 1. Basic info */}
          <div className="bg-white rounded-[1.2rem] shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-sand bg-sand/20">
              <span className="w-7 h-7 rounded-full bg-ember text-white text-xs font-bold flex items-center justify-center">1</span>
              <h2 className="font-heading text-lg font-bold text-deep">{t("sectionBasic")}</h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-mist uppercase tracking-wide mb-1">{t("fieldTitle")}</label>
                  <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-2.5 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-mist uppercase tracking-wide mb-1">{t("fieldSlug")}</label>
                  <input type="text" name="slug" required value={formData.slug} onChange={handleChange} className="w-full px-4 py-2.5 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent text-sm font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-mist uppercase tracking-wide mb-1">{t("fieldArea")}</label>
                  <select name="area" required value={formData.area} onChange={handleChange} className="w-full px-4 py-2.5 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent bg-white text-sm">
                    <option value="">– select area –</option>
                    {AREAS.map((a) => (<option key={a} value={a}>{a}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-mist uppercase tracking-wide mb-1">{t("fieldBadge")}</label>
                  <input type="text" name="badge" value={formData.badge} onChange={handleChange} placeholder={t("fieldBadgePlaceholder")} className="w-full px-4 py-2.5 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-mist uppercase tracking-wide mb-1">{t("fieldDays")}</label>
                  <input type="number" name="duration_days" required min="1" value={formData.duration_days} onChange={handleChange} className="w-full px-4 py-2.5 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-mist uppercase tracking-wide mb-1">{t("fieldMaxPersons")}</label>
                  <input type="number" name="max_persons" required min="1" value={formData.max_persons} onChange={handleChange} className="w-full px-4 py-2.5 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-mist uppercase tracking-wide mb-1">{t("fieldPrice")}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mist text-sm">€</span>
                    <input type="number" name="price_from" required min="0" step="0.01" value={formData.price_from} onChange={handleChange} className="w-full pl-8 pr-4 py-2.5 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-mist uppercase tracking-wide mb-1">Currency</label>
                  <select name="currency" value={formData.currency} onChange={handleChange} className="w-full px-4 py-2.5 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent bg-white text-sm">
                    <option value="EUR">EUR</option>
                    <option value="CZK">CZK</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-mist uppercase tracking-wide mb-1">{t("fieldPerex")}</label>
                <textarea name="perex" rows={2} value={formData.perex} onChange={handleChange} className="w-full px-4 py-2.5 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent text-sm resize-none" />
              </div>

            </div>
          </div>

          {/* 2. Photos */}
          <div className="bg-white rounded-[1.2rem] shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-sand bg-sand/20">
              <span className="w-7 h-7 rounded-full bg-ember text-white text-xs font-bold flex items-center justify-center">2</span>
              <h2 className="font-heading text-lg font-bold text-deep">Photos</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-mist uppercase tracking-wide mb-2">Cover photo</label>
                {coverPreview && (
                  <img src={coverPreview} alt="Cover preview" className="w-full h-40 object-cover rounded-[0.4rem] mb-3" />
                )}
                <input type="file" accept="image/*" onChange={handleCoverChange} className="block w-full text-sm text-mist file:mr-4 file:py-2 file:px-4 file:rounded-[0.4rem] file:border-0 file:text-sm file:font-medium file:bg-ember file:text-white hover:file:bg-ember/90" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-mist uppercase tracking-wide mb-2">Gallery</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {pkg.gallery_urls?.map((url, i) => (
                    <img key={i} src={url} alt={`Gallery ${i}`} className="w-20 h-20 object-cover rounded-[0.4rem]" />
                  ))}
                  {galleryFiles.map((file, i) => (
                    <div key={`new-${i}`} className="w-20 h-20 bg-sand rounded-[0.4rem] flex items-center justify-center text-xs text-mist text-center p-1">
                      {file.name.slice(0, 12)}
                    </div>
                  ))}
                </div>
                <input type="file" accept="image/*" multiple onChange={handleGalleryChange} className="block w-full text-sm text-mist file:mr-4 file:py-2 file:px-4 file:rounded-[0.4rem] file:border-0 file:text-sm file:font-medium file:bg-forest file:text-white hover:file:bg-forest/90" />
              </div>
            </div>
          </div>

          {/* 3. Description & content */}
          <div className="bg-white rounded-[1.2rem] shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-sand bg-sand/20">
              <span className="w-7 h-7 rounded-full bg-ember text-white text-xs font-bold flex items-center justify-center">3</span>
              <h2 className="font-heading text-lg font-bold text-deep">{t("sectionContent")}</h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-mist uppercase tracking-wide mb-1">{t("fieldDescription")}</label>
                <textarea name="description" rows={5} value={formData.description} onChange={handleChange} className="w-full px-4 py-2.5 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent text-sm resize-y" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-mist uppercase tracking-wide mb-1">{t("fieldIncluded")}</label>
                  <textarea name="included" rows={5} value={formData.included} onChange={handleChange} className="w-full px-4 py-2.5 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent text-sm resize-y" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-mist uppercase tracking-wide mb-1">{t("fieldExcluded")}</label>
                  <textarea name="excluded" rows={5} value={formData.excluded} onChange={handleChange} className="w-full px-4 py-2.5 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent text-sm resize-y" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-mist uppercase tracking-wide mb-1">{t("fieldHighlights")}</label>
                <input type="text" name="highlights" value={formData.highlights} onChange={handleChange} placeholder={t("fieldHighlightsPlaceholder")} className="w-full px-4 py-2.5 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent text-sm" />
                <p className="text-xs text-mist mt-1">Comma-separated – displayed as tags on the card</p>
              </div>
            </div>
          </div>

          {/* 4. Itinerary */}
          <div className="bg-white rounded-[1.2rem] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-sand bg-sand/20">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-ember text-white text-xs font-bold flex items-center justify-center">4</span>
                <h2 className="font-heading text-lg font-bold text-deep">{t("sectionItinerary")}</h2>
                <span className="text-xs text-mist bg-sand px-2 py-0.5 rounded-full">{itinerary.length} days</span>
              </div>
              <button type="button" onClick={addItineraryDay} className="px-4 py-2 bg-forest text-white text-sm font-medium rounded-[0.4rem] hover:bg-forest/90 transition-colors">
                + {t("itineraryAddDay")}
              </button>
            </div>
            <div className="p-6 space-y-3">
              {itinerary.map((day, index) => (
                <div key={index} className="border border-sand rounded-[0.4rem] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-sand/30">
                    <span className="text-xs font-bold text-ember uppercase tracking-wide">Day {day.day}</span>
                    {itinerary.length > 1 && (
                      <button type="button" onClick={() => removeItineraryDay(index)} className="text-xs text-ember hover:text-ember/70">
                        {t("itineraryRemoveDay")}
                      </button>
                    )}
                  </div>
                  <div className="p-4 space-y-3">
                    <input type="text" placeholder={t("itineraryDayTitlePlaceholder")} value={day.title} onChange={(e) => updateItineraryDay(index, "title", e.target.value)} className="w-full px-3 py-2 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent text-sm font-medium" />
                    <textarea placeholder={t("itineraryDayTextPlaceholder")} rows={2} value={day.text} onChange={(e) => updateItineraryDay(index, "text", e.target.value)} className="w-full px-3 py-2 border border-sand rounded-[0.4rem] focus:ring-2 focus:ring-ember focus:border-transparent text-sm resize-none" />
                    <div>
                      <label className="block text-xs font-medium text-mist mb-1">
                        {t("itineraryLocation")}
                      </label>
                      <LocationPicker
                        value={day.location}
                        onChange={(point) => updateItineraryLocation(index, point)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-mist mb-1">
                        {t("itineraryImage")}
                      </label>
                      {(dayImageFiles[index] || day.image_url) && (
                        <img
                          src={dayImageFiles[index] ? URL.createObjectURL(dayImageFiles[index]) : day.image_url}
                          alt={`Day ${day.day}`}
                          className="w-full max-w-xs h-28 object-cover rounded-[0.4rem] mb-2"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setDayImageFiles((prev) => ({ ...prev, [index]: file }));
                        }}
                        className="block w-full text-xs text-mist file:mr-3 file:py-1.5 file:px-3 file:rounded-[0.4rem] file:border-0 file:text-xs file:font-medium file:bg-forest file:text-white hover:file:bg-forest/90"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom save */}
          <div className="flex justify-end gap-3 pb-4">
            <Link href={`/${locale}/admin`} className="px-6 py-3 bg-white border border-sand text-deep font-medium rounded-[0.4rem] hover:bg-sand/50 transition-colors">
              {t("back")}
            </Link>
            <button type="submit" disabled={saving} className="px-8 py-3 bg-ember text-white font-medium rounded-[0.4rem] hover:bg-ember/90 transition-colors disabled:opacity-50">
              {saving ? "Saving…" : t("save")}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
