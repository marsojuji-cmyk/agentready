# Fix pack — calgaryplumbing.net

Generated 2026-10-04T12:33:01.634Z from https://calgaryplumbing.net

**9 fields marked TODO.** Those are facts I could not read off the public page.
Fill them in — do not let me or anyone else invent a phone number or an address.

## 1. `llms.txt` → upload to `https://calgaryplumbing.net/llms.txt`

The root of the site, plain text, `text/plain`. This is the single highest-value
file in the pack: it is 12 of the 93 weighted points and it is the file assistants
read first.

```
# Calgary Plumber, Heating & Gas

> Red Seal plumber and Type B gasfitter serving SE Calgary. Water treatment, furnaces, boilers and gas. 5.0 stars, 190+ reviews. Call 403-404-9975.

- Introducing 180 Plumbing & Heating
- Services
- Frequently Asked Questions
- Why Choose 180 Plumbing & Heating?
- What Our Clients Say
- Service Areas
- Proud Suppliers Of

## Pages

- [Annual Care Plan](https://calgaryplumbing.net/annual-care-plan)
- [Company](https://calgaryplumbing.net/company)
- [Careers](https://calgaryplumbing.net/careers)
- [Reviews](https://calgaryplumbing.net/reviews)
- [Contact](https://calgaryplumbing.net/contact)
- [Plumbing](https://calgaryplumbing.net/plumbing)
- [Hot Water Tanks](https://calgaryplumbing.net/plumbing/hot-water-tanks)
- [Water Softeners](https://calgaryplumbing.net/plumbing/water-softeners)
- [Tankless Water Heaters](https://calgaryplumbing.net/plumbing/tankless-water-heaters)
- [Toilet Installation](https://calgaryplumbing.net/plumbing/toilets)
- [Poly-B Piping Replacement](https://calgaryplumbing.net/plumbing/poly-b-pipes)
- [Reverse Osmosis](https://calgaryplumbing.net/water-treatment/reverse-osmosis)

## Contact

- Phone: +1-403-404-9975
- TODO: email — a business email, not a no-reply
- Website: https://calgaryplumbing.net
- Address: 14 Prestwick Way SE, Calgary, AB, T2Z 3L9

## Optional

- TODO: pricing, hours, service area, warranty terms — anything a customer would ask before calling.
```

## 2. `robots.txt` → append to the existing file at `https://calgaryplumbing.net/robots.txt`

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

Sitemap: https://calgaryplumbing.net/sitemap.xml
```

## 3. Schema.org JSON-LD → paste inside `<head>` on the homepage

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Calgary Plumber, Heating & Gas",
  "url": "https://calgaryplumbing.net",
  "description": "Red Seal plumber and Type B gasfitter serving SE Calgary. Water treatment, furnaces, boilers and gas. 5.0 stars, 190+ reviews. Call 403-404-9975.",
  "telephone": "+1-403-404-9975",
  "email": "TODO",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "14 Prestwick Way SE",
    "addressLocality": "Calgary",
    "addressRegion": "AB",
    "postalCode": "T2Z 3L9",
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
node scan.mjs https://calgaryplumbing.net
```

A move to C-or-better (62/100 or above) is the acceptance test. If the score does
not move, the files did not deploy — check content-type on `/llms.txt`
(it must serve as `text/plain`, not an HTML error page).
