# Lucky7Link — independent site

Static marketing site for **lucky7link.com**: a sourcing, inspection and consolidation
desk in Dongguan selling to overseas small and mid-sized importers.

No build step, no framework, no runtime. Plain HTML + one CSS file + one JS file, served
straight from Cloudflare Pages.

## What is in here

```
index.html          Home: hero, four services, four-step process, fee tiers, FAQ excerpts
services.html       The four services in depth, plus "what we do not do"
pricing.html        Fee table, included/excluded, worked landed-cost example, payment flow
faq.html            Buying, quality, shipping and customs questions
contact.html        Quote request form + direct contact channels
privacy.html        Short privacy notice (no cookies, no trackers)
404.html            Not-found page
robots.txt          Crawl rules + sitemap reference
sitemap.xml         Five indexable pages
_headers            Cloudflare Pages cache and security headers
assets/css/style.css
assets/js/site.js   Nav toggle, FAQ accordion, form submit (endpoint configurable)
assets/fonts/       Self-hosted Archivo + IBM Plex Mono (woff2, 72 KB total)
assets/img/og-cover.png
tools/make_og.py    Regenerates the social cover if the wording changes
```

## Preview locally

```powershell
cd C:\Users\Paco\DoubaoWork\chats\2026-11-10\new-chat\independent-site
python -m http.server 4321
```

Then open http://localhost:4321 — file:// works too, but relative paths behave better over http.

## Deploy (Cloudflare Pages)

1. Push this repo to a private GitHub repository.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick the repo.
3. Build command: **none**. Output directory: **`/`** (or leave default; there is no build).
4. After the first deploy: Custom domains → add `lucky7link.com` and `www.lucky7link.com`.
   DNS records are created automatically because the domain is already on Cloudflare DNS.
5. Redirect `www` → apex (or the reverse, but pick one) in Cloudflare Rules.

`_headers` is picked up automatically by Pages — do not rename it.

## Before this goes live

These are real gaps, not polish:

| Item | Where | Notes |
| --- | --- | --- |
| Quote form endpoint | `assets/js/site.js` `L7L_CONFIG.formEndpoint` | Until set, the form tells visitors to email instead. Web3Forms or Formspree both work; add the key to `accessKey`. |
| Inbox | Cloudflare Email Routing | Free. Route `hello@` and `quote@` to your real mailbox. |
| Pricing | `pricing.html`, tier cards on `index.html` | Current numbers are a starting proposal (9% / 7% / 5%, $60 floor). Confirm before launch. |
| Copy review | every page | Written as a draft in English. Check claims you can actually keep — especially the 24-hour quote and the "no commission from suppliers" line. |
| Real photos | none yet | The site is deliberately typographic; one real photo of packed cartons in your warehouse would strengthen `services.html#consolidation`. |
| Legal identity | footer | Add the registered company name and address once decided; some markets expect it on a B2B site. |

## Conventions

- Mobile-first CSS. Base rules target 375 px; desktop is added in `@media (min-width: 48rem)`.
- Colours and type come from the token block at the top of `style.css`. Do not invent new hex values.
- All copy is in English, sentence case, no exclamation marks, no emoji.
- Prices are written with two decimals in mono cells. Keep the worked example internally consistent
  if you change any unit price.
- Every link and button must do something real. No placeholder `href="#"`.
