export const VIBES = [
  { key: "beach", label: "Beach & sun" },
  { key: "city", label: "City energy" },
  { key: "food", label: "Food" },
  { key: "nightlife", label: "Nightlife" },
  { key: "culture", label: "History & culture" },
  { key: "nature", label: "Nature" },
  { key: "adventure", label: "Adventure" },
] as const;

export type VibeKey = (typeof VIBES)[number]["key"];
export type VibeScores = Record<VibeKey, number>; // 0-5

export type City = {
  slug: string;
  name: string;
  country: string;
  region: "Europe" | "North America" | "Middle East & Asia" | "Other";
  lat: number;
  lon: number;
  /** typical mid-range spend per person per day (EUR): lodging share + food + local transport */
  daily: number;
  /** months (1-12) when the weather and crowds are at their best */
  bestMonths: number[];
  vibes: VibeScores;
};

const v = (
  beach: number,
  city: number,
  food: number,
  nightlife: number,
  culture: number,
  nature: number,
  adventure: number,
): VibeScores => ({ beach, city, food, nightlife, culture, nature, adventure });

const range = (a: number, b: number) =>
  Array.from({ length: b - a + 1 }, (_, i) => a + i);

// A hand-curated starter list. Scores are editorial judgement (0-5), meant to be tuned.
export const CITIES: City[] = [
  // Europe
  { slug: "lisbon", name: "Lisbon", country: "Portugal", region: "Europe", lat: 38.72, lon: -9.14, daily: 120, bestMonths: [4, 5, 6, 9, 10], vibes: v(3, 4, 5, 4, 4, 2, 2) },
  { slug: "porto", name: "Porto", country: "Portugal", region: "Europe", lat: 41.15, lon: -8.61, daily: 105, bestMonths: [5, 6, 9, 10], vibes: v(2, 3, 5, 3, 4, 3, 1) },
  { slug: "barcelona", name: "Barcelona", country: "Spain", region: "Europe", lat: 41.39, lon: 2.17, daily: 140, bestMonths: [5, 6, 9, 10], vibes: v(4, 5, 5, 5, 4, 2, 2) },
  { slug: "madrid", name: "Madrid", country: "Spain", region: "Europe", lat: 40.42, lon: -3.7, daily: 125, bestMonths: [4, 5, 6, 9, 10], vibes: v(0, 5, 5, 5, 4, 1, 1) },
  { slug: "seville", name: "Seville", country: "Spain", region: "Europe", lat: 37.39, lon: -5.98, daily: 105, bestMonths: [3, 4, 5, 10, 11], vibes: v(1, 4, 5, 4, 5, 1, 1) },
  { slug: "mallorca", name: "Mallorca", country: "Spain", region: "Europe", lat: 39.57, lon: 2.65, daily: 150, bestMonths: [5, 6, 7, 9], vibes: v(5, 2, 4, 4, 2, 4, 3) },
  { slug: "rome", name: "Rome", country: "Italy", region: "Europe", lat: 41.9, lon: 12.5, daily: 140, bestMonths: [4, 5, 6, 9, 10], vibes: v(1, 5, 5, 3, 5, 1, 1) },
  { slug: "florence", name: "Florence", country: "Italy", region: "Europe", lat: 43.77, lon: 11.26, daily: 135, bestMonths: [4, 5, 9, 10], vibes: v(0, 3, 5, 2, 5, 3, 1) },
  { slug: "amalfi", name: "Amalfi Coast", country: "Italy", region: "Europe", lat: 40.63, lon: 14.6, daily: 210, bestMonths: [5, 6, 9], vibes: v(5, 1, 5, 2, 4, 5, 3) },
  { slug: "athens", name: "Athens", country: "Greece", region: "Europe", lat: 37.98, lon: 23.73, daily: 115, bestMonths: [4, 5, 6, 9, 10], vibes: v(3, 4, 4, 4, 5, 2, 2) },
  { slug: "santorini", name: "Santorini", country: "Greece", region: "Europe", lat: 36.39, lon: 25.46, daily: 220, bestMonths: [5, 6, 9, 10], vibes: v(5, 1, 4, 3, 3, 4, 2) },
  { slug: "split", name: "Split", country: "Croatia", region: "Europe", lat: 43.51, lon: 16.44, daily: 125, bestMonths: [5, 6, 9], vibes: v(5, 2, 4, 4, 4, 4, 4) },
  { slug: "dubrovnik", name: "Dubrovnik", country: "Croatia", region: "Europe", lat: 42.65, lon: 18.09, daily: 160, bestMonths: [5, 6, 9], vibes: v(4, 2, 4, 3, 5, 3, 3) },
  { slug: "paris", name: "Paris", country: "France", region: "Europe", lat: 48.86, lon: 2.35, daily: 190, bestMonths: [4, 5, 6, 9, 10], vibes: v(0, 5, 5, 4, 5, 1, 1) },
  { slug: "nice", name: "Nice", country: "France", region: "Europe", lat: 43.7, lon: 7.27, daily: 175, bestMonths: [5, 6, 9], vibes: v(4, 3, 4, 3, 3, 4, 2) },
  { slug: "london", name: "London", country: "United Kingdom", region: "Europe", lat: 51.51, lon: -0.13, daily: 200, bestMonths: [5, 6, 7, 9], vibes: v(0, 5, 4, 5, 5, 1, 1) },
  { slug: "edinburgh", name: "Edinburgh", country: "United Kingdom", region: "Europe", lat: 55.95, lon: -3.19, daily: 150, bestMonths: [5, 6, 7, 8, 9], vibes: v(0, 3, 3, 4, 5, 4, 3) },
  { slug: "amsterdam", name: "Amsterdam", country: "Netherlands", region: "Europe", lat: 52.37, lon: 4.9, daily: 180, bestMonths: [4, 5, 6, 7, 8, 9], vibes: v(1, 4, 3, 5, 4, 1, 1) },
  { slug: "berlin", name: "Berlin", country: "Germany", region: "Europe", lat: 52.52, lon: 13.4, daily: 120, bestMonths: [5, 6, 7, 8, 9], vibes: v(0, 5, 4, 5, 4, 1, 1) },
  { slug: "prague", name: "Prague", country: "Czechia", region: "Europe", lat: 50.08, lon: 14.44, daily: 95, bestMonths: [4, 5, 6, 9, 10], vibes: v(0, 4, 4, 5, 5, 1, 1) },
  { slug: "vienna", name: "Vienna", country: "Austria", region: "Europe", lat: 48.21, lon: 16.37, daily: 140, bestMonths: [4, 5, 6, 9, 10, 12], vibes: v(0, 4, 4, 3, 5, 2, 1) },
  { slug: "budapest", name: "Budapest", country: "Hungary", region: "Europe", lat: 47.5, lon: 19.04, daily: 90, bestMonths: [4, 5, 6, 9, 10], vibes: v(0, 4, 4, 5, 4, 1, 1) },
  { slug: "copenhagen", name: "Copenhagen", country: "Denmark", region: "Europe", lat: 55.68, lon: 12.57, daily: 200, bestMonths: [5, 6, 7, 8, 9], vibes: v(1, 4, 5, 3, 3, 2, 1) },
  { slug: "reykjavik", name: "Reykjavik", country: "Iceland", region: "Europe", lat: 64.15, lon: -21.94, daily: 230, bestMonths: [6, 7, 8, 9, 2, 3], vibes: v(0, 2, 3, 2, 2, 5, 5) },
  { slug: "istanbul", name: "Istanbul", country: "Türkiye", region: "Europe", lat: 41.01, lon: 28.98, daily: 95, bestMonths: [4, 5, 6, 9, 10], vibes: v(1, 5, 5, 4, 5, 1, 1) },
  { slug: "antalya", name: "Antalya", country: "Türkiye", region: "Europe", lat: 36.9, lon: 30.7, daily: 100, bestMonths: [5, 6, 9, 10], vibes: v(5, 2, 4, 3, 4, 4, 3) },
  { slug: "izmir", name: "Izmir & Alaçatı", country: "Türkiye", region: "Europe", lat: 38.42, lon: 27.13, daily: 90, bestMonths: [5, 6, 9, 10], vibes: v(5, 3, 5, 4, 3, 3, 3) },
  { slug: "cappadocia", name: "Cappadocia", country: "Türkiye", region: "Europe", lat: 38.64, lon: 34.83, daily: 90, bestMonths: [4, 5, 6, 9, 10], vibes: v(0, 0, 3, 1, 4, 5, 4) },
  // North America
  { slug: "new-york", name: "New York", country: "USA", region: "North America", lat: 40.71, lon: -74.0, daily: 260, bestMonths: [4, 5, 6, 9, 10, 12], vibes: v(0, 5, 5, 5, 4, 1, 1) },
  { slug: "miami", name: "Miami", country: "USA", region: "North America", lat: 25.76, lon: -80.19, daily: 230, bestMonths: [11, 12, 1, 2, 3, 4], vibes: v(5, 4, 4, 5, 2, 2, 2) },
  { slug: "los-angeles", name: "Los Angeles", country: "USA", region: "North America", lat: 34.05, lon: -118.24, daily: 220, bestMonths: [4, 5, 6, 9, 10, 11], vibes: v(4, 4, 4, 4, 2, 3, 3) },
  { slug: "san-francisco", name: "San Francisco", country: "USA", region: "North America", lat: 37.77, lon: -122.42, daily: 230, bestMonths: [5, 6, 9, 10], vibes: v(1, 4, 5, 3, 3, 4, 3) },
  { slug: "new-orleans", name: "New Orleans", country: "USA", region: "North America", lat: 29.95, lon: -90.07, daily: 160, bestMonths: [2, 3, 4, 10, 11], vibes: v(0, 3, 5, 5, 4, 1, 1) },
  { slug: "las-vegas", name: "Las Vegas", country: "USA", region: "North America", lat: 36.17, lon: -115.14, daily: 190, bestMonths: [3, 4, 5, 10, 11], vibes: v(0, 4, 4, 5, 1, 2, 2) },
  { slug: "nashville", name: "Nashville", country: "USA", region: "North America", lat: 36.16, lon: -86.78, daily: 170, bestMonths: [4, 5, 9, 10], vibes: v(0, 3, 4, 5, 3, 2, 1) },
  { slug: "atlanta", name: "Atlanta", country: "USA", region: "North America", lat: 33.75, lon: -84.39, daily: 160, bestMonths: [3, 4, 5, 10, 11], vibes: v(0, 4, 4, 4, 3, 2, 1) },
  { slug: "honolulu", name: "Honolulu (Oahu)", country: "USA", region: "North America", lat: 21.31, lon: -157.86, daily: 300, bestMonths: [4, 5, 6, 9, 10], vibes: v(5, 2, 4, 3, 2, 5, 4) },
  { slug: "mexico-city", name: "Mexico City", country: "Mexico", region: "North America", lat: 19.43, lon: -99.13, daily: 100, bestMonths: [3, 4, 5, 10, 11], vibes: v(0, 5, 5, 4, 5, 1, 1) },
  { slug: "cancun", name: "Cancún & Riviera Maya", country: "Mexico", region: "North America", lat: 21.16, lon: -86.85, daily: 170, bestMonths: [12, 1, 2, 3, 4], vibes: v(5, 1, 3, 4, 3, 3, 3) },
  { slug: "toronto", name: "Toronto", country: "Canada", region: "North America", lat: 43.65, lon: -79.38, daily: 170, bestMonths: [5, 6, 9, 10], vibes: v(0, 5, 4, 4, 3, 2, 1) },
  // Middle East, Asia, Other
  { slug: "dubai", name: "Dubai", country: "UAE", region: "Middle East & Asia", lat: 25.2, lon: 55.27, daily: 220, bestMonths: [11, 12, 1, 2, 3], vibes: v(4, 5, 4, 4, 2, 1, 3) },
  { slug: "marrakech", name: "Marrakech", country: "Morocco", region: "Other", lat: 31.63, lon: -8.0, daily: 90, bestMonths: [3, 4, 5, 10, 11], vibes: v(0, 3, 4, 2, 5, 3, 4) },
  { slug: "cairo", name: "Cairo & Giza", country: "Egypt", region: "Other", lat: 30.04, lon: 31.24, daily: 75, bestMonths: [10, 11, 12, 1, 2, 3, 4], vibes: v(0, 3, 3, 2, 5, 2, 3) },
  { slug: "bangkok", name: "Bangkok", country: "Thailand", region: "Middle East & Asia", lat: 13.76, lon: 100.5, daily: 85, bestMonths: [11, 12, 1, 2], vibes: v(0, 5, 5, 5, 4, 1, 2) },
  { slug: "tokyo", name: "Tokyo", country: "Japan", region: "Middle East & Asia", lat: 35.68, lon: 139.69, daily: 190, bestMonths: [3, 4, 5, 10, 11], vibes: v(0, 5, 5, 4, 5, 2, 2) },
  { slug: "bali", name: "Bali", country: "Indonesia", region: "Middle East & Asia", lat: -8.41, lon: 115.19, daily: 100, bestMonths: [4, 5, 6, 7, 8, 9, 10], vibes: v(5, 1, 4, 3, 3, 5, 4) },
  { slug: "cape-town", name: "Cape Town", country: "South Africa", region: "Other", lat: -33.92, lon: 18.42, daily: 110, bestMonths: [11, 12, 1, 2, 3], vibes: v(4, 3, 5, 3, 3, 5, 5) },
];

export const CITY_BY_SLUG: Record<string, City> = Object.fromEntries(
  CITIES.map((c) => [c.slug, c]),
);

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export { range };
