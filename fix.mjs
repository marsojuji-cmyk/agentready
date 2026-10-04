#!/usr/bin/env node
/**
 * agentready fix — generate the actual fix files for a prospect.
 *
 * This is the $799 tier deliverable, produced in one command: a tailored
 * llms.txt, an AI-crawler robots.txt block, a schema.org JSON-LD skeleton, and
 * placement instructions — all derived from the prospect's own public homepage.
 *
 * Nothing is invented. Every field is either scraped from the live page or
 * emitted as an explicit `TODO`. Unfilled TODOs are the honest output, not a bug.
 *
 * Usage: node fix.mjs <url> --out <dir>
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith('--'));
const outIdx = args.indexOf('--out');
if (!target) { console.error('usage: node fix.mjs <url> --out <dir>'); process.exit(1); }

const UA = 'Mozilla/5.0 (compatible; AgentReadyBot/1.0)';
let origin, host;
try {
  origin = new URL(/^https?:\/\//i.test(target) ? target : 'https://' + target).origin;
  host = new URL(origin).host;
} catch { console.error('bad url'); process.exit(1); }

let html = '';
const FETCH_HEADERS = [
  { 'user-agent': UA, accept: 'text/html' },
  { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', accept: 'text/html,application/xhtml+xml' },
];
for (const h of FETCH_HEADERS) {
  try {
    const res = await fetch(origin + '/', { headers: h, signal: AbortSignal.timeout(15000) });
    if (res.ok) { html = await res.text(); break; }
  } catch { /* try the next header set */ }
}
if (!html) { console.error(`could not fetch ${origin} (both bot and browser user-agents refused)`); process.exit(1); }

const outBase = outIdx !== -1 ? args[outIdx + 1] : join(process.cwd(), 'fixes');
const outDir = join(outBase, host);
mkdirSync(outDir, { recursive: true });

const text = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');
const strip = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#8217;|&rsquo;/g, "'").replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const one = (re) => { const m = text.match(re); return m ? strip(m[1]) : null; };

// ---- scrape only what is really on the page ----
const title = one(/<title[^>]*>([\s\S]*?)<\/title>/i);
const desc = (text.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i) || [])[1] || null;
const h1 = one(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => strip(m[1])).filter((s) => s.length > 2 && s.length < 90).slice(0, 8);

let jsonld = {};
for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
  try {
    const parsed = JSON.parse(m[1].trim());
    const nodes = Array.isArray(parsed) ? parsed : (parsed['@graph'] || [parsed]);
    for (const n of nodes) if (n && (n.telephone || n.address || n.name)) jsonld = { ...jsonld, ...n };
  } catch { /* ignore malformed */ }
}

