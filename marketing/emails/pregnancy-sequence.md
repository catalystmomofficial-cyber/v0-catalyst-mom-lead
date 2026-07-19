# Pregnancy Email Sequence — Charter Founder Launch

**Install exactly like the postpartum file:** your 3 pregnancy workflows (low/medium/high)
each get this 6-email chain. Email 1 differs per tier; Emails 2–6 are identical in all three.
Delays: E1 at ~1 min → 1 day → E2 → 1 day → E3 → 1 day → E4 → 2 days → E5 → 2 days → E6.
One button per email, no banner images.

**Frame rule for pregnancy (important):** everything stays on the empowerment side —
"prep window," "momentum," "finish strong." NEVER "cost of waiting" or anything that could
read as risk to the baby.

**NEW — the "You told us" personalization block:**
The app now sends `concern_reflection` — a short AI-written sentence that genuinely responds
to what she typed in the "anything else we should know?" question. It's empty for leads who
left that field blank, so wrap it in an Omnisend **IF/ELSE condition block** (visual editor →
"Condition" → Custom property → `concern_reflection` → "is not empty"). Inside the IF branch,
place this right after the greeting in **Email 1 only** (all three tiers):

```
{{contact.custom_properties.concern_reflection}}
```

No extra wrapper text needed — the sentence already stands alone. Leads with no concern
text skip straight to the score line, exactly as today.

**CTA link template** (swap `EMAILCODE`):

```
https://catalystmomofficial.com/signup?email=[[contact.email]]&score=[[contact.custom_properties.score]]&tier=[[contact.custom_properties.score_tier]]&stage=[[contact.custom_properties.trimester]]&utm_source=omnisend&utm_medium=email&utm_campaign=pregnancy-seq&utm_content=EMAILCODE
```

(If your pregnancy contacts store trimester under a different property name, swap it in.)

---

## EMAIL 1 — ~1 minute after signup (replaces current email) — `e1`

### Version A — LOW workflow

**Subject:** [[contact.custom_properties.score]]/100 — your starting line, not a verdict
**Preheader:** You're in your prep window. Here's your first 5-minute win.

Hi [[contact.first_name|default: "Mama"]],

Your Pregnancy Wellness Score is **[[contact.custom_properties.score]]/100** — and before anything else, hear this: that's a starting line, not a verdict. Most women begin exactly here — juggling symptoms, unsure what's safe, drowning in conflicting advice.

Here's what actually matters: **you're in your prep window right now.** Everything you build in it — strength, breath, positioning, fuel — is momentum your body carries straight into an easier birth and a faster recovery. This is the highest-leverage time you will ever have, and it's not too late to use it. It moves fast, too: most women feel a real difference within 1–2 weeks of the right protocols.

Your first win, tonight, free: sit comfortably, one hand on your belly. Breathe in through your nose for 4 counts, letting your belly and ribs expand. Exhale slowly through your mouth for 6 counts. Ten rounds. That's the exact breath pattern that helps in labor — and starting it now means it'll be automatic when you need it.

Your full protocol — trimester-matched, built from your score — is waiting inside the Catalyst Mom App. Tomorrow I'll tell you why we built it.

**[Start My Prep Window →]**

— The husband-and-wife team behind Catalyst Mom

P.S. You just did something most pregnant women never do — found out exactly where you stand. That's the hard part.

### Version B — MEDIUM workflow

**Subject:** [[contact.custom_properties.score]]/100 — real momentum. Let's finish the job.
**Preheader:** Solid foundations, 3–5 gaps — and they're exactly what your prep window is for.

Hi [[contact.first_name|default: "Mama"]],

Your Pregnancy Wellness Score is **[[contact.custom_properties.score]]/100** — you're building real momentum. You're doing several things right, and it shows.

What a mid-range score means: there are 3–5 specific gaps between how you feel now and how you *could* feel — day to day, in labor, and in recovery. And they're exactly what your prep window exists to close. Fatigue, discomfort, uncertainty about what's safe — every one has a protocol, and every week of prep compounds into an easier birth and a faster bounce-back.

Quick win for tonight: swap one scroll session for the 4-in / 6-out breath (ten rounds, hand on belly). It's the labor breath — build it now, own it later.

