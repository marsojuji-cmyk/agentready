# Fix pack — aqualityplumber.com

Generated 2026-10-04T12:33:08.037Z from https://aqualityplumber.com

**9 fields marked TODO.** Those are facts I could not read off the public page.
Fill them in — do not let me or anyone else invent a phone number or an address.

## 1. `llms.txt` → upload to `https://aqualityplumber.com/llms.txt`

The root of the site, plain text, `text/plain`. This is the single highest-value
file in the pack: it is 12 of the 93 weighted points and it is the file assistants
read first.

```
# Plumbing & Heating Services Calgary

> Aquality Plumbing &amp; Heating is Calgary&#039;s top choice for Reliable plumbing and heating services. We offer expert plumbing services, repairs, &amp; installations.

- 22 Years Serving Calgary
- FEEL THE COMFORT
- Calgary's Plumbing, Heating & Cooling Leader Creating Trusted Relationships
- Leave Us A Google Review
- Satisfaction Guaranteed
- Blog
- City-Wide Calgary Plumbing Service Available. 24/7 Emergency Service
- Leave Us A Google Review

## Pages

- [Hiring HVAC Technicians & Plumbers](https://aqualityplumber.com/calgary-plumber-job)
- [Request Service](https://aqualityplumber.com/contact)
- [About Us](https://aqualityplumber.com/about-aquality)
- [Aquality Experience](https://aqualityplumber.com/about-aquality/aquality-experience)
- [Pricing](https://aqualityplumber.com/pricing)
- [Warranty](https://aqualityplumber.com/about-aquality/warranty)
- [Referral Program](https://aqualityplumber.com/referral-program)
- [Testimonials](https://aqualityplumber.com/testimonials)
- [Trusted Brands](https://aqualityplumber.com/about-aquality/trusted-brands)
- [Air Conditioning](https://aqualityplumber.com/heating-services/air-conditioning-services)
- [Plumbing](https://aqualityplumber.com/plumbing-services)
- [Tub and Sink Drain Cleaning](https://aqualityplumber.com/plumbing-services/tub-sink-drain-cleaning)

## Contact

- Phone: 403-205-2782
- TODO: email — a business email, not a no-reply
- Website: https://aqualityplumber.com
- Address: 263 Canterville Dr SW, Calgary, AB, T2W 3X9

## Optional

- TODO: pricing, hours, service area, warranty terms — anything a customer would ask before calling.
```

## 2. `robots.txt` → append to the existing file at `https://aqualityplumber.com/robots.txt`

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

Sitemap: https://aqualityplumber.com/sitemap.xml
```

## 3. Schema.org JSON-LD → paste inside `<head>` on the homepage

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Plumbing & Heating Services Calgary",
  "url": "https://aqualityplumber.com",
  "description": "Aquality Plumbing &amp; Heating is Calgary&#039;s top choice for Reliable plumbing and heating services. We offer expert plumbing services, repairs, &amp; installations.",
  "telephone": "403-205-2782",
  "email": "TODO",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "263 Canterville Dr SW",
    "addressLocality": "Calgary",
    "addressRegion": "AB",
    "postalCode": "T2W 3X9",
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
node scan.mjs https://aqualityplumber.com
```

A move to C-or-better (62/100 or above) is the acceptance test. If the score does
not move, the files did not deploy — check content-type on `/llms.txt`
(it must serve as `text/plain`, not an HTML error page).
