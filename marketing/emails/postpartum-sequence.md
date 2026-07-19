# Postpartum Email Sequence — Charter Founder Launch

**How to install (Omnisend):**
You already have 3 postpartum workflows — low, medium, high. Keep them. In each workflow,
replace the single email with this 6-email chain and the delays shown.

- **Email 1 is different per tier** — use the matching version in each workflow.
- **Emails 2–6 are identical in all three workflows** — copy the same content into each.
- Every CTA button uses the link given for that email (UTM included, so clicks show up
  in Google Analytics per email). The link also passes her data so the signup page
  pre-fills, same as the site CTA.
- Merge tags used are the ones already working in your account:
  `[[contact.first_name|default: "Mama"]]` and `[[contact.custom_properties.score]]`.
- No header banner on these emails. One button per email. Sign-off as written.

**NEW — the "You told us" personalization block:**
The app now sends `concern_reflection` — a short AI-written sentence that genuinely responds
to what she typed in the "anything else we should know?" question. It's empty for leads who
left that field blank, so it must be wrapped in an Omnisend **IF/ELSE condition block**
(visual editor → drag a "Condition" block → "Custom property" → `concern_reflection` →
"is not empty"). Inside the IF branch, place this paragraph right after the greeting in
**Email 1 only** (all three tiers):

```
{{contact.custom_properties.concern_reflection}}
```

That's it — no extra wrapper text needed, the sentence is already written to stand alone.
Leads with no concern text skip straight to the score line below, exactly as today.

**CTA link template** (swap `EMAILCODE` per email as noted):

```
https://catalystmomofficial.com/signup?email=[[contact.email]]&score=[[contact.custom_properties.score]]&tier=[[contact.custom_properties.score_tier]]&stage=[[contact.custom_properties.weeks_postpartum]]&utm_source=omnisend&utm_medium=email&utm_campaign=postpartum-seq&utm_content=EMAILCODE
```

---

## EMAIL 1 — send ~1 minute after signup (replaces your current email)

`utm_content=e1`

### Version A — LOW workflow

**Subject:** [[contact.custom_properties.score]]/100. Here's the honest version.
**Preheader:** Not a verdict — a starting line. And your first 10-minute win is inside.

Hi [[contact.first_name|default: "Mama"]],

Your Postpartum Recovery Score came back at **[[contact.custom_properties.score]]/100** — so let's be honest about what that means, without sugar-coating it and without scaring you.

Your answers show the foundations — core connection, pelvic floor, fuel, rest — mostly aren't in place yet. And here's the part nobody tells you: those patterns don't fix themselves. The brace before you lift, the leak you plan your day around — the longer they run, the more automatic they become.

The flip side: **every single one is trainable.** Moms go from exactly where you are to strong on 15 minutes a day. Not because they tried harder — because they finally worked in the right order.

Here's your first win, tonight, free: lie on your back, knees bent, one hand on your ribs and one below your belly button. Breathe in through your nose and let your ribs expand sideways into your hand. Exhale slowly through pursed lips and feel the deep belly gently draw in — no crunching, no squeezing. Ten slow breaths. That's the first connection between your brain and your deep core — and it's step one of everything else.

Your full protocol — built from your score, in the right order — is waiting inside the Catalyst Mom App. I'll tell you more tomorrow, including the story of why we built this.

**[Start My Recovery →]**

— The husband-and-wife team behind Catalyst Mom

P.S. You already did the hardest part — you found out exactly where you stand. Most moms never do.

### Version B — MEDIUM workflow

**Subject:** [[contact.custom_properties.score]]/100 — you're closer than it feels
**Preheader:** Real foundations. Specific gaps. Here's the one to close first.

Hi [[contact.first_name|default: "Mama"]],

Your Postpartum Recovery Score is **[[contact.custom_properties.score]]/100** — and that number says something important: you've built real foundations. You're doing more right than you probably give yourself credit for.

But here's what a mid-range score quietly means: the gaps you're leaving open are the ones your body builds compensation patterns around — the breath-hold when you lift, the back taking over for the core. The longer they run, the more automatic they get. They don't announce themselves. They just settle in.

Every one of them is trainable. And at your score, this isn't a rebuild — it's a close-the-gaps job. Precision now beats repair later.

Quick win for tonight: next time you pick up your baby, exhale *as* you lift instead of holding your breath. That one swap starts retraining the exact pattern that keeps mid-range scores stuck.

Your full protocol — built from your score, targeting your specific gaps — is waiting inside the Catalyst Mom App. Tomorrow I'll tell you the story of why this exists.

**[Close My Gaps →]**

— The husband-and-wife team behind Catalyst Mom

