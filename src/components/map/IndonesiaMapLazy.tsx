"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { Package } from "@/lib/types";
import type { Area } from "@/lib/areas";

const IndonesiaMap = dynamic(() => import("./IndonesiaMap"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

function MapSkeleton() {
  const t = useTranslations("map");
  return (
    <div className="w-full h-full flex items-center justify-center bg-sand rounded-[1.2rem] animate-pulse">
      <div className="text-center">
        <div className="w-8 h-8 border-3 border-ember border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-mist text-sm">{t("loading")}</p>
      </div>
    </div>
  );
}

interface IndonesiaMapLazyProps {
  className?: string;
  packages?: Package[];
  selectedPackage?: Package | null;
  onAreaClick?: (area: Area) => void;
  mode?: "overview" | "detail";
}

export default function IndonesiaMapLazy(props: IndonesiaMapLazyProps) {
  return <IndonesiaMap {...props} />;
}
