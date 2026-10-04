# Fix pack — iconplumbing.ca

Generated 2026-10-04T12:33:02.028Z from https://iconplumbing.ca

**7 fields marked TODO.** Those are facts I could not read off the public page.
Fill them in — do not let me or anyone else invent a phone number or an address.

## 1. `llms.txt` → upload to `https://iconplumbing.ca/llms.txt`

The root of the site, plain text, `text/plain`. This is the single highest-value
file in the pack: it is 12 of the 93 weighted points and it is the file assistants
read first.

```
# Plumbing & Heating Services

> Building Relationships & mechanical systems that last

- Comfort & Plumbing Crises Don’t Wait—Neither Do We.
- Why Our Clients Choose ICON
- No Surprises. Just Solutions.
- Building Relationships, One Review at a Time.
- Frequently Asked Questions
- ICON Plumbing & Heating Ltd.

## Pages

- [About](https://iconplumbing.ca/about)
- [Hot Water Tanks](https://iconplumbing.ca/hot-water-tanks)
- [New Construction](https://iconplumbing.ca/new-construction-plumbing)
- [Sump Pumps](https://iconplumbing.ca/sump-pumps)
- [Tankless Water Heaters](https://iconplumbing.ca/tankless-water-heaters)
- [Commercial Plumbing](https://iconplumbing.ca/commercial-plumbing)
- [Poly B replacement](https://iconplumbing.ca/poly-b-replacement)
- [Boiler Repair](https://iconplumbing.ca/boiler-repair)
- [Furnace Repair](https://iconplumbing.ca/furnace-repair)
- [Furnace Replacement](https://iconplumbing.ca/furnace-replacement)
- [Garage Heaters](https://iconplumbing.ca/garage-heaters)
- [HVAC Repair](https://iconplumbing.ca/hvac-repair)

## Contact

- Phone: +15872297718
- Email: schedule@iconplumbing.ca
- Website: https://iconplumbing.ca
- Address: 7 Co-op Road, Didsbury, AB, T0M 0A2

## Optional

- TODO: pricing, hours, service area, warranty terms — anything a customer would ask before calling.
```

## 2. `robots.txt` → append to the existing file at `https://iconplumbing.ca/robots.txt`

Append, **do not replace** — the existing rules may be load-bearing.

```
# --- AI agent crawlers (append to your existing robots.txt) ---
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

Sitemap: https://iconplumbing.ca/sitemap.xml
```

## 3. Schema.org JSON-LD → paste inside `<head>` on the homepage

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Plumbing & Heating Services",
  "url": "https://iconplumbing.ca",
  "description": "Building Relationships & mechanical systems that last",
  "telephone": "+15872297718",
  "email": "schedule@iconplumbing.ca",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "7 Co-op Road",
    "addressLocality": "Didsbury",
    "addressRegion": "AB",
    "postalCode": "T0M 0A2",
    "addressCountry": "CA"
  },
  "areaServed": "TODO: city / region you serve",
  "openingHours": "TODO: e.g. Mo-Su 00:00-24:00",
  "priceRange": "TODO: e.g. $$$",
  "foundingDate": "TODO: YYYY",
  "sameAs": ["TODO: Google Business Profile URL", "TODO: Facebook page URL"]
}
</script>
```

## 4. Verify

Re-run the scan after deploying:

```bash
node scan.mjs https://iconplumbing.ca
```

A move to C-or-better (62/100 or above) is the acceptance test. If the score does
not move, the files did not deploy — check content-type on `/llms.txt`
(it must serve as `text/plain`, not an HTML error page).
