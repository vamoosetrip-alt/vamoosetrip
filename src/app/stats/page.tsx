import { notFound } from "next/navigation";
import { CITY_BY_SLUG } from "@/lib/cities";
import { getStats } from "@/lib/db";

export const dynamic = "force-dynamic";

const pct = (a: number, b: number) => (b > 0 ? `${Math.round((a / b) * 100)}%` : "-");

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  const expected = process.env.STATS_KEY;
  if (!expected || key !== expected) notFound();

  const { totals: t, clicks, trips } = await getStats();
  const clickTotal = clicks.reduce((n, c) => n + c.n, 0);

  return (
    <>
      <h1>Usage</h1>
      <p className="lead">Anonymous counts only. Nothing here identifies a person.</p>

      <h2>The funnel</h2>
      <div className="card stack">
        <div><strong>{t.trips}</strong> trips created</div>
        <div><strong>{t.trips_two_plus}</strong> had 2 or more people join ({pct(t.trips_two_plus, t.trips)})</div>
        <div><strong>{t.trips_with_votes}</strong> got at least one vote ({pct(t.trips_with_votes, t.trips)})</div>
        <div><strong>{t.trips_decided}</strong> reached a decision ({pct(t.trips_decided, t.trips)})</div>
        <div><strong>{clickTotal}</strong> clicks on next-step buttons</div>
        <div className="muted">{t.members} people have joined in total.</div>
      </div>

      <h2>Which buttons get clicked</h2>
      <div className="card">
        {clicks.length === 0 ? (
          <span className="muted">No clicks yet.</span>
        ) : (
          clicks.map((c) => (
            <div key={c.type}>{c.type.replace("click_", "")}: <strong>{c.n}</strong></div>
          ))
        )}
      </div>

      <h2>Latest trips</h2>
      {trips.map((tr) => (
        <div key={tr.code} className="card">
          <strong>{tr.name}</strong> <span className="muted">({tr.code})</span>
          <div className="muted">
            {tr.members} joined · {tr.voters} voted ·{" "}
            {tr.decided_city ? `decided: ${CITY_BY_SLUG[tr.decided_city]?.name ?? tr.decided_city}` : "not decided"} ·{" "}
            {tr.clicks} clicks · {new Date(tr.created_at).toISOString().slice(0, 10)}
          </div>
        </div>
      ))}
    </>
  );
}
