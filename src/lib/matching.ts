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

/** Rough round-trip economy fare in EUR. A heuristic, to be replaced by a live price API. */
export function estimateFlight(from: City, to: City): number {
  const d = distanceKm(from, to);
  if (d < 80) return 0;
  const shortHaul = Math.min(d, 2500);
  const longHaul = Math.max(0, d - 2500);
  return Math.round(50 + shortHaul * 0.11 + longHaul * 0.06);
}

function seasonFactor(city: City, month: number): number {
  if (city.bestMonths.includes(month)) return 1;
  const prev = ((month + 10) % 12) + 1;
  const next = (month % 12) + 1;
  if (city.bestMonths.includes(prev) || city.bestMonths.includes(next)) return 0.6;
  return 0.25;
}

function budgetFit(cost: number, budget: number): number {
  if (budget <= 0) return 0;
  if (cost <= budget) return 1;
  return Math.max(0, 1 - ((cost - budget) / budget) * 1.5);
}

function vibeFit(city: City, vibes: VibeKey[]): number {
  if (vibes.length === 0) return 0.5;
  const total = vibes.reduce((sum, k) => sum + city.vibes[k] / 5, 0);
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
      const flight = home ? estimateFlight(home, city) : 150;
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
    const score = Math.round((0.5 * mean + 0.5 * min) * (0.8 + 0.2 * season) * 100);

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
