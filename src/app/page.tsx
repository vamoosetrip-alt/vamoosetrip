import { createTripAction } from "./actions";
import { MONTHS } from "@/lib/cities";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const nextMonth = (new Date().getMonth() + 1) % 12; // zero-based index of next month

  return (
    <>
      <h1>Stop arguing in the group chat. Pick a place everyone will love.</h1>
      <p className="lead">
        Everyone privately shares their home airport, budget and vibe. We rank the destinations
        that work for the whole group, then you vote.
      </p>

      <form action={createTripAction} className="card stack">
        {error && <div className="error">{error}</div>}
        <label>
          Trip name
          <input name="name" placeholder="Summer escape with the crew" maxLength={80} required />
        </label>
        <div className="row">
          <label>
            When
            <select name="month" defaultValue={nextMonth + 1}>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
          </label>
          <label>
            Nights
            <input name="nights" type="number" min={1} max={21} defaultValue={4} required />
          </label>
        </div>
        <button type="submit">Create trip and get the invite link</button>
      </form>
    </>
  );
}
