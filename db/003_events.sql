CREATE TABLE IF NOT EXISTS events (
  id bigserial PRIMARY KEY,
  trip_code text,
  type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS events_type_idx ON events(type);
CREATE INDEX IF NOT EXISTS events_trip_idx ON events(trip_code);