P.S. You're not starting from zero. Moms at your score usually move faster than they expect — the foundations are already paid for.

### Version C — HIGH workflow

**Subject:** [[contact.custom_properties.score]]/100 — top 15%. Now protect it.
**Preheader:** Your risk isn't collapse. It's coasting.

Hi [[contact.first_name|default: "Mama"]],

Your Postpartum Recovery Score is **[[contact.custom_properties.score]]/100** — top 15% of the moms we assess. That's real work, and you should be proud of it.

So here's the honest message for someone at your level: your risk isn't collapse. It's coasting. The gap between "mostly recovered" and "stronger than before pregnancy" is precision work most moms never do — complete pelvic floor restoration before returning to impact, progressive strength in the right sequence, the last 15 points nobody chases.

That's exactly what the app's high-scorer track is for: not rehab — building. Your breakdown showed you the 2–3 areas with room left. Those are your next 6 weeks.

Your protocol is waiting inside the Catalyst Mom App. Tomorrow, the story of why we built it.

**[Finish What I Started →]**

— The husband-and-wife team behind Catalyst Mom

P.S. Strong foundations don't maintain themselves — they're built on. You did the hard part; the interesting part is next.

---

## EMAIL 2 — Day 1 (same in all three workflows)

`utm_content=e2`

**Subject:** Why Catalyst Mom exists (the real story)
**Preheader:** No village. No guide. So we built one.

Hi [[contact.first_name|default: "Mama"]],

Before we talk about protocols and scores, you should know who's behind this — and why.

We didn't build Catalyst Mom as fitness experts or tech founders. It started when we became parents with no village. Her parents weren't nearby. Neither were his. It was just the two of us — and neither of us understood how hard postpartum really is until we were living it every single day.

And underneath it was grief, too: watching what his own mother had gone through years before, the things she silently endured because nobody was there to help. That shaped everything.

We looked everywhere for something that would truly help — not another generic workout app, not a mommy blog with contradicting advice. It didn't exist. So we built it: the village that wasn't there. Real protocols, in the right order, with real humans who check on you.

That's also why the app launched with something we call the **Charter Founder Membership** — the first 100 moms get everything, including private 1:1 coaching, at a price that will never be offered again. Not as a marketing trick. Because the first 100 moms are the ones who build this village with us.

Tomorrow I'll show you exactly what's inside and what it costs. Today, just this: postpartum shouldn't be something women survive alone. You're not alone anymore.

