import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { CITIES, MONTHS, VIBES } from "@/lib/cities";
import {
  MAX_VOTES,
  getMemberByToken,
  getTrip,
  listMembers,
  listVotes,
} from "@/lib/db";
import { rankDestinations, type MemberPrefs } from "@/lib/matching";
import { decideAction, joinTripAction, reopenAction, voteAction } from "@/app/actions";
import { flightsLink, hotelsLink, toursLink } from "@/lib/links";
import CopyLink from "./CopyLink";

export const dynamic = "force-dynamic";

const eur = (n: number) => `€${n.toLocaleString("en-US")}`;
const homeOptions = [...CITIES].sort((a, b) => a.name.localeCompare(b.name));

export default async function TripPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { code } = await params;
  const { error } = await searchParams;

  const trip = await getTrip(code);
  if (!trip) notFound();

  const token = (await cookies()).get(`m_${trip.code}`)?.value;
  const [me, members, votes] = await Promise.all([
    token ? getMemberByToken(trip.id, token) : Promise.resolve(null),
    listMembers(trip.id),
    listVotes(trip.id),
  ]);

  const prefs: MemberPrefs[] = members.map((m) => ({
    name: m.name,
    homeSlug: m.home_slug,
    budget: m.budget,
    vibes: m.vibes,
  }));
  const allRanked = rankDestinations(prefs, { month: trip.month, nights: trip.nights });

  const tally = new Map<string, number>();
  votes.forEach((v) => tally.set(v.city_slug, (tally.get(v.city_slug) ?? 0) + 1));
  const myVotes = new Set(votes.filter((v) => v.member_id === me?.id).map((v) => v.city_slug));

  // Show the current top 6, plus any destination that already has votes. Otherwise a vote cast
  // earlier (when the group was smaller) could vanish from the list as the ranking shifts.
  const ranked = allRanked.filter((r, i) => i < 6 || (tally.get(r.city.slug) ?? 0) > 0);
  const leading = [...tally.entries()].sort((a, b) => b[1] - a[1])[0];
  const joinAction = joinTripAction.bind(null, trip.code);
  const isOrganizer = (await cookies()).get(`o_${trip.code}`)?.value === trip.organizer_token;
  const decided = trip.decided_city ? allRanked.find((r) => r.city.slug === trip.decided_city) : undefined;
  const myIndex = me ? members.findIndex((m) => m.id === me.id) : -1;
  const myResult = decided && myIndex >= 0 ? decided.members[myIndex] : undefined;
  const myHome = me ? CITIES.find((c) => c.slug === me.home_slug) : undefined;
  const approvals = decided ? (tally.get(decided.city.slug) ?? 0) : 0;

  return (
    <>
      <h1>{trip.name}</h1>
      <p className="lead">
        {MONTHS[trip.month - 1]}, {trip.nights} nights · {members.length}{" "}
        {members.length === 1 ? "person has" : "people have"} joined
      </p>

      {error && <div className="card error">{error}</div>}

      <div className="card invite">
        <span className="muted">Invite code</span>
        <code>{trip.code}</code>
        <CopyLink />
      </div>


      {decided && (
        <>
          <div className="card winner decided">
            <div className="muted">Your group is going to</div>
            <h2 style={{ margin: "4px 0 6px", fontSize: "1.8rem" }}>
              {decided.city.name}, {decided.city.country}
            </h2>
            <div>
              {MONTHS[trip.month - 1]} · {trip.nights} nights · {members.length}{" "}
              {members.length === 1 ? "traveler" : "travelers"}
            </div>
            <div className="muted" style={{ marginTop: 8 }}>
              About {eur(decided.avgCost)} each
              {decided.minCost !== decided.maxCost &&
                ` (${eur(decided.minCost)} to ${eur(decided.maxCost)})`}
              {approvals > 0 && ` · ${approvals} of ${members.length} approved it`}
            </div>
            <div className="who">
              {members.map((m) => (
                <span key={m.id} className="tag">{m.name}</span>
              ))}
            </div>
          </div>

          {me && myResult && myHome && (
            <>
              <h2>Your next steps</h2>
              <div className="card stack">
                <div>
                  <strong>Your estimate: about {eur(myResult.cost)}</strong>
                  <div className="muted">
                    Flight from {myHome.name} plus {trip.nights} nights. Check live prices before booking.
                  </div>
                </div>
                <div className="actions">
                  <a className="btn" href={flightsLink(myHome.name, decided.city, trip.month)} target="_blank" rel="noopener noreferrer sponsored">
                    Find flights
                  </a>
                  <a className="btn ghost-link" href={hotelsLink(decided.city)} target="_blank" rel="noopener noreferrer sponsored">
                    Find hotels
                  </a>
                  <a className="btn ghost-link" href={toursLink(decided.city)} target="_blank" rel="noopener noreferrer sponsored">
                    Tours and activities
                  </a>
                </div>
              </div>
            </>
          )}

          {!me && (
            <p className="muted">Voting is closed for this trip. Ask the organizer to reopen it if you want to join.</p>
          )}

          {isOrganizer && (
            <form action={reopenAction.bind(null, trip.code)}>
              <button type="submit" className="ghost">Reopen voting</button>
            </form>
          )}
        </>
      )}

      {!me && !decided && (
        <form action={joinAction} className="card stack">
          <strong>Join this trip. Your answers stay private; only the group result is shown.</strong>
          <label>
            Your name
            <input name="name" maxLength={40} required />
          </label>
          <div className="row">
            <label>
              Home airport city
              <select name="home" required defaultValue="">
                <option value="" disabled>Choose a city</option>
                {homeOptions.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}, {c.country}</option>
                ))}
              </select>
            </label>
            <label>
              Budget per person (EUR)
              <small>Flights and stay together</small>
              <input name="budget" type="number" min={50} step={50} defaultValue={700} required />
            </label>
          </div>
          <div>
            <div className="muted" style={{ marginBottom: 8 }}>What are you after? Pick any.</div>
            <div className="chips">
              {VIBES.map((v) => (
                <label key={v.key} className="chip">
                  <input type="checkbox" name="vibes" value={v.key} />
                  {v.label}
                </label>
              ))}
            </div>
          </div>
          <button type="submit">Join and see destinations</button>
        </form>
      )}

      {me && !decided && (
        <>
          <h2>Who is in</h2>
          <div className="who">
            {members.map((m) => (
              <span key={m.id} className="tag">{m.name}{m.id === me.id ? " (you)" : ""}</span>
            ))}
          </div>

          <h2>Best destinations for the whole group</h2>
          {members.length < 2 && (
            <p className="muted">
              These are based on your answers only. Share the invite link so the ranking
              reflects everyone.
            </p>
          )}
          <p className="muted">
            You can approve up to {MAX_VOTES} destinations ({myVotes.size} used).
            {leading && ` Leading so far: ${CITIES.find((c) => c.slug === leading[0])?.name}.`}
          </p>

          {ranked.map((r, i) => {
            const count = tally.get(r.city.slug) ?? 0;
            const voteAction_ = voteAction.bind(null, trip.code, r.city.slug);
            const mine = myVotes.has(r.city.slug);
            return (
              <div key={r.city.slug} className={`card dest ${i === 0 ? "winner" : ""}`}>
                <div className="score">
                  {r.score}
                  <small>match</small>
                </div>
                <div>
                  <h3>{r.city.name}, {r.city.country}</h3>
                  <div className="muted">
                    About {eur(r.avgCost)} each
                    {r.minCost !== r.maxCost && ` (${eur(r.minCost)} to ${eur(r.maxCost)})`}
                    {r.highlights.length > 0 && ` · ${r.highlights.join(", ")}`}
                  </div>
                  <div className="who">
                    <span className={`tag ${r.seasonFit === "great" ? "good" : r.seasonFit === "off" ? "warn" : ""}`}>
                      {r.seasonFit === "great" ? "Great time to go" : r.seasonFit === "ok" ? "Shoulder season" : "Off season"}
                    </span>
                    {r.members.filter((m) => m.overBudget).map((m) => (
                      <span key={m.name} className="tag warn">Over budget for someone</span>
                    )).slice(0, 1)}
                  </div>
                </div>
                <div className="vote-col">
                  <form action={voteAction_}>
                    <button type="submit" className={`ghost ${mine ? "on" : ""}`}>
                      {mine ? "Approved" : "Approve"} · {count}
                    </button>
                  </form>
                  {isOrganizer && (
                    <form action={decideAction.bind(null, trip.code, r.city.slug)}>
                      <button type="submit">Choose this</button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}
    </>
  );
}
