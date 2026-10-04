# Fix pack — allcanadianplumbing.ca

Generated 2026-10-04T12:32:58.220Z from https://allcanadianplumbing.ca

**11 fields marked TODO.** Those are facts I could not read off the public page.
Fill them in — do not let me or anyone else invent a phone number or an address.

## 1. `llms.txt` → upload to `https://allcanadianplumbing.ca/llms.txt`

The root of the site, plain text, `text/plain`. This is the single highest-value
file in the pack: it is 12 of the 93 weighted points and it is the file assistants
read first.

```
# Home

> Reliable Calgary plumbing — fast, affordable repairs, installs &amp; more. Call (587) 317-1418 for trusted service.

- What Our Customers Say!
- OUR SERVICES
- Leak Diagnostics & Repair
- Drain Cleaning
- Hot Water Tank Services
- Fixture Installation & Replacement
- Residential Renovations & New Builds
- Commercial Plumbing

## Pages

- [Home](https://allcanadianplumbing.ca)

## Contact

- Phone: (587) 317-1418
- Email: info@allcanadianplumbing.com
- Website: https://allcanadianplumbing.ca
- TODO: street address, city, province, postal code

## Optional

- TODO: pricing, hours, service area, warranty terms — anything a customer would ask before calling.
```

## 2. `robots.txt` → append to the existing file at `https://allcanadianplumbing.ca/robots.txt`

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

Sitemap: https://allcanadianplumbing.ca/sitemap.xml
```

## 3. Schema.org JSON-LD → paste inside `<head>` on the homepage

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Home",
  "url": "https://allcanadianplumbing.ca",
  "description": "Reliable Calgary plumbing — fast, affordable repairs, installs &amp; more. Call (587) 317-1418 for trusted service.",
  "telephone": "(587) 317-1418",
  "email": "info@allcanadianplumbing.com",
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
node scan.mjs https://allcanadianplumbing.ca
```

A move to C-or-better (62/100 or above) is the acceptance test. If the score does
not move, the files did not deploy — check content-type on `/llms.txt`
(it must serve as `text/plain`, not an HTML error page).
