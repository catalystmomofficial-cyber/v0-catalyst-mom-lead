# Assessment scoring — v2 specification

Status: agreed, not yet implemented. This document is the contract. Code that
disagrees with it is wrong, including code written before it.

Why this exists outside the code: v1 drifted because the quiz was edited and
the scoring wasn't, and nothing recorded what the score was supposed to mean,
so nobody could tell the two apart. When a fourth stage gets added, this file
is what makes that safe.

---

## 1. What the score represents

> Your Wellness Score reflects how many of the daily habits that support your
> stage are currently in place.

That is the whole definition. Everything below follows from it.

What it is **not**:

- not a risk score
- not a severity or damage score
- not a diagnosis or anything adjacent to one
- not a measure of how far along she is
- not a measure of what she knows

It is coach language, not doctor language. It measures behaviour she controls,
today.

### The consequences of that definition

Three things that scored in v1 stop scoring:

**Timeline / trimester / months trying.** Being nine months postpartum is not
an achievement. It is metadata. v1 gave every woman a free 10 points for it,
which measured whether she existed.

**Medical clearance.** Two women: one is four weeks postpartum, her OB said
wait, and she is following that perfectly. The other is eight months
postpartum, was never cleared, and is doing nothing. v1 scored them
identically at zero. The first woman is doing exactly the right thing and lost
10 points for it. Clearance decides what her plan is allowed to contain. It
does not decide her number.

**Diastasis awareness.** Knowing you have a separation does not make your core
healthier. It makes the plan more accurate. Knowledge belongs to the
prescription, not the score.

All three still matter enormously. They move to `context`, where they shape the
plan, the copy, and the coach's starting point.

---

## 2. Context versus behaviour

| Input | Kind | In the score? | What it drives |
|---|---|---|---|
| Weeks postpartum / trimester / months trying | Context | No | Plan sequencing, copy |
| Medical clearance | Gate | No | What the plan may contain |
| Diastasis awareness | Knowledge | No | Which core track |
| Primary goal | Context | No | Ordering, copy |
| Biggest obstacle | Context | No | Copy, coach's opener |
| Free-text concern | Context | No | Reflection, coach's opener |
| Everything else | Behaviour | **Yes** | The score |

---

## 3. The categories

Ten categories, ten points each, total one hundred. The maximum must be
reachable — in v1 it was not, and the top tier never once fired for any user on
any of the three assessments.

### Postpartum

Today there are only **eight** clean behavioural categories:

pelvic floor training · core-safe exercise practice · nutrition ·
protein intake · hydration · rest behaviour · workout consistency ·
wellness tracking

Two are needed to reach ten. Candidates, to be chosen deliberately rather than
invented to fill slots: movement outside workouts (walking), and asking for or
accepting support. Until they exist, do not fake a hundred by weighting eight
categories at 12.5 — pick the questions.

### Pregnancy

prenatal care attendance · pregnancy-safe movement · nutrition ·
supplementation · stress-management behaviour · rest behaviour ·
pelvic floor preparation · symptom-management behaviour ·
birth-prep practice · wellness tracking

### TTC

cycle tracking · ovulation awareness practice · fertility nutrition ·
supplementation · stress-management behaviour · rest behaviour ·
movement balance · alcohol · nicotine · wellness tracking

TTC is the only stage that already has ten clean behavioural categories.

---

## 4. Questions that must be reworded

Some v1 questions measure circumstance and call it behaviour. Under the
definition above they are scoring her life, not her habits.

**Rest.** "How are you sleeping?" scores a woman zero for having a newborn who
wakes five times a night. She is not failing a habit, she is feeding a baby.

> Before: How are you sleeping?
> After: When you get a chance to rest, do you usually take it?

**Stress.** "How stressed are you?" is a circumstance. Trying to conceive for
two years is stressful and that is not a habit failure.

> Before: How would you describe your stress levels?
> After: When you're overwhelmed, do you have a way to decompress or ask for
> support?

**Pregnancy symptoms.** Nausea severity is not a behaviour. Either reword to
what she does about it, or move it to context.

These rewrites ship with the engine, not after it. An engine that promises
"habits within her control" while scoring hours slept contradicts itself on the
first day.

---

## 5. What the engine returns

One function, one source of truth. Everything downstream reads this object and
nothing recomputes any part of it.

