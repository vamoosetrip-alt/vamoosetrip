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

export const REGIONS = [
  "Europe",
  "North America",
  "Latin America & Caribbean",
  "Middle East",
  "Asia",
  "Africa",
  "Oceania",
] as const;
export type Region = (typeof REGIONS)[number];

export type City = {
  slug: string;
  name: string;
  country: string;
  region: Region;
  /** airport or metro code used to prefill flight searches */
  iata?: string;
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

// A hand-curated list. Scores are editorial judgement (0-5), meant to be tuned.
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
  { slug: "mexico-city", name: "Mexico City", country: "Mexico", region: "Latin America & Caribbean", lat: 19.43, lon: -99.13, daily: 100, bestMonths: [3, 4, 5, 10, 11], vibes: v(0, 5, 5, 4, 5, 1, 1) },
  { slug: "cancun", name: "Cancún & Riviera Maya", country: "Mexico", region: "Latin America & Caribbean", lat: 21.16, lon: -86.85, daily: 170, bestMonths: [12, 1, 2, 3, 4], vibes: v(5, 1, 3, 4, 3, 3, 3) },
  { slug: "toronto", name: "Toronto", country: "Canada", region: "North America", lat: 43.65, lon: -79.38, daily: 170, bestMonths: [5, 6, 9, 10], vibes: v(0, 5, 4, 4, 3, 2, 1) },
  // Middle East, Asia, Other
  { slug: "dubai", name: "Dubai", country: "UAE", region: "Middle East", lat: 25.2, lon: 55.27, daily: 220, bestMonths: [11, 12, 1, 2, 3], vibes: v(4, 5, 4, 4, 2, 1, 3) },
  { slug: "marrakech", name: "Marrakech", country: "Morocco", region: "Africa", lat: 31.63, lon: -8.0, daily: 90, bestMonths: [3, 4, 5, 10, 11], vibes: v(0, 3, 4, 2, 5, 3, 4) },
  { slug: "cairo", name: "Cairo & Giza", country: "Egypt", region: "Africa", lat: 30.04, lon: 31.24, daily: 75, bestMonths: [10, 11, 12, 1, 2, 3, 4], vibes: v(0, 3, 3, 2, 5, 2, 3) },
  { slug: "bangkok", name: "Bangkok", country: "Thailand", region: "Asia", lat: 13.76, lon: 100.5, daily: 85, bestMonths: [11, 12, 1, 2], vibes: v(0, 5, 5, 5, 4, 1, 2) },
  { slug: "tokyo", name: "Tokyo", country: "Japan", region: "Asia", lat: 35.68, lon: 139.69, daily: 190, bestMonths: [3, 4, 5, 10, 11], vibes: v(0, 5, 5, 4, 5, 2, 2) },
  { slug: "bali", name: "Bali", country: "Indonesia", region: "Asia", lat: -8.41, lon: 115.19, daily: 100, bestMonths: [4, 5, 6, 7, 8, 9, 10], vibes: v(5, 1, 4, 3, 3, 5, 4) },
  { slug: "cape-town", name: "Cape Town", country: "South Africa", region: "Africa", lat: -33.92, lon: 18.42, daily: 110, bestMonths: [11, 12, 1, 2, 3], vibes: v(4, 3, 5, 3, 3, 5, 5) },
  // Europe (more)
  { slug: "milan", name: "Milan", country: "Italy", region: "Europe", lat: 45.46, lon: 9.19, daily: 150, bestMonths: [4, 5, 6, 9, 10], vibes: v(0, 5, 4, 5, 4, 1, 1), iata: "MIL" },
  { slug: "venice", name: "Venice", country: "Italy", region: "Europe", lat: 45.44, lon: 12.32, daily: 170, bestMonths: [4, 5, 6, 9, 10], vibes: v(1, 3, 4, 2, 5, 1, 0), iata: "VCE" },
  { slug: "palermo", name: "Palermo & Sicily", country: "Italy", region: "Europe", lat: 38.12, lon: 13.36, daily: 90, bestMonths: [4, 5, 6, 9, 10], vibes: v(3, 3, 5, 3, 5, 3, 2), iata: "PMO" },
  { slug: "malaga", name: "Málaga", country: "Spain", region: "Europe", lat: 36.72, lon: -4.42, daily: 100, bestMonths: [4, 5, 6, 9, 10], vibes: v(4, 4, 5, 4, 3, 2, 2), iata: "AGP" },
  { slug: "valencia", name: "Valencia", country: "Spain", region: "Europe", lat: 39.47, lon: -0.38, daily: 105, bestMonths: [4, 5, 6, 9, 10], vibes: v(4, 4, 5, 4, 3, 2, 2), iata: "VLC" },
  { slug: "ibiza", name: "Ibiza", country: "Spain", region: "Europe", lat: 38.91, lon: 1.43, daily: 160, bestMonths: [5, 6, 9, 10], vibes: v(5, 2, 3, 5, 1, 3, 2), iata: "IBZ" },
  { slug: "brussels", name: "Brussels", country: "Belgium", region: "Europe", lat: 50.85, lon: 4.35, daily: 130, bestMonths: [5, 6, 7, 8, 9], vibes: v(0, 4, 5, 3, 3, 1, 0), iata: "BRU" },
  { slug: "zurich", name: "Zurich & Swiss Alps", country: "Switzerland", region: "Europe", lat: 47.38, lon: 8.54, daily: 240, bestMonths: [6, 7, 8, 9], vibes: v(1, 3, 3, 2, 2, 5, 5), iata: "ZRH" },
  { slug: "munich", name: "Munich", country: "Germany", region: "Europe", lat: 48.14, lon: 11.58, daily: 140, bestMonths: [5, 6, 7, 8, 9, 12], vibes: v(0, 4, 4, 4, 4, 3, 3), iata: "MUC" },
  { slug: "dublin", name: "Dublin", country: "Ireland", region: "Europe", lat: 53.35, lon: -6.26, daily: 150, bestMonths: [5, 6, 7, 8, 9], vibes: v(0, 4, 3, 5, 4, 3, 1), iata: "DUB" },
  { slug: "krakow", name: "Kraków", country: "Poland", region: "Europe", lat: 50.06, lon: 19.94, daily: 70, bestMonths: [5, 6, 7, 8, 9], vibes: v(0, 3, 4, 4, 5, 1, 0), iata: "KRK" },
  { slug: "tallinn", name: "Tallinn", country: "Estonia", region: "Europe", lat: 59.44, lon: 24.75, daily: 100, bestMonths: [6, 7, 8], vibes: v(1, 2, 4, 3, 4, 2, 1), iata: "TLL" },
  { slug: "stockholm", name: "Stockholm", country: "Sweden", region: "Europe", lat: 59.33, lon: 18.07, daily: 170, bestMonths: [6, 7, 8], vibes: v(1, 4, 4, 3, 3, 3, 1), iata: "STO" },
  { slug: "helsinki", name: "Helsinki", country: "Finland", region: "Europe", lat: 60.17, lon: 24.94, daily: 160, bestMonths: [6, 7, 8, 12], vibes: v(1, 3, 3, 3, 3, 4, 2), iata: "HEL" },
  { slug: "tbilisi", name: "Tbilisi", country: "Georgia", region: "Europe", lat: 41.72, lon: 44.79, daily: 65, bestMonths: [5, 6, 9, 10], vibes: v(0, 3, 5, 4, 5, 4, 3), iata: "TBS" },
  { slug: "malta", name: "Malta (Valletta)", country: "Malta", region: "Europe", lat: 35.9, lon: 14.51, daily: 110, bestMonths: [4, 5, 6, 9, 10], vibes: v(4, 2, 4, 4, 5, 2, 3), iata: "MLA" },
  { slug: "crete", name: "Crete", country: "Greece", region: "Europe", lat: 35.34, lon: 25.14, daily: 100, bestMonths: [5, 6, 9, 10], vibes: v(5, 2, 5, 3, 5, 4, 3), iata: "HER" },
  { slug: "corfu", name: "Corfu", country: "Greece", region: "Europe", lat: 39.62, lon: 19.92, daily: 100, bestMonths: [5, 6, 9, 10], vibes: v(5, 1, 4, 3, 3, 4, 2), iata: "CFU" },
  { slug: "bodrum", name: "Bodrum", country: "Türkiye", region: "Europe", lat: 37.04, lon: 27.43, daily: 110, bestMonths: [5, 6, 9, 10], vibes: v(5, 2, 4, 5, 2, 3, 3), iata: "BJV" },
  { slug: "tenerife", name: "Tenerife", country: "Spain", region: "Europe", lat: 28.29, lon: -16.63, daily: 95, bestMonths: [1, 2, 3, 4, 5, 10, 11, 12], vibes: v(4, 1, 3, 3, 1, 5, 4), iata: "TFS" },
  { slug: "madeira", name: "Madeira", country: "Portugal", region: "Europe", lat: 32.65, lon: -16.91, daily: 105, bestMonths: [4, 5, 6, 9, 10], vibes: v(2, 1, 4, 1, 2, 5, 5), iata: "FNC" },
  { slug: "belgrade", name: "Belgrade", country: "Serbia", region: "Europe", lat: 44.79, lon: 20.45, daily: 65, bestMonths: [5, 6, 9], vibes: v(0, 3, 4, 5, 3, 1, 1), iata: "BEG" },
  // North America (more)
  { slug: "chicago", name: "Chicago", country: "USA", region: "North America", lat: 41.88, lon: -87.63, daily: 190, bestMonths: [5, 6, 9, 10], vibes: v(1, 5, 5, 4, 4, 1, 1), iata: "CHI" },
  { slug: "boston", name: "Boston", country: "USA", region: "North America", lat: 42.36, lon: -71.06, daily: 210, bestMonths: [5, 6, 9, 10], vibes: v(0, 4, 4, 3, 5, 1, 1), iata: "BOS" },
  { slug: "washington-dc", name: "Washington DC", country: "USA", region: "North America", lat: 38.91, lon: -77.04, daily: 190, bestMonths: [3, 4, 5, 9, 10], vibes: v(0, 4, 4, 3, 5, 1, 1), iata: "WAS" },
  { slug: "seattle", name: "Seattle", country: "USA", region: "North America", lat: 47.61, lon: -122.33, daily: 200, bestMonths: [6, 7, 8, 9], vibes: v(0, 4, 4, 3, 2, 5, 4), iata: "SEA" },
  { slug: "san-diego", name: "San Diego", country: "USA", region: "North America", lat: 32.72, lon: -117.16, daily: 185, bestMonths: [4, 5, 6, 9, 10], vibes: v(5, 3, 4, 3, 2, 3, 3), iata: "SAN" },
  { slug: "vancouver", name: "Vancouver", country: "Canada", region: "North America", lat: 49.28, lon: -123.12, daily: 170, bestMonths: [6, 7, 8, 9], vibes: v(2, 4, 5, 3, 2, 5, 5), iata: "YVR" },
  { slug: "montreal", name: "Montréal", country: "Canada", region: "North America", lat: 45.5, lon: -73.57, daily: 140, bestMonths: [5, 6, 7, 8, 9], vibes: v(0, 5, 5, 5, 4, 1, 1), iata: "YMQ" },
  { slug: "banff", name: "Banff & Canadian Rockies", country: "Canada", region: "North America", lat: 51.18, lon: -115.57, daily: 190, bestMonths: [1, 2, 6, 7, 8, 9, 12], vibes: v(0, 0, 2, 1, 1, 5, 5), iata: "YYC" },
  { slug: "austin", name: "Austin", country: "USA", region: "North America", lat: 30.27, lon: -97.74, daily: 170, bestMonths: [3, 4, 5, 10, 11], vibes: v(0, 4, 5, 5, 2, 2, 2), iata: "AUS" },
  // Latin America & Caribbean (more)
  { slug: "rio", name: "Rio de Janeiro", country: "Brazil", region: "Latin America & Caribbean", lat: -22.91, lon: -43.17, daily: 95, bestMonths: [4, 5, 6, 9, 10], vibes: v(5, 5, 4, 5, 3, 4, 4), iata: "RIO" },
  { slug: "buenos-aires", name: "Buenos Aires", country: "Argentina", region: "Latin America & Caribbean", lat: -34.6, lon: -58.38, daily: 85, bestMonths: [3, 4, 5, 9, 10, 11], vibes: v(0, 5, 5, 5, 4, 1, 1), iata: "BUE" },
  { slug: "cusco", name: "Cusco & Machu Picchu", country: "Peru", region: "Latin America & Caribbean", lat: -13.53, lon: -71.97, daily: 85, bestMonths: [5, 6, 7, 8, 9], vibes: v(0, 1, 4, 2, 5, 5, 5), iata: "CUZ" },
  { slug: "cartagena", name: "Cartagena", country: "Colombia", region: "Latin America & Caribbean", lat: 10.39, lon: -75.48, daily: 90, bestMonths: [12, 1, 2, 3], vibes: v(4, 3, 4, 5, 4, 2, 2), iata: "CTG" },
  { slug: "medellin", name: "Medellín", country: "Colombia", region: "Latin America & Caribbean", lat: 6.24, lon: -75.58, daily: 70, bestMonths: [12, 1, 2, 3, 7, 8], vibes: v(0, 4, 4, 5, 2, 3, 3), iata: "MDE" },
  { slug: "santiago", name: "Santiago & Chile", country: "Chile", region: "Latin America & Caribbean", lat: -33.45, lon: -70.67, daily: 95, bestMonths: [10, 11, 12, 1, 2, 3], vibes: v(1, 4, 4, 3, 2, 5, 5), iata: "SCL" },
  { slug: "punta-cana", name: "Punta Cana", country: "Dominican Republic", region: "Latin America & Caribbean", lat: 18.58, lon: -68.4, daily: 140, bestMonths: [12, 1, 2, 3, 4], vibes: v(5, 0, 2, 3, 0, 3, 2), iata: "PUJ" },
  { slug: "san-juan", name: "San Juan", country: "Puerto Rico", region: "Latin America & Caribbean", lat: 18.47, lon: -66.11, daily: 150, bestMonths: [12, 1, 2, 3, 4], vibes: v(4, 3, 4, 4, 4, 3, 2), iata: "SJU" },
  { slug: "costa-rica", name: "Costa Rica", country: "Costa Rica", region: "Latin America & Caribbean", lat: 9.93, lon: -84.08, daily: 115, bestMonths: [12, 1, 2, 3, 4], vibes: v(4, 0, 2, 2, 1, 5, 5), iata: "SJO" },
  { slug: "panama-city", name: "Panama City", country: "Panama", region: "Latin America & Caribbean", lat: 8.98, lon: -79.52, daily: 105, bestMonths: [12, 1, 2, 3, 4], vibes: v(3, 3, 3, 4, 3, 4, 3), iata: "PTY" },
  // Middle East (more)
  { slug: "doha", name: "Doha", country: "Qatar", region: "Middle East", lat: 25.29, lon: 51.53, daily: 190, bestMonths: [11, 12, 1, 2, 3], vibes: v(2, 4, 3, 3, 4, 1, 2), iata: "DOH" },
  { slug: "muscat", name: "Muscat", country: "Oman", region: "Middle East", lat: 23.59, lon: 58.41, daily: 130, bestMonths: [11, 12, 1, 2, 3], vibes: v(3, 2, 3, 1, 4, 5, 4), iata: "MCT" },
  { slug: "amman", name: "Amman & Petra", country: "Jordan", region: "Middle East", lat: 31.95, lon: 35.93, daily: 90, bestMonths: [3, 4, 5, 10, 11], vibes: v(2, 2, 4, 2, 5, 4, 4), iata: "AMM" },
  // Asia (more)
  { slug: "singapore", name: "Singapore", country: "Singapore", region: "Asia", lat: 1.35, lon: 103.82, daily: 200, bestMonths: [2, 3, 4, 5, 6, 7, 8, 9], vibes: v(2, 5, 5, 5, 3, 2, 1), iata: "SIN" },
  { slug: "hong-kong", name: "Hong Kong", country: "Hong Kong", region: "Asia", lat: 22.32, lon: 114.17, daily: 200, bestMonths: [10, 11, 12, 3, 4], vibes: v(1, 5, 5, 5, 3, 3, 2), iata: "HKG" },
  { slug: "seoul", name: "Seoul", country: "South Korea", region: "Asia", lat: 37.57, lon: 126.98, daily: 150, bestMonths: [4, 5, 9, 10], vibes: v(0, 5, 5, 5, 4, 3, 2), iata: "SEL" },
  { slug: "kyoto", name: "Kyoto", country: "Japan", region: "Asia", lat: 35.01, lon: 135.77, daily: 170, bestMonths: [3, 4, 5, 10, 11], vibes: v(0, 3, 5, 2, 5, 4, 2), iata: "OSA" },
  { slug: "osaka", name: "Osaka", country: "Japan", region: "Asia", lat: 34.69, lon: 135.5, daily: 150, bestMonths: [3, 4, 5, 10, 11], vibes: v(0, 5, 5, 5, 4, 1, 1), iata: "OSA" },
  { slug: "taipei", name: "Taipei", country: "Taiwan", region: "Asia", lat: 25.03, lon: 121.57, daily: 110, bestMonths: [3, 4, 10, 11, 12], vibes: v(0, 4, 5, 4, 4, 4, 3), iata: "TPE" },
  { slug: "phuket", name: "Phuket", country: "Thailand", region: "Asia", lat: 7.88, lon: 98.39, daily: 95, bestMonths: [11, 12, 1, 2, 3, 4], vibes: v(5, 2, 4, 4, 2, 3, 4), iata: "HKT" },
  { slug: "chiang-mai", name: "Chiang Mai", country: "Thailand", region: "Asia", lat: 18.79, lon: 98.98, daily: 65, bestMonths: [11, 12, 1, 2], vibes: v(0, 2, 4, 3, 4, 5, 4), iata: "CNX" },
  { slug: "hanoi", name: "Hanoi & Ha Long Bay", country: "Vietnam", region: "Asia", lat: 21.03, lon: 105.85, daily: 65, bestMonths: [10, 11, 3, 4], vibes: v(1, 4, 5, 3, 5, 4, 3), iata: "HAN" },
  { slug: "ho-chi-minh", name: "Ho Chi Minh City", country: "Vietnam", region: "Asia", lat: 10.82, lon: 106.63, daily: 65, bestMonths: [12, 1, 2, 3], vibes: v(0, 5, 5, 4, 3, 1, 2), iata: "SGN" },
  { slug: "da-nang", name: "Da Nang & Hoi An", country: "Vietnam", region: "Asia", lat: 16.05, lon: 108.2, daily: 60, bestMonths: [2, 3, 4, 5, 6, 7, 8], vibes: v(5, 2, 5, 3, 4, 3, 3), iata: "DAD" },
  { slug: "siem-reap", name: "Siem Reap (Angkor)", country: "Cambodia", region: "Asia", lat: 13.36, lon: 103.86, daily: 55, bestMonths: [11, 12, 1, 2, 3], vibes: v(0, 1, 3, 3, 5, 3, 2), iata: "REP" },
  { slug: "kuala-lumpur", name: "Kuala Lumpur", country: "Malaysia", region: "Asia", lat: 3.14, lon: 101.69, daily: 75, bestMonths: [5, 6, 7, 8, 12, 1, 2], vibes: v(0, 4, 5, 4, 3, 2, 2), iata: "KUL" },
  { slug: "delhi", name: "Delhi & Agra", country: "India", region: "Asia", lat: 28.61, lon: 77.21, daily: 65, bestMonths: [10, 11, 12, 1, 2, 3], vibes: v(0, 4, 5, 3, 5, 1, 2), iata: "DEL" },
  { slug: "goa", name: "Goa", country: "India", region: "Asia", lat: 15.5, lon: 73.83, daily: 60, bestMonths: [11, 12, 1, 2, 3], vibes: v(5, 1, 4, 4, 2, 3, 2), iata: "GOI" },
  { slug: "kathmandu", name: "Kathmandu & Himalaya", country: "Nepal", region: "Asia", lat: 27.72, lon: 85.32, daily: 55, bestMonths: [3, 4, 5, 10, 11], vibes: v(0, 1, 3, 2, 5, 5, 5), iata: "KTM" },
  { slug: "maldives", name: "Maldives", country: "Maldives", region: "Asia", lat: 3.2, lon: 73.22, daily: 400, bestMonths: [12, 1, 2, 3, 4], vibes: v(5, 0, 2, 1, 0, 4, 3), iata: "MLE" },
  { slug: "colombo", name: "Sri Lanka", country: "Sri Lanka", region: "Asia", lat: 6.93, lon: 79.85, daily: 60, bestMonths: [12, 1, 2, 3, 7, 8], vibes: v(4, 2, 4, 2, 5, 5, 4), iata: "CMB" },
  { slug: "shanghai", name: "Shanghai", country: "China", region: "Asia", lat: 31.23, lon: 121.47, daily: 140, bestMonths: [3, 4, 5, 9, 10, 11], vibes: v(0, 5, 5, 5, 4, 1, 1), iata: "SHA" },
  { slug: "beijing", name: "Beijing", country: "China", region: "Asia", lat: 39.9, lon: 116.41, daily: 120, bestMonths: [4, 5, 9, 10], vibes: v(0, 4, 4, 3, 5, 2, 2), iata: "BJS" },
  { slug: "koh-samui", name: "Koh Samui", country: "Thailand", region: "Asia", lat: 9.51, lon: 100.06, daily: 85, bestMonths: [1, 2, 3, 4, 5, 6, 7, 8], vibes: v(5, 1, 3, 4, 1, 4, 3), iata: "USM" },
  // Africa (more)
  { slug: "zanzibar", name: "Zanzibar", country: "Tanzania", region: "Africa", lat: -6.16, lon: 39.2, daily: 95, bestMonths: [6, 7, 8, 9, 10, 12, 1, 2], vibes: v(5, 1, 4, 3, 4, 3, 3), iata: "ZNZ" },
  { slug: "nairobi", name: "Nairobi & Maasai Mara", country: "Kenya", region: "Africa", lat: -1.29, lon: 36.82, daily: 220, bestMonths: [7, 8, 9, 10, 1, 2], vibes: v(0, 2, 3, 2, 2, 5, 5), iata: "NBO" },
  { slug: "mauritius", name: "Mauritius", country: "Mauritius", region: "Africa", lat: -20.35, lon: 57.55, daily: 180, bestMonths: [5, 6, 7, 8, 9, 10, 11], vibes: v(5, 0, 3, 3, 1, 4, 3), iata: "MRU" },
  { slug: "seychelles", name: "Seychelles", country: "Seychelles", region: "Africa", lat: -4.62, lon: 55.45, daily: 260, bestMonths: [4, 5, 10, 11], vibes: v(5, 0, 3, 2, 0, 5, 3), iata: "SEZ" },
  { slug: "victoria-falls", name: "Victoria Falls", country: "Zimbabwe", region: "Africa", lat: -17.93, lon: 25.86, daily: 170, bestMonths: [5, 6, 7, 8, 9], vibes: v(0, 0, 2, 1, 1, 5, 5), iata: "VFA" },
  { slug: "hurghada", name: "Hurghada (Red Sea)", country: "Egypt", region: "Africa", lat: 27.26, lon: 33.81, daily: 75, bestMonths: [3, 4, 5, 10, 11], vibes: v(5, 1, 3, 3, 1, 3, 4), iata: "HRG" },
  { slug: "luxor", name: "Luxor", country: "Egypt", region: "Africa", lat: 25.69, lon: 32.64, daily: 60, bestMonths: [10, 11, 12, 1, 2, 3], vibes: v(0, 1, 2, 1, 5, 2, 2), iata: "LXR" },
  // Oceania (more)
  { slug: "sydney", name: "Sydney", country: "Australia", region: "Oceania", lat: -33.87, lon: 151.21, daily: 200, bestMonths: [9, 10, 11, 3, 4], vibes: v(5, 5, 5, 4, 3, 4, 4), iata: "SYD" },
  { slug: "melbourne", name: "Melbourne", country: "Australia", region: "Oceania", lat: -37.81, lon: 144.96, daily: 185, bestMonths: [3, 4, 10, 11], vibes: v(1, 5, 5, 5, 4, 2, 2), iata: "MEL" },
  { slug: "auckland", name: "Auckland", country: "New Zealand", region: "Oceania", lat: -36.85, lon: 174.76, daily: 175, bestMonths: [12, 1, 2, 3], vibes: v(3, 4, 4, 3, 3, 5, 4), iata: "AKL" },
  { slug: "queenstown", name: "Queenstown", country: "New Zealand", region: "Oceania", lat: -45.03, lon: 168.66, daily: 190, bestMonths: [12, 1, 2, 3, 6, 7, 8], vibes: v(0, 1, 3, 3, 1, 5, 5), iata: "ZQN" },
  { slug: "cairns", name: "Cairns & Great Barrier Reef", country: "Australia", region: "Oceania", lat: -16.92, lon: 145.78, daily: 170, bestMonths: [5, 6, 7, 8, 9, 10], vibes: v(4, 1, 3, 3, 1, 5, 5), iata: "CNS" },
  { slug: "fiji", name: "Fiji", country: "Fiji", region: "Oceania", lat: -17.76, lon: 177.97, daily: 170, bestMonths: [5, 6, 7, 8, 9, 10], vibes: v(5, 0, 2, 2, 1, 4, 3), iata: "NAN" },
  { slug: "tahiti", name: "Tahiti & Bora Bora", country: "French Polynesia", region: "Oceania", lat: -17.54, lon: -149.57, daily: 350, bestMonths: [5, 6, 7, 8, 9, 10], vibes: v(5, 0, 3, 1, 1, 5, 3), iata: "PPT" },
];

export const CITY_BY_SLUG: Record<string, City> = Object.fromEntries(
  CITIES.map((c) => [c.slug, c]),
);

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export { range };
