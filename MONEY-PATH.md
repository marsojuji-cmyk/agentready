# agentready — the money path

**Honest label up front:** this tool is *not* revenue. It is a **wedge**. It generates a
verified, undeniable, competitor-anchored fact about a specific business, and a fact is what
cold outreach is missing. Revenue arrives when a human answers an email — days, not minutes.

What the artifact already is (VERIFIED, 2026-10-04):
- working scanner + batch leaderboard, exercised on 20 real Calgary home-services sites
- real spread: 4/100 to 49/100, mean 22.7, **0 of 20 graded C or better**
- every number reproducible by running the same command

What it is not (UNKNOWN): whether any Calgary SMB will pay. That is the experiment.

---

## The offer ladder

| Tier | What | Price | Delivery cost |
|---|---|---|---|
| **0** | Free scored report for their own site (`scan.mjs <them>` → HTML) | $0 | 0 min (automated) |
| **1** | "AI Visibility Report" — 3 pages: their score, what assistants currently *can't* see, the exact files to publish | **$299** | ~25 min |
| **2** | Tier 1 + implementation (llms.txt, robots AI rules, schema.org, sitemap) | **$799** | ~2 h |
| **3** | Monthly monitoring — re-scan, alert when the score moves or a competitor passes them | **$49/mo** | ~0 min (cron) |

Tier 3 is where this stops being a job and becomes an asset: the same scanner on a schedule is
recurring revenue at zero marginal cost.

---

## Funnel math (assumptions stated, not hidden)

Cold email with a **specific, verifiable, competitor-anchored** claim. This is not generic
outreach; every message contains a true number about *their* site they have never seen.

| Stage | Rate | Basis |
|---|---|---|
| Sent | 200 | Calgary home services + dentists + lawyers + gyms + realtors |
| Delivered | 92% | 184 |
| Open | 35–45% | specific subject line with their own domain + score (ESTIMATE) |
| Reply | 6–12% | 11–22 replies (ESTIMATE) |
| Discovery call | 25–40% of replies | 3–8 calls |
| Paid Tier 1 ($299) | 25–40% of calls | **0.75–3.2 sales** |

**Expected revenue per 200 sends: $224–$960.** Implementation upsell at 30% of Tier 1 buyers
adds ~$150–$750. Call it **$375–$1,700 per 200 emails**, at ~3–4 hours of Marc's time
(one send run + calls).

EV per hour of Marc's time ≈ **$100–$425/h**. Compare: a $150k salary is ~$72/h.
The comparison is the point — but it is an ESTIMATE built on cold-email base rates that have
**not been measured on this list**. Treat the first 20 sends as the measurement, not the plan.

### The falsifier

Send 20. If **zero replies** arrive within 10 days, the message is wrong, not the market —
rewrite using an actual reply-rate read rather than sending 180 more. If **1–2 replies** arrive,
scale to 200. If **3+**, the problem is now capacity, which is the good problem.

Do **not** send 200 before sending 20. That is $0 spent on the only measurement that matters.

---

## Why this specific wedge (and not a generic "AI consulting" pitch)

1. **It inverts the sales call.** He is not asking for a meeting to explain AI. He brings a
   number about their own site that they can verify in 30 seconds. Authority is transferred by
   the artifact, not claimed by the sender.
2. **The competitor anchor does the work.** "mrmikesplumbing.ca scores 49. Yours scores 4."
   That sentence is the entire pitch, and it is true.
3. **The free tier costs nothing to give.** The scanner is automated. Serving 200 free reports
   costs electricity.
4. **It is a portfolio piece with a number attached.** For the job hunt, "I built and ran a
   15-signal agent-readiness scanner across 200 Calgary businesses, mean score 22.7" is a
   sentence a hiring manager remembers. Most candidates have opinions; this has a dataset.

---

## What only Marc can do

- **Send the emails.** Requires his identity, his address, his name. (Sender is currently a
  blocker — no `himalaya` config, `gws` absent. Cheapest unblock: a Gmail account + app
  password, or `gws` auth.)
- **Take the calls.**
- **Approve the price.** $299 is a guess. It is 3× under what an SEO agency charges for less,
  and 2 h of his own time at Tier 2.

Everything else — scanning, report generation, list-building, follow-up drafting, re-scans —
is machine work and should never touch his hands.

---

## The one thing

Send **20 emails** with a real score in each. That is the whole experiment. Everything above
this line is arithmetic until those 20 exist.
