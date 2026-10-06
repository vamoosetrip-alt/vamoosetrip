import { test } from "node:test";
import assert from "node:assert/strict";
import { rankDestinations, estimateFlight, distanceKm } from "./matching";
import { CITY_BY_SLUG } from "./cities";

test("beach-loving group in summer on a modest budget gets a beach city", () => {
  const ranked = rankDestinations(
    [
      { name: "A", homeSlug: "london", budget: 700, vibes: ["beach", "food"] },
      { name: "B", homeSlug: "berlin", budget: 700, vibes: ["beach", "nightlife"] },
    ],
    { month: 6, nights: 4 },
  );
  const top = ranked.slice(0, 5).map((r) => r.city.slug);
  assert.ok(
    top.some((s) => ["split", "mallorca", "antalya", "izmir", "barcelona", "athens"].includes(s)),
    `unexpected top 5: ${top.join(", ")}`,
  );
});

test("a tiny budget pushes expensive far-away places down", () => {
  const ranked = rankDestinations(
    [{ name: "A", homeSlug: "berlin", budget: 450, vibes: ["city"] }],
    { month: 5, nights: 3 },
  );
  const rank = (slug: string) => ranked.findIndex((r) => r.city.slug === slug);
  assert.ok(rank("prague") < rank("honolulu"));
});

test("fairness: the unhappiest member matters", () => {
  const solo = rankDestinations(
    [{ name: "A", homeSlug: "paris", budget: 1500, vibes: ["nightlife"] }],
    { month: 6, nights: 3 },
  )[0];
  const duo = rankDestinations(
    [
      { name: "A", homeSlug: "paris", budget: 1500, vibes: ["nightlife"] },
      { name: "B", homeSlug: "paris", budget: 1500, vibes: ["nature"] },
    ],
    { month: 6, nights: 3 },
  )[0];
  assert.ok(duo.score < solo.score);
});

test("flight estimate is zero for the same city and grows with distance", () => {
  const lis = CITY_BY_SLUG["lisbon"];
  assert.equal(estimateFlight(lis, lis), 0);
  assert.ok(estimateFlight(lis, CITY_BY_SLUG["madrid"]) < estimateFlight(lis, CITY_BY_SLUG["tokyo"]));
});

test("empty group returns no results", () => {
  assert.deepEqual(rankDestinations([], { month: 5, nights: 3 }), []);
});

test("flights cost more in peak summer than in winter, and island routes cost more than hub routes", () => {
  const ist = CITY_BY_SLUG["istanbul"];
  const rome = CITY_BY_SLUG["rome"];
  assert.ok(estimateFlight(ist, rome, 7) > estimateFlight(ist, rome, 2));
  const ath = CITY_BY_SLUG["athens"];
  const santorini = CITY_BY_SLUG["santorini"];
  const base = estimateFlight(ist, ath, 5);
  assert.ok(base > 0);
  assert.ok(estimateFlight(ist, santorini, 5) / distanceKm(ist, santorini) > base / distanceKm(ist, ath));
});

import { CITIES, REGIONS } from "./cities";
import { AIRPORTS } from "./airports";
import { resolvePlace } from "./places";

test("destination data is consistent", () => {
  const slugs = new Set<string>();
  for (const c of CITIES) {
    assert.ok(!slugs.has(c.slug), `duplicate slug ${c.slug}`);
    slugs.add(c.slug);
    assert.ok(REGIONS.includes(c.region), `${c.slug} has an unknown region`);
    assert.ok(c.bestMonths.length > 0 && c.bestMonths.every((m) => m >= 1 && m <= 12), `${c.slug} months`);
    assert.ok(Object.values(c.vibes).every((n) => n >= 0 && n <= 5), `${c.slug} vibes`);
    assert.ok(c.daily > 0 && Math.abs(c.lat) <= 90 && Math.abs(c.lon) <= 180, `${c.slug} numbers`);
  }
  assert.ok(CITIES.length >= 120);
  for (const r of REGIONS) assert.ok(CITIES.some((c) => c.region === r), `no destinations in ${r}`);
});

test("home airports resolve, and older city slugs still work", () => {
  const codes = new Set(AIRPORTS.map((a) => a.iata));
  assert.equal(codes.size, AIRPORTS.length);
  assert.equal(resolvePlace("adb")?.name, "Izmir");
  assert.ok(resolvePlace("izmir"));
  assert.equal(resolvePlace("nope"), undefined);
});

test("a group from Izmir and Istanbul can be matched, with far-east options available", () => {
  const ranked = rankDestinations(
    [
      { name: "A", homeSlug: "adb", budget: 2500, vibes: ["beach", "adventure"] },
      { name: "B", homeSlug: "ist", budget: 2500, vibes: ["beach", "nature"] },
    ],
    { month: 1, nights: 8 },
  );
  assert.ok(ranked.length >= 120);
  assert.ok(ranked.slice(0, 10).some((r) => r.city.region === "Asia"), "expected an Asian beach option in January");
});
