# Fix pack — timberlineplumbing.ca

Generated 2026-10-04T12:32:57.155Z from https://timberlineplumbing.ca

**11 fields marked TODO.** Those are facts I could not read off the public page.
Fill them in — do not let me or anyone else invent a phone number or an address.

## 1. `llms.txt` → upload to `https://timberlineplumbing.ca/llms.txt`

The root of the site, plain text, `text/plain`. This is the single highest-value
file in the pack: it is 12 of the 93 weighted points and it is the file assistants
read first.

```
# Timberline Plumbing

> Expert Plumbing & Heating Services

- Explore Our Services & Solutions
- We Are Available For 24/7 Emergency Service
- This Is How We Do It
- Recent Job Photos
- Meet Our Team
- What Our Clients Say About Us

## Pages

- [About Us](https://timberlineplumbing.ca/about-us)
- [Testimonials](https://timberlineplumbing.ca/timberline-plumbing)
- [Privacy Policy](https://timberlineplumbing.ca/privacy-policy)

## Contact

- Phone: 1.403.615.0791
- Email: timberlineplumbingltd@gmail.com
- Website: https://timberlineplumbing.ca
- TODO: street address, city, province, postal code

## Optional

- TODO: pricing, hours, service area, warranty terms — anything a customer would ask before calling.
```

## 2. `robots.txt` → append to the existing file at `https://timberlineplumbing.ca/robots.txt`

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

Sitemap: https://timberlineplumbing.ca/sitemap.xml
```

## 3. Schema.org JSON-LD → paste inside `<head>` on the homepage

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Timberline Plumbing",
  "url": "https://timberlineplumbing.ca",
  "description": "Expert Plumbing & Heating Services",
  "telephone": "1.403.615.0791",
  "email": "timberlineplumbingltd@gmail.com",
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
node scan.mjs https://timberlineplumbing.ca
```

A move to C-or-better (62/100 or above) is the acceptance test. If the score does
not move, the files did not deploy — check content-type on `/llms.txt`
(it must serve as `text/plain`, not an HTML error page).
