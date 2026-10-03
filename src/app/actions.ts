"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { CITY_BY_SLUG, VIBES } from "@/lib/cities";
import {
  addMember,
  createTrip,
  getMemberByToken,
  getTrip,
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
  redirect(`/t/${code}`);
}

export async function joinTripAction(code: string, fd: FormData) {
  const trip = await getTrip(code);
  if (!trip) redirect("/?error=Trip+not+found");

  const name = text(fd, "name", 40);
  const homeSlug = text(fd, "home", 40);
  const budget = int(fd, "budget", 50, 20000);
  const vibes = fd
    .getAll("vibes")
    .map(String)
    .filter((k) => VIBES.some((v) => v.key === k));

  if (!name || !CITY_BY_SLUG[homeSlug] || budget === null) {
    redirect(`/t/${trip.code}?error=Please+fill+in+your+name,+home+airport+and+budget`);
  }

  const member = await addMember({ tripId: trip.id, name, homeSlug, budget, vibes });
  (await cookies()).set(`m_${trip.code}`, member.token, cookieOpts);
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
  const ok = await toggleVote({ tripId: trip.id, memberId: member.id, citySlug });
  revalidatePath(`/t/${trip.code}`);
  if (!ok) redirect(`/t/${trip.code}?error=You+can+approve+up+to+3+destinations`);
}
