# Assessment scoring — v2 specification

Status: agreed, not yet implemented. This document is the contract. Code that
disagrees with it is wrong, including code written before it.

**Phase 1 shipped separately (Aug 2026).** It removed the trust leak without
touching the model: the second scoring function is deleted, the breakdown is
derived from the same values that produce the total, the hero shows a
percentage instead of a fraction, and the breakdown carries no total line. The
free context points still exist internally, medical clearance still scores,
rest and stress still measure circumstance, four postpartum categories still
have no questions, and answers are still not persisted. Everything below is
still to do.

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

Each stage has as many behavioural categories as it genuinely has. Not ten.
Ten was arithmetic wanting symmetry, and inventing a category to satisfy it is
precisely how v1 ended up with "timeline always scores 10".

Every category is worth ten points. The stage total is however many categories
× 10, and the displayed score is that normalised to 100.

### Postpartum — 8 categories, max 80

**Four of these exist today. Four have no question and must be written.**

| Category | Asked today? |
|---|---|
| core-safe exercise / pelvic floor state | yes — `coreSafeExercises` |
| workout consistency | yes — `workoutRoutine` |
| nutrition | yes — `nutrition` |
| rest behaviour | yes — `rest` |
| pelvic floor training as its own habit | **no question** |
| protein intake | **no question** |
| hydration | **no question** |
| wellness tracking | **no question** |

The four missing fields (`pelvicFloor`, `proteinIntake`, `hydration`, `tracking`)
are declared on `QuizState` and read by `getDetailedBreakdown`, but nothing ever
asks for them. That is the other half of why v1's breakdown showed a column of
zeros: four categories were mismatched strings, and four were never collected at
all.

So this is not "wire the engine to the existing questions". Writing four new
questions is part of the work, and each one passes the reviewer checklist in
§11 like anything else. Until they exist, postpartum has four behavioural
categories and a max of 40 — do not ship eight categories where half are
permanently zero, which would be v1's failure with a nicer spec attached.

### Pregnancy — 10 categories, max 100

prenatal care attendance · pregnancy-safe movement · nutrition ·
supplementation · stress-management behaviour · rest behaviour ·
pelvic floor preparation · symptom-management behaviour ·
birth-prep practice · wellness tracking

### TTC — 10 categories, max 100

cycle tracking · ovulation awareness practice · fertility nutrition ·
supplementation · stress-management behaviour · rest behaviour ·
movement balance · alcohol · nicotine · wellness tracking

### Rejected: asking for or accepting support

Considered as a ninth postpartum category and deliberately left out. A woman
with no partner, no family nearby and no childcare cannot build a habit around
support she does not have access to. That makes it circumstance wearing the
costume of behaviour, and scoring it would penalise the most isolated mothers
hardest — the ones the product exists for. If it ever returns it must be phrased
as something genuinely within her control.

### The display contract that comes with normalising

Normalisation reintroduces arithmetic the user cannot see, which is exactly what
made v1 impossible to explain. It is only safe because the arithmetic is uniform
and disclosable: every category is worth the same, and the only step is scaling
at the end.

**The governing principle, which is broader than this bug:**

> Every number shown to her must be independently explainable from what is
> visible on the page.

If she points at any figure and asks where it came from, the answer must be on
the screen. No hidden weighting, no invisible multipliers, no bonus points, no
"behind the scenes". That principle also rules out anything an AI adjusts
silently — if a number moves, the reason must be visible.

**In practice, the hero and the breakdown speak different languages.**

The failure mode is two numbers that look like they should reconcile and don't.
Eight categories showing out of ten each, adding to 63, under a hero reading
`79/100` is the same defect as v1's ten fives under a 44 — she does not think
"normalisation", she thinks the calculator is broken, and the trust earned by
every personalised line above it is gone in a second.

So they stop competing:

> **You're in the Building Momentum Stage**
> 79% of your recovery foundations are currently in place

and further down:

> **Behaviour breakdown**
> 63 of 80 foundation points currently in place

One is a percentage. One is a subtotal. Nothing on the page invites her to
reconcile them, and both are true on their own terms.

**Keep the gauge; change what it is labelled.** Removing the number entirely
would throw away the emotional payoff of a ten-minute assessment — the animated
dial is the moment the work pays off. It just stops being `79/100`, a total that
invites addition, and becomes `79%`, a proportion that does not. The tier
carries the headline; the percentage sits beneath it.

One consequence to hold: this makes the **tier** the most prominent thing on the
page. The top tier, which has never once fired in v1, becomes the most visible
element in the product.

