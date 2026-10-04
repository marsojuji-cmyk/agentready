# Fix pack — thegentlemenpros.com

Generated 2026-10-04T12:33:12.826Z from https://thegentlemenpros.com

**9 fields marked TODO.** Those are facts I could not read off the public page.
Fill them in — do not let me or anyone else invent a phone number or an address.

## 1. `llms.txt` → upload to `https://thegentlemenpros.com/llms.txt`

The root of the site, plain text, `text/plain`. This is the single highest-value
file in the pack: it is 12 of the 93 weighted points and it is the file assistants
read first.

```
# Your Local Plumbing, Heating, HVAC & Electrical Experts

> The Gentlemen Pros provides plumbing, heating, HVAC, air conditioning, and electrical services in Calgary, Edmonton &amp; Red Deer. Book trusted home service pros for repairs, installs, and upgrades.

- Call & Book
- Plumbing, Heating & Electrical With Old-School Professionalism
- Our Service Process
- Respectful Service, Reliable Results
- 00 +
- Meet Our Pros
- Promos & Service Reminders
- Helpful Guides From The Pros

## Pages

- [Calgary](https://thegentlemenpros.com/calgary)
- [Edmonton](https://thegentlemenpros.com/edmonton)
- [Red Deer](https://thegentlemenpros.com/red-deer)
- [Plumbing](https://thegentlemenpros.com/calgary/plumbers)
- [Water Supply & Piping](https://thegentlemenpros.com/calgary/plumbers/water-supply-piping)
- [Drains & Sewer](https://thegentlemenpros.com/calgary/plumbers/drains-sewer)
- [Fixtures & Faucets](https://thegentlemenpros.com/calgary/plumbers/fixtures-faucets)
- [Hot Water Systems](https://thegentlemenpros.com/calgary/plumbers/hot-water-systems)
- [Gas Lines & Appliances](https://thegentlemenpros.com/calgary/plumbers/gas-lines-appliances)
- [Emergency & Repair Services](https://thegentlemenpros.com/calgary/plumbers/plumbing-emergency-repairs)
- [Maintenance & Inspections](https://thegentlemenpros.com/calgary/plumbers/plumbing-maintenance-inspections)
- [Sump Pumps & Drainage](https://thegentlemenpros.com/calgary/plumbers/sump-pumps-drainage)

## Contact

- Phone: +14037709075
- TODO: email — a business email, not a no-reply
- Website: https://thegentlemenpros.com
- Address: 5355 8 St NE, Calgary, Alberta, T2K 5R9

## Optional

- TODO: pricing, hours, service area, warranty terms — anything a customer would ask before calling.
```

## 2. `robots.txt` → append to the existing file at `https://thegentlemenpros.com/robots.txt`

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

Sitemap: https://thegentlemenpros.com/sitemap.xml
```

## 3. Schema.org JSON-LD → paste inside `<head>` on the homepage

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Your Local Plumbing, Heating, HVAC & Electrical Experts",
  "url": "https://thegentlemenpros.com",
  "description": "The Gentlemen Pros provides plumbing, heating, HVAC, air conditioning, and electrical services in Calgary, Edmonton &amp; Red Deer. Book trusted home service pros for repairs, installs, and upgrades.",
  "telephone": "+14037709075",
  "email": "TODO",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "5355 8 St NE",
    "addressLocality": "Calgary",
    "addressRegion": "Alberta",
    "postalCode": "T2K 5R9",
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
node scan.mjs https://thegentlemenpros.com
```

A move to C-or-better (62/100 or above) is the acceptance test. If the score does
not move, the files did not deploy — check content-type on `/llms.txt`
(it must serve as `text/plain`, not an HTML error page).
