import type { City } from "./cities";
import type { Place } from "./places";

// All outbound "next step" links live here. When you join affiliate programs, add your
// tracking IDs in this one file (or as environment variables) and every button picks them up.

// Airport / metro codes so the flight search opens with both ends already filled in.
const IATA: Record<string, string> = {
  lisbon: "LIS", porto: "OPO", barcelona: "BCN", madrid: "MAD", seville: "SVQ", mallorca: "PMI",
  rome: "ROM", florence: "FLR", amalfi: "NAP", athens: "ATH", santorini: "JTR", split: "SPU",
  dubrovnik: "DBV", paris: "PAR", nice: "NCE", london: "LON", edinburgh: "EDI", amsterdam: "AMS",
  berlin: "BER", prague: "PRG", vienna: "VIE", budapest: "BUD", copenhagen: "CPH", reykjavik: "KEF",
  istanbul: "IST", antalya: "AYT", izmir: "ADB", cappadocia: "ASR", "new-york": "NYC", miami: "MIA",
  "los-angeles": "LAX", "san-francisco": "SFO", "new-orleans": "MSY", "las-vegas": "LAS",
  nashville: "BNA", atlanta: "ATL", honolulu: "HNL", "mexico-city": "MEX", cancun: "CUN",
  toronto: "YTO", dubai: "DXB", marrakech: "RAK", cairo: "CAI", bangkok: "BKK", tokyo: "TYO",
  bali: "DPS", "cape-town": "CPT",
};

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (d: Date) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

/** The 15th of the trip month (next time it comes round), plus the return date after the nights. */
export function tripDates(month: number, nights: number, today = new Date()): { depart: string; back: string } {
  let year = today.getUTCFullYear();
  if (Date.UTC(year, month - 1, 15) <= today.getTime()) year += 1;
  const depart = new Date(Date.UTC(year, month - 1, 15));
  const back = new Date(Date.UTC(year, month - 1, 15 + nights));
  return { depart: iso(depart), back: iso(back) };
}

export function flightsLink(from: Place, to: City, month: number, nights: number): string {
  const a = from.iata ?? IATA[from.slug] ?? from.name;
  const b = to.iata ?? IATA[to.slug] ?? to.name;
  const { depart, back } = tripDates(month, nights);
  const q = `Flights from ${a} to ${b} on ${depart} through ${back}`;
  return `https://www.google.com/travel/flights?q=${encodeURIComponent(q)}`;
}

export function hotelsLink(to: City): string {
  return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(`${to.name}, ${to.country}`)}`;
}

export function toursLink(to: City): string {
  return `https://www.viator.com/searchResults/all?text=${encodeURIComponent(to.name)}`;
}
