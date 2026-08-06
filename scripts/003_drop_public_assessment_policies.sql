-- Drop the public read and write policies on the assessment tables.
--
-- DO NOT RUN THIS UNTIL BOTH ARE TRUE:
--   1. scripts/002 has been run (the submit_* functions exist)
--   2. The client change calling those functions is deployed and a real
--      assessment has been completed end to end, landing on /signup with an
--      assessment_id in the URL
--
-- Run it before that and the funnel breaks silently. The insert keeps
-- succeeding, but `INSERT ... RETURNING` needs a SELECT policy, so the id comes
-- back empty and the personalisation handoff to signup stops working with no
-- error anywhere.
--
-- After this runs, the browser holds no direct permission on these tables at
-- all. Everything goes through submit_*, which returns an id and nothing else.

-- Confirm the exact policy names first — these were read off the dashboard and
-- the pregnancy one was partly cut off in the screenshot:
--
--   select tablename, policyname, roles, cmd
--   from pg_policies
--   where tablename in ('postpartum_assessments','pregnancy_assessments','ttc_assessments');

drop policy if exists "Allow users to view assessments"           on public.postpartum_assessments;
drop policy if exists "Allow public assessment submissions"       on public.postpartum_assessments;

drop policy if exists "Allow users to view ttc assessments"       on public.ttc_assessments;
drop policy if exists "Allow public ttc submissions"              on public.ttc_assessments;

drop policy if exists "Allow users to view pregnancy assessments" on public.pregnancy_assessments;
drop policy if exists "Allow public pregnancy submissions"        on public.pregnancy_assessments;

-- RLS stays enabled with no policies, which denies everything by default. That
-- is the intent: no role reaches these tables directly except the service role,
-- which bypasses RLS, and the security definer functions.

-- Verify — this should return zero rows:
--
--   select tablename, policyname, roles, cmd
--   from pg_policies
--   where tablename in ('postpartum_assessments','pregnancy_assessments','ttc_assessments');
--
-- And this should still return true for all three:
--
--   select relname, relrowsecurity from pg_class
--   where relname in ('postpartum_assessments','pregnancy_assessments','ttc_assessments');
