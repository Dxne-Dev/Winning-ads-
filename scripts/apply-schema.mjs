import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);
const sql = readFileSync("supabase/schema.sql", "utf8");

// Execute each statement separately
const statements = sql
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

for (const stmt of statements) {
  const { error } = await supabase.rpc("exec_sql", { sql: stmt + ";" });
  if (error) {
    // If exec_sql RPC doesn't exist, try raw query
    console.log(`Trying direct: ${stmt.substring(0, 60)}...`);
    const { error: directError } = await supabase.from("_").select().raw(`select 1`);
    if (directError) {
      console.log(`Direct also failed: ${directError.message}`);
    }
  }
}

console.log("Schema applied ✗ - trying fallback via supabase/schema.sql");

// If the above fails, tell user to run in SQL editor
console.log("\n✅ Instructions: Paste supabase/schema.sql into Supabase SQL editor at");
console.log(`   ${supabaseUrl.replace(".supabase.co", ".supabase.co/project/default/sql/new")}`);
