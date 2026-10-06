import { CITIES, CITY_BY_SLUG, VIBES, type City, type VibeKey } from "./cities";

export type MemberPrefs = {
  name: string;
  homeSlug: string; // a slug from the city list, used as the home airport proxy
  budget: number; // EUR per person for the whole trip, flights included
  vibes: VibeKey[];
};

export type TripParams = { month: number; nights: number };

export type MemberResult = {
  name: string;
  cost: number; // estimated EUR per person
  satisfaction: number; // 0-1
  overBudget: boolean;
};

export type Ranked = {
  city: City;
  score: number; // 0-100
  avgCost: number;
  minCost: number;
  maxCost: number;
  seasonFit: "great" | "ok" | "off";
  members: MemberResult[];
  highlights: string[];
};

const R = 6371;

export function distanceKm(a: City, b: City): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Big international hubs have many carriers and competitive fares.
const HUBS = new Set([
  "london", "paris", "amsterdam", "frankfurt", "madrid", "barcelona", "rome", "istanbul",
  "new-york", "los-angeles", "atlanta", "toronto", "dubai", "tokyo", "berlin", "vienna",
]);
// Seasonal destinations and islands: fewer direct flights, higher fares than distance suggests.
const THIN_ROUTES = new Set([
  "santorini", "mallorca", "amalfi", "dubrovnik", "split", "cappadocia", "bali",
  "honolulu", "reykjavik", "cancun", "nice",
]);

/** Demand multiplier on the fare for the month of travel. Peak summer and the holidays cost more. */
export function seasonalFareFactor(month: number): number {
  const factors = [0.85, 0.85, 0.95, 1.0, 1.0, 1.1, 1.25, 1.25, 1.05, 0.95, 0.9, 1.2];
  return factors[((month - 1) % 12 + 12) % 12];
}

/**
 * Rough round-trip economy fare in EUR. A heuristic, not a live price: distance sets the base,
 * then the month of travel and how well connected the route is adjust it.
 */
export function estimateFlight(from: City, to: City, month = 6): number {
  const d = distanceKm(from, to);
  if (d < 80) return 0;
  const shortHaul = Math.min(d, 2500);
  const longHaul = Math.max(0, d - 2500);
  const fare = 50 + shortHaul * 0.11 + longHaul * 0.06;
  // Route connectivity: hub-to-hub is cheaper, thin routes (islands, seasonal) cost more.
  const hubs = (HUBS.has(from.slug) ? 1 : 0) + (HUBS.has(to.slug) ? 1 : 0);
  let tier = 1 - 0.06 * hubs;
  if (THIN_ROUTES.has(to.slug)) tier += 0.15;
  if (!HUBS.has(from.slug) && !HUBS.has(to.slug)) tier += 0.05; // likely a connection
  return Math.round(fare * tier * seasonalFareFactor(month));
}

function seasonFactor(city: City, month: number): number {
  if (city.bestMonths.includes(month)) return 1;
  const prev = ((month + 10) % 12) + 1;
  const next = (month % 12) + 1;
  if (city.bestMonths.includes(prev) || city.bestMonths.includes(next)) return 0.65;
  return 0.15;
}

function budgetFit(cost: number, budget: number): number {
  if (budget <= 0) return 0;
  if (cost <= budget) return 1;
  return Math.max(0, 1 - ((cost - budget) / budget) * 1.5);
}

function vibeFit(city: City, vibes: VibeKey[]): number {
  if (vibes.length === 0) return 0.5;
  // Squared so a 5/5 match is worth far more than a 3/5: strong fits stand out from "fine".
  const total = vibes.reduce((sum, k) => sum + (city.vibes[k] / 5) ** 2, 0);
  return total / vibes.length;
}

export function rankDestinations(
  members: MemberPrefs[],
  trip: TripParams,
): Ranked[] {
  if (members.length === 0) return [];

  const ranked = CITIES.map((city): Ranked => {
    const results: MemberResult[] = members.map((m) => {
      const home = CITY_BY_SLUG[m.homeSlug];
      const flight = home ? estimateFlight(home, city, trip.month) : 150;
      const cost = Math.round(flight + city.daily * trip.nights);
      const satisfaction =
        0.55 * vibeFit(city, m.vibes) + 0.45 * budgetFit(cost, m.budget);
      return { name: m.name, cost, satisfaction, overBudget: cost > m.budget };
    });

    const sats = results.map((r) => r.satisfaction);
    const mean = sats.reduce((a, b) => a + b, 0) / sats.length;
    const min = Math.min(...sats);
    const season = seasonFactor(city, trip.month);
    // Half average happiness, half the unhappiest person: nobody gets dragged somewhere miserable.
    const score = Math.round((0.5 * mean + 0.5 * min) * (0.6 + 0.4 * season) * 100);

    const costs = results.map((r) => r.cost);
    const wanted = new Map<VibeKey, number>();
    members.forEach((m) => m.vibes.forEach((k) => wanted.set(k, (wanted.get(k) ?? 0) + 1)));
    const highlights = [...wanted.entries()]
      .filter(([k]) => city.vibes[k] >= 4)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k]) => VIBES.find((x) => x.key === k)!.label);

    return {
      city,
      score,
      avgCost: Math.round(costs.reduce((a, b) => a + b, 0) / costs.length),
      minCost: Math.min(...costs),
      maxCost: Math.max(...costs),
      seasonFit: season === 1 ? "great" : season >= 0.6 ? "ok" : "off",
      members: results,
      highlights,
    };
  });

  return ranked.sort((a, b) => b.score - a.score);
}
