# Fix pack — mrmikesplumbing.ca

Generated 2026-10-04T12:32:57.017Z from https://mrmikesplumbing.ca

**7 fields marked TODO.** Those are facts I could not read off the public page.
Fill them in — do not let me or anyone else invent a phone number or an address.

## 1. `llms.txt` → upload to `https://mrmikesplumbing.ca/llms.txt`

The root of the site, plain text, `text/plain`. This is the single highest-value
file in the pack: it is 12 of the 93 weighted points and it is the file assistants
read first.

```
# Plumber Calgary

> Mr. Mike&#039;s Plumbing is here 24/7 for emergency plumbing, drains, water heaters, furnaces and HVAC service across Calgary and nearby communities.

- How We Work At Mr. Mike's Plumbing Calgary
- Our Plumbing Services
- Our HVAC Services
- Looking For The Best Plumber In Calgary? Look No Further!
- Mr. Mike's Plumbing Service Areas

## Pages

- [JOIN OUR TEAM](https://mrmikesplumbing.ca/join-our-team)
- [Our Services](https://mrmikesplumbing.ca/our-services)
- [AC Repair Calgary](https://mrmikesplumbing.ca/ac-repair-calgary)
- [Air Conditioning Services](https://mrmikesplumbing.ca/air-conditioning-services-calgary)
- [Calgary Furnace Repair](https://mrmikesplumbing.ca/calgary-furnace-repair)
- [Calgary Furnace Services](https://mrmikesplumbing.ca/furnace-services-calgary)
- [Gas Line Installation &#038; Repair](https://mrmikesplumbing.ca/gas-line-installation-repair)
- [Residential Plumbing](https://mrmikesplumbing.ca/residential-plumbing-calgary)
- [Bathtub Installation](https://mrmikesplumbing.ca/bathtub-installation-in-calgary)
- [Clogged Drain Repair](https://mrmikesplumbing.ca/clogged-drain-repair-calgary)
- [Drain Cleaning Calgary](https://mrmikesplumbing.ca/drain-cleaning-services)
- [Sewer Drain Cleaning](https://mrmikesplumbing.ca/sewer-drain-cleaning-calgary)

## Contact

- Phone: +14035202040
- Email: general@mrmikesplumbing.ca
- Website: https://mrmikesplumbing.ca
- Address: 918 16 Ave NW #187, Calgary, AB, T2M 0K3

## Optional

- TODO: pricing, hours, service area, warranty terms — anything a customer would ask before calling.
```

## 2. `robots.txt` → append to the existing file at `https://mrmikesplumbing.ca/robots.txt`

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

Sitemap: https://mrmikesplumbing.ca/sitemap.xml
```

## 3. Schema.org JSON-LD → paste inside `<head>` on the homepage

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Plumber Calgary",
  "url": "https://mrmikesplumbing.ca",
  "description": "Mr. Mike&#039;s Plumbing is here 24/7 for emergency plumbing, drains, water heaters, furnaces and HVAC service across Calgary and nearby communities.",
  "telephone": "+14035202040",
  "email": "general@mrmikesplumbing.ca",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "918 16 Ave NW #187",
    "addressLocality": "Calgary",
    "addressRegion": "AB",
    "postalCode": "T2M 0K3",
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
node scan.mjs https://mrmikesplumbing.ca
```

A move to C-or-better (62/100 or above) is the acceptance test. If the score does
not move, the files did not deploy — check content-type on `/llms.txt`
(it must serve as `text/plain`, not an HTML error page).
