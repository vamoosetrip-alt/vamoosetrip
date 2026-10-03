import { readFileSync } from "node:fs";
import { join } from "node:path";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = neon(url);
const schema = readFileSync(join(process.cwd(), "db", "schema.sql"), "utf8");

// Split on semicolons at statement ends; the schema has no semicolons inside strings.
const statements = schema
  .split(/;\s*(?:\n|$)/)
  .map((s) => s.trim())
  .filter(Boolean);

for (const stmt of statements) {
  await sql.query(stmt);
}
console.log(`Applied ${statements.length} statements.`);
