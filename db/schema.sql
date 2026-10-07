CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  month int NOT NULL CHECK (month BETWEEN 1 AND 12),
  nights int NOT NULL CHECK (nights BETWEEN 1 AND 21),
  organizer_token text NOT NULL,
  decided_city text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  name text NOT NULL,
  home_slug text NOT NULL,
  budget int NOT NULL CHECK (budget > 0),
  vibes text[] NOT NULL DEFAULT '{}',
  token text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS members_trip_idx ON members(trip_id);

CREATE TABLE IF NOT EXISTS votes (
  member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  city_slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (member_id, city_slug)
);
CREATE INDEX IF NOT EXISTS votes_trip_idx ON votes(trip_id);

-- Added after launch; safe to run on an existing database.
ALTER TABLE trips ADD COLUMN IF NOT EXISTS decided_city text;
CREATE TABLE IF NOT EXISTS events (
  id bigserial PRIMARY KEY,
  trip_code text,
  type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS events_type_idx ON events(type);
CREATE INDEX IF NOT EXISTS events_trip_idx ON events(trip_code);
