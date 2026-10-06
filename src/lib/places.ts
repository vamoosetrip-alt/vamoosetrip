import { AIRPORTS } from "./airports";
import { CITY_BY_SLUG } from "./cities";

/** Anything with a position on the map: a home airport or a destination city. */
export type Place = {
  slug: string;
  name: string;
  lat: number;
  lon: number;
  iata?: string;
  hub?: boolean;
};

const AIRPORT_BY_SLUG: Record<string, Place & { country: string }> = Object.fromEntries(
  AIRPORTS.map((a) => [
    a.iata.toLowerCase(),
    { slug: a.iata.toLowerCase(), name: a.name, country: a.country, lat: a.lat, lon: a.lon, iata: a.iata, hub: a.hub },
  ]),
);

/**
 * Look up a member's home. New sign-ups store an airport code (for example "adb").
 * Trips created before the airport list stored a city slug (for example "izmir"), so those still work.
 */
export function resolvePlace(slug: string): Place | undefined {
  return AIRPORT_BY_SLUG[slug] ?? CITY_BY_SLUG[slug];
}

export type HomeOption = { slug: string; label: string };

export const HOME_OPTIONS: HomeOption[] = AIRPORTS.map((a) => ({
  slug: a.iata.toLowerCase(),
  label: `${a.name} (${a.iata}), ${a.country}`,
})).sort((x, y) => x.label.localeCompare(y.label));
