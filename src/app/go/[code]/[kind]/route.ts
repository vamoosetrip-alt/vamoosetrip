import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CITY_BY_SLUG } from "@/lib/cities";
import { getMemberByToken, getTrip, logEvent } from "@/lib/db";
import { flightsLink, hotelsLink, toursLink } from "@/lib/links";
import { resolvePlace } from "@/lib/places";

export const dynamic = "force-dynamic";

/** Counts the click, then sends the person on to the partner site. */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string; kind: string }> },
) {
  const { code, kind } = await params;
  const home = new URL("/", req.url);
  const trip = await getTrip(code);
  if (!trip || !trip.decided_city) return NextResponse.redirect(home);
  const city = CITY_BY_SLUG[trip.decided_city];
  if (!city) return NextResponse.redirect(home);

  let target: string | null = null;
  if (kind === "flights") {
    const token = (await cookies()).get(`m_${trip.code}`)?.value;
    const member = token ? await getMemberByToken(trip.id, token) : null;
    const from = member ? resolvePlace(member.home_slug) : undefined;
    if (from) target = flightsLink(from, city, trip.month, trip.nights);
  } else if (kind === "hotels") {
    target = hotelsLink(city);
  } else if (kind === "tours") {
    target = toursLink(city);
  }
  if (!target) return NextResponse.redirect(new URL(`/t/${trip.code}`, req.url));

  await logEvent(`click_${kind}`, trip.code);
  return NextResponse.redirect(target);
}
