"use client";

import { useTranslations } from "next-intl";

interface FilterBarProps {
  areas: string[];
  activeArea: string | null;
  onFilter: (area: string | null) => void;
}

export default function FilterBar({ areas, activeArea, onFilter }: FilterBarProps) {
  const t = useTranslations("catalog");

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        onClick={() => onFilter(null)}
        className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
          activeArea === null
            ? "bg-deep text-sand"
            : "bg-sand text-deep hover:bg-deep/10"
        }`}
      >
        {t("filterAll")}
      </button>
      {areas.map((area) => (
        <button
          key={area}
          onClick={() => onFilter(area)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
            activeArea === area
              ? "bg-deep text-sand"
              : "bg-sand text-deep hover:bg-deep/10"
          }`}
        >
          {area}
        </button>
      ))}
    </div>
  );
}
