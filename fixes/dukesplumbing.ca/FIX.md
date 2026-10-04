# Fix pack — dukesplumbing.ca

Generated 2026-10-04T12:32:58.944Z from https://dukesplumbing.ca

**7 fields marked TODO.** Those are facts I could not read off the public page.
Fill them in — do not let me or anyone else invent a phone number or an address.

## 1. `llms.txt` → upload to `https://dukesplumbing.ca/llms.txt`

The root of the site, plain text, `text/plain`. This is the single highest-value
file in the pack: it is 12 of the 93 weighted points and it is the file assistants
read first.

```
# Dukes Plumbing Inc

> For reliable and affordable plumbing services, no one beats Dukes Plumbing Inc. Click to learn more.

- A Top-Rated Plumber Serving the Local Area
- Plumbing Installations Guaranteed to Please
- Best-in-Class Plumbing Repairs
- For Local Plumbing Services, Choose Dukes Plumbing Inc
- Contact Info
- Payment Methods
- Follow Us

## Pages

- [Home](https://dukesplumbing.ca/home)
- [About](https://dukesplumbing.ca/about-us)
- [Blog](https://dukesplumbing.ca/about-us/blog)
- [Reviews](https://dukesplumbing.ca/about-us/reviews)
- [Services](https://dukesplumbing.ca/services)
- [Commercial Plumbing](https://dukesplumbing.ca/services/commercial-plumbing)
- [Drain Camera Inspections](https://dukesplumbing.ca/services/drain-camera-inspections)
- [Drain Unclogging Services](https://dukesplumbing.ca/services/drain-unclogging-services)
- [Plumber](https://dukesplumbing.ca/services/plumber)
- [Plumbing Company](https://dukesplumbing.ca/services/plumbing-company)
- [Plumbing Repair](https://dukesplumbing.ca/services/plumbing-repair)
- [Plumbing Services](https://dukesplumbing.ca/services/plumbing-services)

## Contact

- Phone: (403) 474-2257
- Email: info@dukesplumbing.ca
- Website: https://dukesplumbing.ca
- Address: 432 Harrison Ct , Crossfield, AB, T0M 0S0

## Optional

- TODO: pricing, hours, service area, warranty terms — anything a customer would ask before calling.
```

## 2. `robots.txt` → append to the existing file at `https://dukesplumbing.ca/robots.txt`

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

Sitemap: https://dukesplumbing.ca/sitemap.xml
```

## 3. Schema.org JSON-LD → paste inside `<head>` on the homepage

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Dukes Plumbing Inc",
  "url": "https://dukesplumbing.ca",
  "description": "For reliable and affordable plumbing services, no one beats Dukes Plumbing Inc. Click to learn more.",
  "telephone": "(403) 474-2257",
  "email": "info@dukesplumbing.ca",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "432 Harrison Ct ",
    "addressLocality": "Crossfield",
    "addressRegion": "AB",
    "postalCode": "T0M 0S0",
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
node scan.mjs https://dukesplumbing.ca
```

A move to C-or-better (62/100 or above) is the acceptance test. If the score does
not move, the files did not deploy — check content-type on `/llms.txt`
(it must serve as `text/plain`, not an HTML error page).