```ts
{
  rawAnswers,          // exactly what she selected
  rawScore,            // 0-100
  engineVersion,       // 2
  categories,          // { pelvicFloor: 3, protein: 2, ... }
  context,             // { weeksPostpartum, clearance, goal, obstacle }
  prescription,        // ordered, see below
}
```

`tier` is **derived, never stored**. Thresholds will move once there is a real
distribution to look at; a stored tier would freeze a guess into history. Store
`rawScore` and `engineVersion` and the tier can be regenerated at any time.

Interim thresholds are set from the reachable maximum so that all three tiers
can actually fire, and retuned after the first 100–200 assessments.

---

## 6. How a prescription is generated

```ts
{
  key: "pelvic_floor_reset_w1",
  priority: 1,
  reason: { category: "pelvicFloor", score: 3, max: 10 }
}
```

Three rules:

**Keys, not content.** The engine emits intent. The app maps keys to whatever
delivers it today — video, PDF, a coach conversation, a challenge. The engine
never names a piece of content.

**The gate runs first.** Clearance and weeks postpartum decide what is eligible
before anything is ranked. This is where clearance earns its keep after leaving
the score.

**Order is gap × readiness, never gap alone.** A woman four weeks postpartum
scoring zero on workout consistency must not be handed strength rebuilding
because it is her largest gap. Her largest gap is the last thing she should
touch.

`reason` carries the evidence, not a label, so the recommendation is
explainable: *you told us pelvic floor work isn't part of your week yet, so
that's where we start.*

**No confidence score.** A deterministic rules table has rules, inputs and
outputs. It has no confidence. A number like `0.94` would be invented, and the
failure mode is the coach telling a woman it is 94% confident about her body.

---

## 7. Invariants

Three tests. They exist because v1 drifted silently for months, and these three
lines make that specific failure impossible to ship again.

1. `total === sum(categories)` — the breakdown can never disagree with the score
2. `tier` matches its threshold for every score in `0..100`
3. `0 <= total <= 100` for every possible combination of answers

Test 3 is the one that would have caught the unreachable maximum.

Answer values are typed and scored through `Record<AnswerValue, number>` maps,
so adding a quiz option without scoring it is a compile error rather than a
silent zero. That is the actual regression that produced v1's column of zeros.

---

## 8. Storage and lifecycle

The answers that produce the score are currently **not persisted on any of the
three assessments**. Postpartum stores name, email, goal, score, tier, concern.
TTC stores nine fields, none of which are the five that generate its score.
Pregnancy stores name, email, trimester, weeks — not even the score.

Without the answers there is no versioning (nothing to replay), no plan
generation, no Day 1 versus Week 8, and no honest way to say the AI coach knows
her answers.

Shape: promoted columns for what gets queried — `stage`, `raw_score`,
`engine_version`, `email`, `created_at`, `claimed_by_user_id` — and the answers
in a **nullable** JSONB column. Nullable so a deletion request can drop the
health answers while metadata and aggregates survive. A separate answers table
buys the same property at the cost of a join on every read; revisit if the
payload grows.

Lifecycle, made explicit rather than discovered later:

`anonymous` → `claimable` → `claimed` → `superseded`

She completes the assessment before an account exists, so the row starts
anonymous and is claimed on signup via `assessment_id`, or later by email if she
signs up from a different link. Retrofitting identity onto orphaned health rows
is unpleasant; build it now.

---

## 9. Open before the first migration

These block implementation. They are not engineering questions.

1. **Current RLS on the three assessment tables.** These inserts run
   client-side with the anon key, before she has an account. Today the rows hold
   a name, an email and a number. The moment they hold her clearance status,
   pelvic floor symptoms and sleep, the table becomes a file of women's health
   data reachable with a key that ships in the browser bundle. Required policy:
   anon may INSERT, anon may SELECT nothing, reads only from the authenticated
   side and only her own row. Confirm what is there now before widening it.

2. **The two extra postpartum categories.** Which behaviours, decided on merit.

3. **Old rows.** v1 scores stay as they are and are never recalculated — they
   were true when they were generated, and a mom who remembers 62 should not
   become 48. `engine_version` separates them.

---

## 10. Order of work

1. This document ✅
2. Verify RLS
3. Persist raw answers — nothing user-visible changes
4. Shared config-driven engine + the three invariants
5. Wire postpartum
6. Reword rest and stress
7. Wire pregnancy and TTC
8. Prescription keys
