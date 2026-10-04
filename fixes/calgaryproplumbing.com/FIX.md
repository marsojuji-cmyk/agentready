# Fix pack — calgaryproplumbing.com

Generated 2026-10-04T12:33:11.698Z from https://calgaryproplumbing.com

**11 fields marked TODO.** Those are facts I could not read off the public page.
Fill them in — do not let me or anyone else invent a phone number or an address.

## 1. `llms.txt` → upload to `https://calgaryproplumbing.com/llms.txt`

The root of the site, plain text, `text/plain`. This is the single highest-value
file in the pack: it is 12 of the 93 weighted points and it is the file assistants
read first.

```
# Calgary Pro Plumbing and Renovation INC.

> Calgary Pro Plumbing and Renovation INC.

- Regular plumbing care will save your time & money
- Customer experience
- Company in numbers

## Pages

- [Emergency Plumbing](https://calgaryproplumbing.com/emergency-plumbing)
- [Backflow Preventers &#038; Basement Drains](https://calgaryproplumbing.com/backflow-preventers-and-basement-drains)
- [Drain Repair](https://calgaryproplumbing.com/drain-repair)
- [Faucet Repair](https://calgaryproplumbing.com/faucet-repair)
- [Frozen and Leaking Pipes](https://calgaryproplumbing.com/frozen-pipes-and-leaking-pipes)
- [Pipe Insulation](https://calgaryproplumbing.com/pipe-insulation)
- [Plumbing Leaks](https://calgaryproplumbing.com/plumbing-leaks)
- [Sewer Repair](https://calgaryproplumbing.com/sewer-repair)
- [Hot Water Dispensers](https://calgaryproplumbing.com/hot-water-dispensers)
- [Tankless Water Heaters](https://calgaryproplumbing.com/tankless-water-heater-repair)
- [Water Heaters](https://calgaryproplumbing.com/water-heaters)
- [Water Valves &#038; Shut Off](https://calgaryproplumbing.com/water-valves-and-water-shut-off)

## Contact

- Phone: 403-470-6575
- Email: calgaryproplumbing@gmail.com
- Website: https://calgaryproplumbing.com
- TODO: street address, city, province, postal code

## Optional

- TODO: pricing, hours, service area, warranty terms — anything a customer would ask before calling.
```

## 2. `robots.txt` → append to the existing file at `https://calgaryproplumbing.com/robots.txt`

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

Sitemap: https://calgaryproplumbing.com/sitemap.xml
```

## 3. Schema.org JSON-LD → paste inside `<head>` on the homepage

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Calgary Pro Plumbing and Renovation INC.",
  "url": "https://calgaryproplumbing.com",
  "description": "Calgary Pro Plumbing and Renovation INC.",
  "telephone": "403-470-6575",
  "email": "calgaryproplumbing@gmail.com",
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
node scan.mjs https://calgaryproplumbing.com
```

A move to C-or-better (62/100 or above) is the acceptance test. If the score does
not move, the files did not deploy — check content-type on `/llms.txt`
(it must serve as `text/plain`, not an HTML error page).