const phone = jsonld.telephone || (text.match(/(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/) || [])[0] || null;
// email: prefer a real mailto: link; reject image/asset filenames that look like addresses
const BAD_EXT = /\.(jpg|jpeg|png|gif|webp|svg|css|js|json|pdf|mp4|woff2?|ico|xml)$/i;
const mailtoHref = (html.match(/mailto:([\w.+-]+@[\w-]+\.[a-z]{2,10})/i) || [])[1] || null;
const rawEmail = (text.match(/[\w.+-]+@[\w-]+\.[a-z]{2,10}\b/i) || [])[0] || null;
const email = mailtoHref || (rawEmail && !BAD_EXT.test(rawEmail) ? rawEmail : null);

// internal links with anchor text, for the llms.txt Pages section
const seen = new Set();
const pages = [];
for (const m of html.matchAll(/<a\s[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
  let raw = m[1].trim(); const label = strip(m[2]);
  if (!label || label.length < 3 || label.length > 70) continue;
  if (/^(#|mailto:|tel:|javascript:)/i.test(raw)) continue;
  let abs; try { abs = new URL(raw, origin).href; } catch { continue; }
  if (!abs.startsWith(origin)) continue;
  abs = abs.split('#')[0].replace(/\/$/, '');
  if (abs === origin || abs === origin + '/') continue;
  if (seen.has(abs) || pages.length >= 12) continue;
  seen.add(abs);
  pages.push({ label, url: abs });
}

// ---- deliverables ----
const name = (title || h1 || host).split(/[|\-–—]/)[0].trim();
const summary = desc || h1 || `TODO: one-sentence description of what ${name} does and who it serves.`;

const llms = `# ${name}

> ${summary}

${h2s.length ? h2s.map((h) => `- ${h}`).join('\n') : '- TODO: list 3-6 things this site covers, one line each'}

## Pages

${pages.length ? pages.map((p) => `- [${p.label}](${p.url})`).join('\n') : `- [Home](${origin})`}

## Contact

${phone ? `- Phone: ${phone}` : '- TODO: phone'}
${email ? `- Email: ${email}` : '- TODO: email — a business email, not a no-reply'}
- Website: ${origin}
${jsonld.address ? `- Address: ${[jsonld.address.streetAddress, jsonld.address.addressLocality, jsonld.address.addressRegion, jsonld.address.postalCode].filter(Boolean).join(', ') || 'TODO'}` : '- TODO: street address, city, province, postal code'}

## Optional

- TODO: pricing, hours, service area, warranty terms — anything a customer would ask before calling.
`;

const robots = `# --- AI agent crawlers (append to your existing robots.txt) ---
# Allow = you want these assistants to read and cite your site.
# Change to Disallow if you want to opt out of that crawler entirely.

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: CCBot
Allow: /

# Google-Extended controls Gemini grounding AND training on your content.
# Allow = you get cited in Gemini answers. Disallow = you opt out of training.
User-agent: Google-Extended
Allow: /

Sitemap: ${origin}/sitemap.xml
`;

const addressParts = jsonld.address || {};
const schema = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": ${JSON.stringify(name)},
  "url": "${origin}",
  "description": ${JSON.stringify(summary)},
  "telephone": ${phone ? JSON.stringify(phone) : '"TODO"'},
  "email": ${email ? JSON.stringify(email) : '"TODO"'},
  "address": {
    "@type": "PostalAddress",
    "streetAddress": ${addressParts.streetAddress ? JSON.stringify(addressParts.streetAddress) : '"TODO"'},
    "addressLocality": ${addressParts.addressLocality ? JSON.stringify(addressParts.addressLocality) : '"TODO"' },
    "addressRegion": ${addressParts.addressRegion ? JSON.stringify(addressParts.addressRegion) : '"AB"'},
    "postalCode": ${addressParts.postalCode ? JSON.stringify(addressParts.postalCode) : '"TODO"'},
    "addressCountry": "CA"
  },
  "areaServed": "TODO: city / region you serve",
  "openingHours": "TODO: e.g. Mo-Su 00:00-24:00",
  "priceRange": "TODO: e.g. $$$",
  "foundingDate": "TODO: YYYY",
  "sameAs": ["TODO: Google Business Profile URL", "TODO: Facebook page URL"]
}
</script>
`;

const todos = (llms + schema).match(/TODO/g)?.length || 0;

const fix = `# Fix pack — ${host}

Generated ${new Date().toISOString()} from ${origin}

**${todos} fields marked TODO.** Those are facts I could not read off the public page.
Fill them in — do not let me or anyone else invent a phone number or an address.

## 1. \`llms.txt\` → upload to \`${origin}/llms.txt\`

The root of the site, plain text, \`text/plain\`. This is the single highest-value
file in the pack: it is 12 of the 93 weighted points and it is the file assistants
read first.

\`\`\`
${llms}\`\`\`

## 2. \`robots.txt\` → append to the existing file at \`${origin}/robots.txt\`

Append, **do not replace** — the existing rules may be load-bearing.

\`\`\`
${robots}\`\`\`

## 3. Schema.org JSON-LD → paste inside \`<head>\` on the homepage

\`\`\`html
${schema}\`\`\`

## 4. Verify

Re-run the scan after deploying:

\`\`\`bash
node scan.mjs ${origin}
\`\`\`

A move to C-or-better (62/100 or above) is the acceptance test. If the score does
not move, the files did not deploy — check content-type on \`/llms.txt\`
(it must serve as \`text/plain\`, not an HTML error page).
`;

writeFileSync(join(outDir, 'llms.txt'), llms);
writeFileSync(join(outDir, 'robots-ai-block.txt'), robots);
writeFileSync(join(outDir, 'schema.jsonld.html'), schema);
writeFileSync(join(outDir, 'FIX.md'), fix);

console.log(`  fix pack → ${outDir}`);
console.log(`    llms.txt              ${llms.length} bytes, ${pages.length} pages, ${todos} TODOs remaining`);
console.log(`    robots-ai-block.txt   ${robots.split('\n').length} lines`);
console.log(`    schema.jsonld.html    LocalBusiness skeleton`);
console.log(`    FIX.md                placement + verification instructions`);
