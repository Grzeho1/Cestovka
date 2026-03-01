"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { getAllPackages, deletePackage } from "@/lib/packages";
import type { Package } from "@/lib/types";

export default function AdminPage() {
  const t = useTranslations("admin");
  const locale = useLocale();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPackages().then((pkgs) => {
      setPackages(pkgs);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (pkg: Package) => {
    if (!confirm(`Opravdu chcete smazat "${pkg.title}"?`)) return;
    const ok = await deletePackage(pkg.id);
    if (ok) {
      setPackages((prev) => prev.filter((p) => p.id !== pkg.id));
    }
  };

  return (
    <div className="pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-3xl font-bold text-deep">
            {t("title")}
          </h1>
          <Link
            href={`/${locale}/admin/balik/novy`}
            className="px-6 py-3 bg-ember text-white font-medium rounded-[0.4rem] hover:bg-ember/90 transition-colors"
          >
            {t("newPackage")}
          </Link>
        </div>

        {/* Packages Table */}
        <div className="bg-white rounded-[1.2rem] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-sand">
            <h2 className="font-heading text-xl font-bold text-deep">
              {t("packages")}
            </h2>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-mist">
              Loading...
            </div>
          ) : packages.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-mist">{t("noPackages")}</p>
              <Link
                href={`/${locale}/admin/balik/novy`}
                className="mt-4 inline-flex items-center px-4 py-2 bg-ember text-white text-sm font-medium rounded-[0.4rem] hover:bg-ember/90 transition-colors"
              >
                {t("createFirst")}
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sand/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-mist uppercase tracking-wider">
                      {t("name")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-mist uppercase tracking-wider">
                      {t("area")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-mist uppercase tracking-wider">
                      {t("days")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-mist uppercase tracking-wider">
                      {t("price")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-mist uppercase tracking-wider">
                      {t("active")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-mist uppercase tracking-wider">
                      {t("actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand">
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-sand/20">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-deep">
                          {pkg.title}
                        </div>
                        {pkg.badge && (
                          <div className="text-xs text-ember">{pkg.badge}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-mist">
                        {pkg.area}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-mist">
                        {pkg.duration_days}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-deep font-medium">
                        &euro;{pkg.price_from}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            pkg.active
                              ? "bg-forest/10 text-forest"
                              : "bg-ember/10 text-ember"
                          }`}
                        >
                          {pkg.active ? t("active") : t("inactive")}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            href={`/${locale}/admin/balik/${pkg.slug}`}
                            className="text-forest hover:text-forest/80"
                          >
                            {t("edit")}
                          </Link>
                          <button
                            onClick={() => handleDelete(pkg)}
                            className="text-ember hover:text-ember/80"
                          >
                            {t("delete")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
