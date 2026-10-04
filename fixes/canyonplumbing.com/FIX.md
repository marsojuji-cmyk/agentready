# Fix pack — canyonplumbing.com

Generated 2026-10-04T12:33:11.260Z from https://canyonplumbing.com

**13 fields marked TODO.** Those are facts I could not read off the public page.
Fill them in — do not let me or anyone else invent a phone number or an address.

## 1. `llms.txt` → upload to `https://canyonplumbing.com/llms.txt`

The root of the site, plain text, `text/plain`. This is the single highest-value
file in the pack: it is 12 of the 93 weighted points and it is the file assistants
read first.

```
# Residential, Custom Homes, Renovations

> Calgary&#x27;s Top Choice Since 1978

- Explore Our Services
- Visit Our Showroom
- Our Promise to You
- Our happy customers
- Get in touch with an expert

## Pages

- [Our Services](https://canyonplumbing.com/our-services)
- [Furnace & Air Conditioning](https://canyonplumbing.com/services/furnace-air-conditioning)
- [Service & Maintenance](https://canyonplumbing.com/services/service-and-maintenance)
- [Renovations & Poly B Replacement](https://canyonplumbing.com/services/renovations-and-poly-b-replacement)
- [Residential Contract Plumbing](https://canyonplumbing.com/services/residential-contract-plumbing)
- [Residential Contract HVAC](https://canyonplumbing.com/services/heating-ventilation-and-air-conditioning)
- [Custom Homes](https://canyonplumbing.com/services/custom-homes)
- [Products/Suppliers](https://canyonplumbing.com/products-suppliers)
- [Showroom](https://canyonplumbing.com/showroom)
- [About Us](https://canyonplumbing.com/about-us)
- [Our Team](https://canyonplumbing.com/our-team)
- [Careers](https://canyonplumbing.com/careers)

## Contact

- Phone: +1 (877) 877-9957
- TODO: email — a business email, not a no-reply
- Website: https://canyonplumbing.com
- TODO: street address, city, province, postal code

## Optional

- TODO: pricing, hours, service area, warranty terms — anything a customer would ask before calling.
```

## 2. `robots.txt` → append to the existing file at `https://canyonplumbing.com/robots.txt`

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

Sitemap: https://canyonplumbing.com/sitemap.xml
```

## 3. Schema.org JSON-LD → paste inside `<head>` on the homepage

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Residential, Custom Homes, Renovations",
  "url": "https://canyonplumbing.com",
  "description": "Calgary&#x27;s Top Choice Since 1978",
  "telephone": "+1 (877) 877-9957",
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
node scan.mjs https://canyonplumbing.com
```

A move to C-or-better (62/100 or above) is the acceptance test. If the score does
not move, the files did not deploy — check content-type on `/llms.txt`
(it must serve as `text/plain`, not an HTML error page).