Your full plan — trimester-matched, built from your exact gaps — is inside the Catalyst Mom App. Tomorrow, the story of why this exists.

**[Close My Gaps →]**

— The husband-and-wife team behind Catalyst Mom

P.S. Women at your score usually move fastest — foundations are paid for, the wins are close together.

### Version C — HIGH workflow

**Subject:** [[contact.custom_properties.score]]/100 — top 15%. Now make it complete.
**Preheader:** The last pieces: birth prep + the postpartum bridge.

Hi [[contact.first_name|default: "Mama"]],

Your Pregnancy Wellness Score is **[[contact.custom_properties.score]]/100** — top 15% of the pregnant women we assess. That reflects real intentionality, and you should own it.

At your level there are two pieces most prepared women still miss:

**1. Birth-specific preparation.** Being fit and being *birth-ready* are different skills — pelvic floor release (not just strength), positioning, breath and pushing technique, birth ball work. This is the precision layer.

**2. The postpartum bridge.** The transition from pregnancy to postpartum is where even the most prepared women lose momentum. Building your recovery plan *before* baby arrives means you hit the ground with a plan instead of starting from zero at 3am.

Both are built into your protocol inside the Catalyst Mom App. Tomorrow I'll tell you why we built it.

**[Finish Strong →]**

— The husband-and-wife team behind Catalyst Mom

P.S. You've done the preparation. The last weeks are for locking it in — so nothing is left to chance.

---

## EMAIL 2 — Day 1 (identical in all three workflows) — `e2`

**Subject:** Why Catalyst Mom exists (the real story)
**Preheader:** No village. No guide. So we built one.

Hi [[contact.first_name|default: "Mama"]],

Before we talk about protocols and scores, you should know who's behind this — and why.

We didn't build Catalyst Mom as fitness experts or tech founders. It started when we became parents with no village. Her parents weren't nearby. Neither were his. It was just the two of us — and neither of us understood how hard the journey into motherhood really is until we were living it every single day.

And underneath it was grief, too: watching what his own mother had gone through years before, the things she silently endured because nobody was there to help. That shaped everything.

We looked everywhere for something that would truly help — not another generic workout app, not a mommy blog with contradicting advice. It didn't exist. So we built it: the village that wasn't there. Real protocols, in the right order, with real humans who check on you.

That's also why the app launched with something we call the **Charter Founder Membership** — the first 100 moms get everything, including private 1:1 coaching, at a price that will never be offered again. Not as a marketing trick. Because the first 100 moms are the ones who build this village with us.

Tomorrow I'll show you exactly what's inside and what it costs. Today, just this: no stage of motherhood should be something women navigate alone. You're not alone anymore.

