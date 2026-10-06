import type { City } from "./cities";
import { MONTHS } from "./cities";

// All outbound "next step" links live here. When you join affiliate programs, add your
// tracking IDs in this one file (or as environment variables) and every button picks them up.

export function flightsLink(fromName: string, to: City, month: number): string {
  const q = `Flights from ${fromName} to ${to.name} in ${MONTHS[month - 1]}`;
  return `https://www.google.com/travel/flights?q=${encodeURIComponent(q)}`;
}

export function hotelsLink(to: City): string {
  return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(`${to.name}, ${to.country}`)}`;
}

export function toursLink(to: City): string {
  return `https://www.viator.com/searchResults/all?text=${encodeURIComponent(to.name)}`;
}
