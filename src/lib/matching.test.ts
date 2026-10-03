import { test } from "node:test";
import assert from "node:assert/strict";
import { rankDestinations, estimateFlight } from "./matching";
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
