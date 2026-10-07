"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { CITY_BY_SLUG, VIBES } from "@/lib/cities";
import { resolvePlace } from "@/lib/places";
import {
  addMember,
  createTrip,
  getMemberByToken,
  getTrip,
  logEvent,
  setDecision,
  toggleVote,
} from "@/lib/db";

const COOKIE_AGE = 60 * 60 * 24 * 90;
const cookieOpts = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: COOKIE_AGE,
  secure: process.env.NODE_ENV === "production",
};

function text(fd: FormData, key: string, max: number): string {
  return String(fd.get(key) ?? "").trim().slice(0, max);
}

function int(fd: FormData, key: string, min: number, max: number): number | null {
  const n = Number.parseInt(String(fd.get(key) ?? ""), 10);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}

export async function createTripAction(fd: FormData) {
  const name = text(fd, "name", 80);
  const month = int(fd, "month", 1, 12);
  const nights = int(fd, "nights", 1, 21);
  if (!name || month === null || nights === null) {
    redirect("/?error=Please+fill+in+every+field");
  }
  const { code, organizerToken } = await createTrip({ name, month, nights });
  (await cookies()).set(`o_${code}`, organizerToken, cookieOpts);
  await logEvent("trip_created", code);
  redirect(`/t/${code}`);
}

export async function joinTripAction(code: string, fd: FormData) {
  const trip = await getTrip(code);
  if (!trip) redirect("/?error=Trip+not+found");

  if (trip.decided_city) redirect(`/t/${trip.code}`);

  const name = text(fd, "name", 40);
  const homeSlug = text(fd, "home", 40);
  const budget = int(fd, "budget", 50, 20000);
  const vibes = fd
    .getAll("vibes")
    .map(String)
    .filter((k) => VIBES.some((v) => v.key === k));

  if (!name || !resolvePlace(homeSlug) || budget === null) {
    redirect(`/t/${trip.code}?error=Please+fill+in+your+name,+pick+your+home+airport+from+the+list+and+enter+a+budget`);
  }

  const member = await addMember({ tripId: trip.id, name, homeSlug, budget, vibes });
  (await cookies()).set(`m_${trip.code}`, member.token, cookieOpts);
  await logEvent("member_joined", trip.code);
  revalidatePath(`/t/${trip.code}`);
  redirect(`/t/${trip.code}`);
}

export async function voteAction(code: string, citySlug: string) {
  const trip = await getTrip(code);
  if (!trip || !CITY_BY_SLUG[citySlug]) return;
  const token = (await cookies()).get(`m_${trip.code}`)?.value;
  if (!token) return;
  const member = await getMemberByToken(trip.id, token);
  if (!member) return;
  if (trip.decided_city) return;
  const ok = await toggleVote({ tripId: trip.id, memberId: member.id, citySlug });
  revalidatePath(`/t/${trip.code}`);
  if (!ok) redirect(`/t/${trip.code}?error=You+can+approve+up+to+3+destinations`);
}

async function isOrganizer(code: string, organizerToken: string): Promise<boolean> {
  return (await cookies()).get(`o_${code}`)?.value === organizerToken;
}

/** Organizer locks in the group's destination. */
export async function decideAction(code: string, citySlug: string) {
  const trip = await getTrip(code);
  if (!trip || !CITY_BY_SLUG[citySlug]) return;
  if (!(await isOrganizer(trip.code, trip.organizer_token))) return;
  await setDecision(trip.id, citySlug);
  await logEvent("decided", trip.code);
  revalidatePath(`/t/${trip.code}`);
}

/** Organizer reopens voting. */
export async function reopenAction(code: string) {
  const trip = await getTrip(code);
  if (!trip) return;
  if (!(await isOrganizer(trip.code, trip.organizer_token))) return;
  await setDecision(trip.id, null);
  await logEvent("reopened", trip.code);
  revalidatePath(`/t/${trip.code}`);
}
