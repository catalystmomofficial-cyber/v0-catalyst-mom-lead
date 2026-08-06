-- Close the public read on the assessment tables.
--
-- Current state, confirmed 2026-08-06 against supabase-amber-jacket:
--
--   RLS is enabled on all three tables (relrowsecurity = true), and each has
--   a policy granting SELECT to `public` with qual = true. `public` includes
--   `anon`, and the anon key ships inside the browser bundle on
--   catalystmomofficial.com. So anyone who opens devtools can read every row
--   of every assessment: name, email, score, tier, and user_concern — the
--   free-text box where women write about tearing, their bodies, and how they
--   are coping.
--
-- The unauthenticated GET routes that leaked the same data without needing the
-- key at all were removed in 35e87f9. This closes the second door.
--
-- ORDER MATTERS. Run this file, deploy the client change that calls the
-- functions, and only then run 003 to drop the policies. Dropping the SELECT
-- policy first breaks the funnel silently: `INSERT ... RETURNING` needs a
-- SELECT policy, so `.insert().select()` would come back empty, assessment_id
-- would never be set, and the personalisation handoff to signup would stop
-- working while the insert itself kept succeeding.

-- ── Postpartum ───────────────────────────────────────────────────────────────

create or replace function public.submit_postpartum_assessment(
  p_user_name    text,
  p_email        text,
  p_primary_goal text,
  p_score        int,
  p_tier         text,
  p_user_concern text default null
)
returns uuid
language plpgsql
security definer
-- Pinned so the function cannot be hijacked by a search_path the caller
-- controls. Required on every security definer function.
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
begin
  insert into public.postpartum_assessments (
    user_name, email, primary_goal, score, tier, user_concern
  ) values (
    left(trim(p_user_name), 120),
    left(trim(p_email), 320),
    p_primary_goal,
    -- The score is display data, not a permission. Bounded anyway so a crafted
    -- call cannot write nonsense into the analytics.
    greatest(0, least(1000, coalesce(p_score, 0))),
    p_tier,
    left(p_user_concern, 2000)
  )
  returning id into v_id;

  -- Only the id goes back. The caller never gets to read a row.
  return v_id;
end;
$$;

-- ── Pregnancy ────────────────────────────────────────────────────────────────

create or replace function public.submit_pregnancy_assessment(
  p_name           text,
  p_email          text,
  p_trimester      text default null,
  p_weeks_pregnant text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
begin
  insert into public.pregnancy_assessments (name, email, trimester, weeks_pregnant)
  values (
    left(trim(p_name), 120),
    left(trim(p_email), 320),
    p_trimester,
    p_weeks_pregnant
  )
  returning id into v_id;

  return v_id;
end;
$$;

-- ── TTC ──────────────────────────────────────────────────────────────────────

create or replace function public.submit_ttc_assessment(
  p_name                 text,
  p_email                text,
  p_ttc_duration         text default null,
  p_workout_routine      text default null,
  p_tracking             text default null,
  p_primary_goal         text default null,
  p_biggest_obstacle     text default null,
  p_support_type         text default null,
  p_dietary_restrictions text default null,
  p_additional_notes     text default null,
  p_score                int  default null
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
begin
  insert into public.ttc_assessments (
    name, email, ttc_duration, workout_routine, tracking, primary_goal,
    biggest_obstacle, support_type, dietary_restrictions, additional_notes, score
  ) values (
    left(trim(p_name), 120),
    left(trim(p_email), 320),
    p_ttc_duration,
    p_workout_routine,
    p_tracking,
    p_primary_goal,
    p_biggest_obstacle,
    p_support_type,
    p_dietary_restrictions,
    left(p_additional_notes, 2000),
    greatest(0, least(1000, coalesce(p_score, 0)))
  )
  returning id into v_id;

  return v_id;
end;
$$;

-- ── Grants ───────────────────────────────────────────────────────────────────
--
-- The browser gets exactly one capability per table: submit an assessment and
-- learn its id. It cannot select, cannot update, cannot enumerate.

revoke all on function public.submit_postpartum_assessment(text, text, text, int, text, text) from public;
revoke all on function public.submit_pregnancy_assessment(text, text, text, text) from public;
revoke all on function public.submit_ttc_assessment(text, text, text, text, text, text, text, text, text, text, int) from public;

grant execute on function public.submit_postpartum_assessment(text, text, text, int, text, text) to anon, authenticated;
grant execute on function public.submit_pregnancy_assessment(text, text, text, text) to anon, authenticated;
grant execute on function public.submit_ttc_assessment(text, text, text, text, text, text, text, text, text, text, int) to anon, authenticated;