**[See What's Inside →]**

— The husband-and-wife team behind Catalyst Mom

---

## EMAIL 3 — Day 2 (identical in all three workflows) — `e3`

**Subject:** Everything you get for $29 (this is not a normal price)
**Preheader:** $1,151 of it. Including a real human coach. Here's the math.

Hi [[contact.first_name|default: "Mama"]],

Yesterday I promised to show you what's inside Catalyst Mom. Here's the full list, with what each piece costs on its own anywhere else:

- **2 private 1:1 Progression Syncs every month with your dedicated pregnancy & birth-prep coach** — a real human who knows your history — $400/mo
- Personalized birth-prep & wellness protocol, built from your [[contact.custom_properties.score]]/100 assessment — $297
- 24/7 AI pregnancy coach (2am questions get 2am answers) — $97/mo
- Trimester-safe workout & mobility library — $149
- Birth-prep breathing & positioning protocols, for an easier labor — $99
- Pregnancy nutrition frameworks by trimester — $79
- Private community of mamas at your exact stage — $30/mo

**Total value: $1,151. The regular price will be $129/month.**

**Charter Founding Members pay $29/month — locked in for life.**

Why? We're filling the first 100 seats with moms who help us build this — and private coaching for 100 women is the honest maximum our coaches can hold. When seat 100 fills, the 1:1 coaching moves permanently to the $129 tier. Founders keep it at $29 forever.

And the risk is ours: **follow your protocol for 30 days, and if you don't feel more prepared, more comfortable, and more in control of your pregnancy — email us, full refund, and you keep the roadmap.**

**[Claim My Founding Seat — $29/mo →]**

— The husband-and-wife team behind Catalyst Mom

P.S. $29 is less than one prenatal massage — for a month of everything, including two private sessions with a human coach. That math only exists for the first 100.

---

## EMAIL 4 — Day 3 (identical in all three workflows) — `e4`

**Subject:** "I don't know what's safe" (and the other worries that keep mamas stuck)
**Preheader:** Whichever one is yours — here's the honest answer.

Hi [[contact.first_name|default: "Mama"]],

When mamas finish the assessment, we ask what's really holding them back. The same answers come up every time. Whichever is yours — here's the truth about it:

**"I don't know what's safe during pregnancy."**
That caution is exactly right — and it's exactly what the app removes. Every workout is trimester-matched, and anything unsuitable for your stage is locked out automatically. You never have to guess again.

**"I'm too tired or nauseous to do much."**
Then your plan starts where you are, not where a fitness program thinks you should be. Gentle, short, energy-first sessions that work around nausea and fatigue — and adapt week by week as your body changes.

**"The anxiety and the conflicting advice online."**
The antidote to pregnancy anxiety is a clear plan and someone in your corner. One protocol built from your assessment — not a hundred arguing sources — plus a 1:1 coach for every "is this normal?" moment. Worry gets replaced with readiness.

(No support system? That ends the day you join — a dedicated coach, a daily plan, and a community of mamas at your exact week.)

30 days. Gentle sessions. Full refund if you don't feel more prepared and more in control.

**[Start My Plan →]**

— The husband-and-wife team behind Catalyst Mom

---

## EMAIL 5 — Day 5 (identical in all three workflows) — `e5`

**Subject:** Your first 7 days inside (exactly what happens)
**Preheader:** No overwhelm. No guessing. Here's the actual week.

Hi [[contact.first_name|default: "Mama"]],

The #1 fear about joining anything while pregnant: "it'll be too much on top of everything." So here's exactly what your first week looks like:

**Day 1:** Your score syncs into the app. Your dashboard is already personalized — your trimester, your goals, your plan. First session: 10 minutes of breathwork. That's it.

**Days 2–4:** Short, trimester-matched sessions — movement, mobility, positioning. Anything unsafe for your stage is locked out; you literally cannot do the wrong exercise. Any question, any hour: the AI coach answers instantly.

**Within week 1:** You book your first private 1:1 Progression Sync — a real coach who reads your assessment before the call and builds your plan for the next two weeks around your body, your symptoms, your birth goals.

**Day 7:** Quick check-in. Most mamas report feeling noticeably more in control here — of their body, their symptoms, and their plan for birth.

No 45-minute workouts. No guilt. Just the prep window, used well.

And remember: 30 days, and if you don't feel more prepared and more comfortable — full refund, keep the roadmap.

**[Start Day 1 →]**

— The husband-and-wife team behind Catalyst Mom

---

## EMAIL 6 — Day 7 (identical in all three workflows) — `e6`

**Subject:** When seat 100 fills, this price is gone
**Preheader:** Not fake urgency. Just the actual deal, one last time.

Hi [[contact.first_name|default: "Mama"]],

Last email about this — I promise. Just the facts:

**The Charter Founder Membership is 100 seats.** That's the honest limit of what our coaches can hold while giving every mama two private 1:1 sessions a month.

**Founders pay $29/month, locked for life** — app, protocols, community, AI coach, and the private 1:1 coaching.

**When seat 100 fills, the 1:1 coaching moves permanently to the $129/month tier.** The app will still be here. This deal won't be — we can't bring it back, because coach time doesn't scale.

Here's the thing about pregnancy: your prep window is finite in the best way. Every week inside it is a week of momentum your body carries into birth and recovery. You took the assessment because you want to use this time well — and a week of it has passed since then.

Gentle daily sessions. A real coach in your corner. 30-day money-back guarantee. $29, locked forever.

**[Claim My Founding Seat →]**

— The husband-and-wife team behind Catalyst Mom

P.S. If you've read all six of these, some part of you already decided. The guarantee means the only risk is letting the prep window pass unused.
