# Security Policy

## Reporting a vulnerability

Please use **GitHub's private vulnerability reporting** (the *Security* tab → *Report a
vulnerability*) rather than a public issue.

Include what you ran, what you expected, what happened, and the version or commit. A
reproduction is worth more than a description.

## Scope

`agentready` is a zero-dependency scanner: it fetches a URL and scores how well AI agents can
read, cite and operate the page. It does not hold credentials, run as a service, or store data.

Two things are in scope and worth reporting:

1. **Anything that makes the score wrong** — a page scored well that an agent cannot use, or
   scored badly that it can. A scoring tool that reports incorrectly is the whole product.
2. **Anything unsafe in fetching** — SSRF, redirect handling, unbounded reads, or content that
   causes the scanner to execute rather than inspect.

## What this does not claim

The score is a **heuristic**, not a verdict. It measures how a page presents itself to an agent;
it does not prove a page is accurate, safe, or honest. Treat a high score as "worth checking",
never as "verified".