That does not mean the thresholds have to be *correct* before shipping — there is
no population to be correct about yet. It means they have to be **principled**:
every tier reachable, boundaries chosen for a stated reason, and the reason
written down. They are configuration, not engine:

```ts
export const TIER_THRESHOLDS = {
  postpartum: { early: 0, momentum: 45, thriving: 75 },
}
```

Moving 75 to 72 after a thousand assessments is a config edit. If it ever
requires touching the engine, the separation has failed.

**The invariants change with it.** `total === sum(categories)` becomes
`displayed === round(sum(categories) / maxPossible * 100)`, paired with
`maxPossible === categories.length * 10`. Without both, an unreachable maximum
returns the moment a category is added.

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

**Pregnancy symptoms.** "How bad is your nausea?" measures biology. A woman
with hyperemesis is not failing a habit.

> Before: How are you managing nausea?
> After: When nausea makes eating difficult, how often are you able to use
> strategies that help you stay nourished?

These rewrites ship with the engine, not after it. An engine that promises
"habits within her control" while scoring hours slept contradicts itself on the
first day.

---

## 5. Four systems, one set of answers

The assessment is no longer a quiz. It is four systems that happen to share an
input, and keeping them separate is what stops any one of them dragging the
others out of shape:

| System | Consumes | Produces |
|---|---|---|
| **Behaviour** | behavioural answers | the score and the breakdown |
| **Context** | timeline, clearance, goal | what the plan may contain |
| **Prescription** | both of the above | ordered module keys with reasons |
| **Coach context** | all of it | how the AI and the human coach open |

One answer can feed several of these. None of them may reach into another's
output and recompute it.

---

## 6. What the engine returns

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

## 7. How a prescription is generated

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

## 8. Invariants

Three tests. They exist because v1 drifted silently for months, and these three
lines make that specific failure impossible to ship again.

0. **Reproducibility.** The same answers plus the same `engine_version` produce
   an identical result — same score, same categories, same prescription, same
   order. Not approximately. Exactly.

   This is a purity constraint, not a nicety. The engine may read nothing except
   its inputs: no `Date.now()`, no randomness, no network, no clock-derived
   values. The trap is real — if weeks-postpartum were ever computed from a birth
   date rather than taken from her answer, the same stored assessment would
   generate a different plan next month, and "why was Pelvic Floor Reset my first
   module?" would become unanswerable.

1. `displayed === round(sum(categories) / maxPossible * 100)` — the breakdown
   can never disagree with the score
2. `maxPossible === categories.length * 10` — the top of the scale is always
   reachable
3. `tier` matches its threshold for every score in `0..100`
4. `0 <= displayed <= 100` for every possible combination of answers

Tests 2 and 4 are the pair that would have caught the unreachable maximum.

Answer values are typed and scored through `Record<AnswerValue, number>` maps,
so adding a quiz option without scoring it is a compile error rather than a
silent zero. That is the actual regression that produced v1's column of zeros.

---

## 9. Storage and lifecycle

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

## 10. Open before the first migration

These block implementation. They are not engineering questions.

1. **Current RLS on the three assessment tables.** These inserts run
   client-side with the anon key, before she has an account. Today the rows hold
   a name, an email and a number. The moment they hold her clearance status,
   pelvic floor symptoms and sleep, the table becomes a file of women's health
   data reachable with a key that ships in the browser bundle. Required policy:
   anon may INSERT, anon may SELECT nothing, reads only from the authenticated
   side and only her own row. Confirm what is there now before widening it.

3. **Old rows.** v1 scores stay as they are and are never recalculated — they
   were true when they were generated, and a mom who remembers 62 should not
   become 48. `engine_version` separates them.

---

## 11. The rule for adding any future question

Every question must serve at least one of three purposes, chosen deliberately
before it is written:

- **Measures** — it scores, so it must be behaviour within her control
- **Personalises** — it shapes the plan, the sequencing or the copy
- **Explains** — it gives a recommendation its reason

Reviewing a proposed question means filling this in:

| | Yes / No |
|---|---|
| Does it measure behaviour within her control? | |
| Does it personalise the plan? | |
| Does it explain a recommendation? | |

At least one box must be ticked. All three empty means the question does not get
added. A question may serve two. A question that serves none is asking a tired
woman for something nobody uses, and should be deleted. This rule is what stops
v2 drifting back into v1.

---

## 12. Order of work

1. This document ✅
2. Verify RLS
3. Persist raw answers — nothing user-visible changes
4. Shared config-driven engine + the three invariants
5. Wire postpartum
6. Reword rest and stress
7. Wire pregnancy and TTC
8. Prescription keys
