# Fix pack — calgarysplumber.com

Generated 2026-10-04T12:33:07.542Z from https://calgarysplumber.com

**11 fields marked TODO.** Those are facts I could not read off the public page.
Fill them in — do not let me or anyone else invent a phone number or an address.

## 1. `llms.txt` → upload to `https://calgarysplumber.com/llms.txt`

The root of the site, plain text, `text/plain`. This is the single highest-value
file in the pack: it is 12 of the 93 weighted points and it is the file assistants
read first.

```
# Calgary&#039;s #1 Plumber & Heating Company

> Calgary&#039;s highest-rated plumber | 900+ five-star reviews since 1979. Emergency plumbing &amp; heating 24/7. Call (403) 300-0813 or book online.

- Proudly building the people who build Alberta
- We are the Best in Plumbing and Heating in Calgary!
- In a Hurry?
- Plumbing and Heating Services in Calgary.
- About Us
- Contact Wiehler today
- Trusted Safety With COR Certification
- Keep Your Family Safe with a Free Home Safety Audit.

## Pages

- [Home](https://calgarysplumber.com)

## Contact

- Phone: (403) 300-0813
- Email: service@wiehler.ca
- Website: https://calgarysplumber.com
- TODO: street address, city, province, postal code

## Optional

- TODO: pricing, hours, service area, warranty terms — anything a customer would ask before calling.
```

## 2. `robots.txt` → append to the existing file at `https://calgarysplumber.com/robots.txt`

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

Sitemap: https://calgarysplumber.com/sitemap.xml
```

## 3. Schema.org JSON-LD → paste inside `<head>` on the homepage

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Calgary&#039;s #1 Plumber & Heating Company",
  "url": "https://calgarysplumber.com",
  "description": "Calgary&#039;s highest-rated plumber | 900+ five-star reviews since 1979. Emergency plumbing &amp; heating 24/7. Call (403) 300-0813 or book online.",
  "telephone": "(403) 300-0813",
  "email": "service@wiehler.ca",
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
node scan.mjs https://calgarysplumber.com
```

A move to C-or-better (62/100 or above) is the acceptance test. If the score does
not move, the files did not deploy — check content-type on `/llms.txt`
(it must serve as `text/plain`, not an HTML error page).
