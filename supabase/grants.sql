-- ─────────────────────────────────────────────────────────────
-- Table-level GRANTs for the Supabase API roles.
--
-- Required because "Automatically expose new tables" is disabled,
-- which means new tables do NOT automatically grant privileges to
-- the anon / authenticated / service_role roles.
--
-- Row-level security (already enabled on every table) is what
-- actually controls access. These GRANTs only allow the roles to
-- REACH the tables; RLS policies then gate which rows they can
-- read or write. service_role bypasses RLS entirely.
-- ─────────────────────────────────────────────────────────────

grant usage on schema public to anon, authenticated, service_role;

grant all on all tables    in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all routines  in schema public to anon, authenticated, service_role;

-- Ensure any tables created later also receive these grants automatically.
alter default privileges in schema public
  grant all on tables    to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on routines  to anon, authenticated, service_role;
