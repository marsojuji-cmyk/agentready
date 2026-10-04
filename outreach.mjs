#!/usr/bin/env node
/**
 * agentready outreach — turn a domain list into a ready-to-send campaign.
 *
 * For every prospect: scan it, generate a personalised HTML report, and write an
 * email draft anchored on the cohort leader's real score.
 *
 * Usage: node outreach.mjs <list.txt> --out <dir> [--cat "Calgary plumbers"] [--city Calgary]
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const listFile = args.find((a) => !a.startsWith('--'));
const val = (flag, dflt) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : dflt; };
const outDir = val('--out', join(process.cwd(), 'prospects'));
const category = val('--cat', 'your industry');
const city = val('--city', 'Calgary');
const scanDir = join(outDir, 'reports');

const lines = readFileSync(listFile, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
mkdirSync(scanDir, { recursive: true });

const rows = [];
for (const target of lines) {
  try {
    const raw = execFileSync(process.execPath, [join(import.meta.dirname, 'scan.mjs'), target, '--json', '--out', scanDir], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
    const r = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1));
    rows.push(r);
    console.log(`  ${String(r.score).padStart(3)}/100  ${r.grade}  ${r.host}`);
  } catch (e) {
    console.error(`  ! ${target} — ${String(e.message).slice(0, 100)}`);
  }
}

if (!rows.length) { console.error('no prospects scanned'); process.exit(1); }

const leader = rows.slice().sort((a, b) => b.score - a.score)[0];
const mean = (rows.reduce((s, r) => s + r.score, 0) / rows.length).toFixed(1);
const improve = rows.slice().sort((a, b) => a.score - b.score);

const nameW = Math.max(...rows.map((r) => r.host.length), 20);
const line = (label, score, grade, tail = '') =>
  `    ${label.padEnd(nameW + 2, '.')} ${String(score).padStart(3)}/100   grade ${grade}${tail}`;

const index = [`# Outreach queue — ${category}, ${city}`,
  '', `Scanned ${new Date().toISOString().slice(0, 10)} · ${rows.length} prospects · mean ${mean}/100 · cohort leader ${leader.host} (${leader.score})`, '',
  '| # | Prospect | Score | Grade | Gap pts available | Draft |', '|---|---|---|---|---|---|'];

improve.forEach((r, i) => {
  const avail = r.gaps.reduce((s, g) => s + g.weight, 0);
  const draft = `${r.host}.email.md`;
  const body = `Subject: ${r.host} scores ${r.score}/100 on AI-agent readiness

Hi —

I ran an automated scan of ${city} ${category} websites against the 15 signals AI
assistants use to read, cite and operate a site — llms.txt, AI crawler rules in
robots.txt, schema.org structured data, API surface, and markdown content
negotiation.

    ${line(r.host, r.score, r.grade)}
    ${line(leader.host, leader.score, leader.grade, '   <- cohort leader')}
    ${line(category + ' average', mean, '—')}

The three biggest gaps on your site:

${r.gaps.slice(0, 3).map((g, n) => `  ${n + 1}. ${g.name}  (worth ${g.weight} points)`).join('\n')}

The full one-page report for ${r.host} is attached.

Every number is reproducible — the scanner is 15 checks in one open-source file, so
you can verify my work before you believe it:
https://github.com/marsojuji-cmyk/agentready

If you want the fixes applied, I do that too ($799, includes a re-scan proving the
score moved). The report itself is free either way.

— Marcus Richards
Calgary, AB
`;
  writeFileSync(join(outDir, draft), body);
  index.push(`| ${i + 1} | ${r.host} | ${r.score} | ${r.grade} | +${avail} | [draft](${draft}) |`);
});

// report HTML + the prospect-facing copies
for (const r of rows) {
  const src = join(scanDir, `${r.host}.html`);
  if (existsSync(src)) copyFileSync(src, join(outDir, `${r.host}.html`));
}

writeFileSync(join(outDir, 'INDEX.md'), index.join('\n') + `
---

## Send protocol

1. Send **20 first**, not 200. The reply rate on those 20 *is* the measurement.
2. Personalise the greeting line — the score does the heavy lifting, the greeting
   stops it reading as spam.
3. Zero replies in 10 days ⇒ rewrite the subject line, do not send 180 more.
4. One reply ⇒ send the next 180.

## Sender blocker

Nothing in this queue can leave the building until a sender is configured.
Cheapest unblock: an app password on a dedicated address, or \`gws\` auth.
`);

console.log(`\n  wrote ${rows.length} drafts + reports to ${outDir}`);
console.log(`  queue: ${join(outDir, 'INDEX.md')}`);