**[See What's Inside →]**

— The husband-and-wife team behind Catalyst Mom

P.S. Every woman who takes this assessment — we see our own family in her. That's why nothing in this app is generic.

---

## EMAIL 3 — Day 2 (same in all three workflows)

`utm_content=e3`

**Subject:** Everything you get for $29 (this is not a normal price)
**Preheader:** $1,151 of it. Including a real human coach. Here's the math.

Hi [[contact.first_name|default: "Mama"]],

Yesterday I promised to show you exactly what's inside Catalyst Mom. Here's the full list, with what each piece costs on its own anywhere else:

- **2 private 1:1 Progression Syncs every month with your dedicated postpartum recovery coach** — a real human who knows your history — $400/mo
- Personalized recovery protocol, built from your [[contact.custom_properties.score]]/100 assessment — $297
- 24/7 AI recovery coach (2am questions get 2am answers) — $97/mo
- Diastasis-safe workout library — no crunches, no planks, nothing that makes a gap worse — $149
- Pelvic floor recovery track — $99
- High-protein postpartum meal frameworks (zero chef skills required) — $79
- Private community of moms at your exact stage — $30/mo

**Total value: $1,151. The regular price will be $129/month.**

**Charter Founding Members pay $29/month — locked in for life.**

Why? Because we're filling the first 100 seats with moms who help us build this — and private coaching for 100 women is the maximum our coaches can hold. When seat 100 fills, the 1:1 coaching moves permanently to the $129 tier. Founders keep it at $29 forever.

And the risk is ours, not yours: **do your 15-minute protocol for 30 days, and if your core doesn't feel measurably stronger, email us — full refund, and you keep the roadmap.**

**[Claim My Founding Seat — $29/mo →]**

— The husband-and-wife team behind Catalyst Mom

P.S. $29 is less than one physio visit — for a month of everything, including two private sessions with a human coach. That math only exists for the first 100.

---

## EMAIL 4 — Day 3 (same in all three workflows)

`utm_content=e4`

**Subject:** "I don't have time" (and the other two lies exhaustion tells)
**Preheader:** Whichever one is yours — here's the honest answer.

Hi [[contact.first_name|default: "Mama"]],

When moms finish the assessment, we ask what's really holding them back. The same three answers come up every time. Whichever one is yours — here's the truth about it:

**"I have no time — the baby takes everything."**
That's exactly why the entire protocol is 15 minutes. Less time than one feeding. No gym, no childcare, no setup — most moms do it on the floor next to the baby. If you have time to scroll tonight, you have time to heal.

**"I'm too exhausted to start anything."**
Then step one isn't a workout. Your protocol starts with the energy leaks — breath, rest, fuel — so the first thing you feel is *more* energy, not more demands. The movement comes after the energy does.

**"I've tried things before and nothing worked."**
Generic programs fail postpartum bodies because they aren't built from your starting point. Yours is built from your [[contact.custom_properties.score]]/100 — the exact gaps your assessment found — and your 1:1 coach adjusts it with you every two weeks. That's the difference between a program and a plan.

(And if it's pain or complications holding you back — that's precisely when you need the careful version, not the hard version. Your coach adapts everything around your situation.)

30 days. 15 minutes a day. Full refund if your core isn't measurably stronger. The excuse doesn't survive that math.

**[Start My 15 Minutes →]**

— The husband-and-wife team behind Catalyst Mom

---

## EMAIL 5 — Day 5 (same in all three workflows)

`utm_content=e5`

**Subject:** Your first 7 days inside (exactly what happens)
**Preheader:** No overwhelm. No guessing. Here's the actual week.

Hi [[contact.first_name|default: "Mama"]],

The #1 fear about joining anything postpartum: "it'll become another thing I fail at." So here's exactly what your first week looks like — no mystery:

**Day 1:** Your score syncs into the app. Your dashboard is already personalized — your protocol, your stage, your goal. First session: 10 minutes of deep-core breathing. That's it.

**Days 2–4:** 15 minutes a day, gentle core-connection work matched to your level. The unsafe movements are locked out — you literally cannot do the wrong exercise. Any question, any hour: the AI coach answers instantly.

**Within week 1:** You book your first private 1:1 Progression Sync — a real human coach who reads your assessment before the call, meets you where you are, and sets your plan for the next two weeks.

**Day 7:** Quick check-in. Most moms report the first shift here — not a transformation yet, but the feeling of *reconnection*. That's the signal the order is right.

That's the whole week. No 45-minute workouts, no meal-prep Sundays, no guilt.

And remember: 30 days, and if your core doesn't feel measurably stronger — full refund, keep the roadmap.

**[Start Day 1 →]**

— The husband-and-wife team behind Catalyst Mom

P.S. Your assessment data is already loaded. Day 1 takes 10 minutes. It could be tonight.

---

## EMAIL 6 — Day 7 (same in all three workflows)

`utm_content=e6`

**Subject:** When seat 100 fills, this price is gone
**Preheader:** Not fake urgency. Just the actual deal, one last time.

Hi [[contact.first_name|default: "Mama"]],

Last email about this — I promise. Just the facts, one last time:

**The Charter Founder Membership is 100 seats.** Not a marketing number — it's the honest limit of what our coaches can hold while giving every mom two private 1:1 sessions a month.

**Founders pay $29/month, locked for life.** App, protocols, community, AI coach — and the private 1:1 coaching.

**When seat 100 fills, the 1:1 coaching moves permanently to the $129/month tier.** The app will still be here. This deal won't be — and we won't bring it back, because we can't.

You took the assessment because something didn't feel right — the leaking, the gap, the exhaustion, the feeling that your body isn't yours yet. A week has passed since then. The patterns you wanted to fix are exactly where you left them. They'll still be there next month too — that's the problem.

15 minutes a day. A real coach in your corner. 30-day money-back guarantee, and you keep the roadmap either way. At $29, locked forever.

If not now — when?

**[Claim My Founding Seat →]**

— The husband-and-wife team behind Catalyst Mom

P.S. If you've read this far across six emails, some part of you already decided. The guarantee means the only thing you're risking is staying where you are.

---

## Setup checklist for the workflows

1. In each of the 3 postpartum workflows: Email 1 (tier version) at ~1 min → delay 1 day → Email 2 → delay 1 day → Email 3 → delay 1 day → Email 4 → delay 2 days → Email 5 → delay 2 days → Email 6.
2. Exit condition: if Omnisend can detect purchase/conversion (or a `converted` tag you set manually for now), add "exit workflow" on it so buyers stop getting sales emails.
3. Check re-entry settings — one contact showed the same automation delivered twice on consecutive days.
4. Every button uses the CTA link template at the top with the right `utm_content` code.
5. No banner images on these — plain, personal, like a letter from a real person (because it is).
