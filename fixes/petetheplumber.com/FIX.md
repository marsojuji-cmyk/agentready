# Fix pack — petetheplumber.com

Generated 2026-10-04T12:33:02.664Z from https://petetheplumber.com

**9 fields marked TODO.** Those are facts I could not read off the public page.
Fill them in — do not let me or anyone else invent a phone number or an address.

## 1. `llms.txt` → upload to `https://petetheplumber.com/llms.txt`

The root of the site, plain text, `text/plain`. This is the single highest-value
file in the pack: it is 12 of the 93 weighted points and it is the file assistants
read first.

```
# Plumber Calgary

> Pete The Plumber specializes in plumbing services, hot water tank installation and repair and more. Call our Calgary Plumbers today (403) 257-1766.

- About Pete The Plumber
- Plumber Calgary
- Plumbing Services
- Frequently Asked Questions
- Why Pete the Plumber?
- Calgary Emergency Plumbing Services
- Calgary Electricians
- Pete The Plumber Awards & Recognition

## Pages

- [Plumbing Installation and Repair](https://petetheplumber.com/plumbing)
- [Drain Cleaning](https://petetheplumber.com/plumbing/drain-cleaning)
- [Sewer Repair](https://petetheplumber.com/plumbing/sewer-digs)
- [Water Softening](https://petetheplumber.com/plumbing/water-softeners)
- [Poly-B Piping](https://petetheplumber.com/plumbing/poly-b-pipes)
- [Hot Water Tank Installation](https://petetheplumber.com/hot-water-tanks)
- [Furnace](https://petetheplumber.com/furnace)
- [Electrical](https://petetheplumber.com/electrical)
- [Air Conditioning](https://petetheplumber.com/air-conditioning)
- [Showroom](https://petetheplumber.com/showroom)
- [24/7 service](https://petetheplumber.com/plumbing/emergency-plumbing-services)
- [panel upgrades](https://petetheplumber.com/electrical/panel-upgrades)

## Contact

- Phone: +14032571766
- TODO: email — a business email, not a no-reply
- Website: https://petetheplumber.com
- Address: #14, 4550 112 Ave SE, Calgary, AB, T2C 2K2

## Optional

- TODO: pricing, hours, service area, warranty terms — anything a customer would ask before calling.
```

## 2. `robots.txt` → append to the existing file at `https://petetheplumber.com/robots.txt`

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

Sitemap: https://petetheplumber.com/sitemap.xml
```

## 3. Schema.org JSON-LD → paste inside `<head>` on the homepage

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Plumber Calgary",
  "url": "https://petetheplumber.com",
  "description": "Pete The Plumber specializes in plumbing services, hot water tank installation and repair and more. Call our Calgary Plumbers today (403) 257-1766.",
  "telephone": "+14032571766",
  "email": "TODO",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "#14, 4550 112 Ave SE",
    "addressLocality": "Calgary",
    "addressRegion": "AB",
    "postalCode": "T2C 2K2",
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
node scan.mjs https://petetheplumber.com
```

A move to C-or-better (62/100 or above) is the acceptance test. If the score does
not move, the files did not deploy — check content-type on `/llms.txt`
(it must serve as `text/plain`, not an HTML error page).
