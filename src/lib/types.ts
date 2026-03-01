export interface ItineraryDay {
  day: number;
  title: string;
  text: string;
}

export interface Package {
  id: string;
  slug: string;
  title: string;
  area: string;
  duration_days: number;
  max_persons: number;
  price_from: number;
  currency: string;
  perex: string;
  description: string;
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  highlights: string[];
  badge?: string;
  cover_url: string;
  gallery_urls: string[];
  active: boolean;
}
