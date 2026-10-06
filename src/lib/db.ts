import { neon } from "@neondatabase/serverless";
import { randomBytes } from "node:crypto";
import type { VibeKey } from "./cities";

function client() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

export type TripRow = {
  id: string;
  code: string;
  name: string;
  month: number;
  nights: number;
  organizer_token: string;
  decided_city: string | null;
};

export type MemberRow = {
  id: string;
  trip_id: string;
  name: string;
  home_slug: string;
  budget: number;
  vibes: VibeKey[];
  token: string;
};

export const newToken = () => randomBytes(16).toString("hex");

// No 0/O/1/I to keep invite codes easy to read out loud.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function newCode(len = 6): string {
  const bytes = randomBytes(len);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

export async function createTrip(input: {
  name: string;
  month: number;
  nights: number;
}): Promise<{ code: string; organizerToken: string }> {
  const sql = client();
  const organizerToken = newToken();
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = newCode();
    const rows = await sql`
      INSERT INTO trips (code, name, month, nights, organizer_token)
      VALUES (${code}, ${input.name}, ${input.month}, ${input.nights}, ${organizerToken})
      ON CONFLICT (code) DO NOTHING
      RETURNING code`;
    if (rows.length) return { code, organizerToken };
  }
  throw new Error("Could not allocate a trip code");
}

export async function getTrip(code: string): Promise<TripRow | null> {
  const sql = client();
  const rows = await sql`
    SELECT id, code, name, month, nights, organizer_token, decided_city
    FROM trips WHERE code = ${code.toUpperCase()}`;
  return (rows[0] as TripRow) ?? null;
}

export async function listMembers(tripId: string): Promise<MemberRow[]> {
  const sql = client();
  const rows = await sql`
    SELECT id, trip_id, name, home_slug, budget, vibes, token
    FROM members WHERE trip_id = ${tripId} ORDER BY created_at`;
  return rows as MemberRow[];
}

export async function addMember(input: {
  tripId: string;
  name: string;
  homeSlug: string;
  budget: number;
  vibes: string[];
}): Promise<{ id: string; token: string }> {
  const sql = client();
  const token = newToken();
  const rows = await sql`
    INSERT INTO members (trip_id, name, home_slug, budget, vibes, token)
    VALUES (${input.tripId}, ${input.name}, ${input.homeSlug}, ${input.budget}, ${input.vibes}, ${token})
    RETURNING id`;
  return { id: rows[0].id as string, token };
}

export async function getMemberByToken(
  tripId: string,
  token: string,
): Promise<MemberRow | null> {
  const sql = client();
  const rows = await sql`
    SELECT id, trip_id, name, home_slug, budget, vibes, token
    FROM members WHERE trip_id = ${tripId} AND token = ${token}`;
  return (rows[0] as MemberRow) ?? null;
}

export const MAX_VOTES = 3;

export async function listVotes(
  tripId: string,
): Promise<{ member_id: string; city_slug: string }[]> {
  const sql = client();
  const rows = await sql`
    SELECT member_id, city_slug FROM votes WHERE trip_id = ${tripId}`;
  return rows as { member_id: string; city_slug: string }[];
}

/** Toggle an approval vote. Returns false when the member is already at the vote limit. */
export async function toggleVote(input: {
  tripId: string;
  memberId: string;
  citySlug: string;
}): Promise<boolean> {
  const sql = client();
  const removed = await sql`
    DELETE FROM votes
    WHERE member_id = ${input.memberId} AND city_slug = ${input.citySlug}
    RETURNING city_slug`;
  if (removed.length) return true;

  const count = await sql`
    SELECT count(*)::int AS n FROM votes WHERE member_id = ${input.memberId}`;
  if ((count[0].n as number) >= MAX_VOTES) return false;

  await sql`
    INSERT INTO votes (member_id, trip_id, city_slug)
    VALUES (${input.memberId}, ${input.tripId}, ${input.citySlug})
    ON CONFLICT DO NOTHING`;
  return true;
}

/** Lock in (or, with null, reopen) the group's destination. */
export async function setDecision(tripId: string, citySlug: string | null): Promise<void> {
  const sql = client();
  await sql`UPDATE trips SET decided_city = ${citySlug} WHERE id = ${tripId}`;
}
