// Centrální seznam oblastí – přidej novou oblast sem a automaticky se objeví v admin formulářích a filtrech
export const AREAS = [
  "Bali",
  "East Java",
  "West Java",
  "Flores",
  "Komodo",
  "Lombok",
  "Gili Islands",
  "Nusa Penida",
  "Raja Ampat",
  "Sulawesi",
  "Sumatra",
  "Borneo",
  "Papua",
] as const;

export type Area = (typeof AREAS)[number];
