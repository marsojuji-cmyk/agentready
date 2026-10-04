# Fix pack — mycalgaryplumber.ca

Generated 2026-10-04T12:33:11.875Z from https://mycalgaryplumber.ca

**13 fields marked TODO.** Those are facts I could not read off the public page.
Fill them in — do not let me or anyone else invent a phone number or an address.

## 1. `llms.txt` → upload to `https://mycalgaryplumber.ca/llms.txt`

The root of the site, plain text, `text/plain`. This is the single highest-value
file in the pack: it is 12 of the 93 weighted points and it is the file assistants
read first.

```
# Calgary plumber

> Trusted plumbing and HVAC services in Calgary from start to finish

- Plumbing and HVAC Services Done Right the First Time
- Why Calgary homeowners choose us
- Upfront pricing and what to expect on every visit
- What we help with most in Calgary homes
- Healthy Home Club membership
- Proudly serving Calgary and nearby communities
- Your Trusted Calgary Plumbing and hvac Experts

## Pages

- [Plumbing](https://mycalgaryplumber.ca/plumbing-services)
- [Toilet Services](https://mycalgaryplumber.ca/plumbing-services/toilet)
- [Bathroom Plumbing](https://mycalgaryplumber.ca/plumbing-services/bathroom-plumbing)
- [Kitchen Plumbing](https://mycalgaryplumber.ca/plumbing-services/kitchen-plumbing)
- [Burst Pipe Repair](https://mycalgaryplumber.ca/plumbing-services/burst-pipe-repair)
- [Sump Pump Repair & Installation](https://mycalgaryplumber.ca/plumbing-services/sump-pump-repair-installation)
- [Water Leak Detection & Fixture](https://mycalgaryplumber.ca/plumbing-services/water-leak-detection-fixture)
- [Faucet Repair](https://mycalgaryplumber.ca/plumbing-services/faucet-repair)
- [Water Heater](https://mycalgaryplumber.ca/water-heater)
- [Water Heater Repair](https://mycalgaryplumber.ca/water-heater/repair)
- [Water Heater Replacement](https://mycalgaryplumber.ca/water-heater/replacement)
- [Water Heater Installation](https://mycalgaryplumber.ca/water-heater/water-heater-installation)

## Contact

- Phone: (587) 707-0606
- TODO: email — a business email, not a no-reply
- Website: https://mycalgaryplumber.ca
- TODO: street address, city, province, postal code

## Optional

- TODO: pricing, hours, service area, warranty terms — anything a customer would ask before calling.
```

## 2. `robots.txt` → append to the existing file at `https://mycalgaryplumber.ca/robots.txt`

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

Sitemap: https://mycalgaryplumber.ca/sitemap.xml
```

## 3. Schema.org JSON-LD → paste inside `<head>` on the homepage

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Calgary plumber",
  "url": "https://mycalgaryplumber.ca",
  "description": "Trusted plumbing and HVAC services in Calgary from start to finish",
  "telephone": "(587) 707-0606",
  "email": "TODO",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "TODO",
    "addressLocality": "TODO",
    "addressRegion": "AB",
    "postalCode": "TODO",
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
node scan.mjs https://mycalgaryplumber.ca
```

A move to C-or-better (62/100 or above) is the acceptance test. If the score does
not move, the files did not deploy — check content-type on `/llms.txt`
(it must serve as `text/plain`, not an HTML error page).
