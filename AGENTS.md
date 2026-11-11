# AGENTS.md

Working agreement for anyone (human or AI) changing this repository.
Read this before your first edit; it exists so two agents can work on the same
site without overwriting each other.

## The project in one line

Static marketing site for lucky7link.com — a China sourcing and consolidation service
for overseas importers. HTML, CSS, JS, no framework, no build step.

**Phase 2 is approved and documented in `docs/PLAN.md`.** The site is being upgraded to
Astro SSR + Cloudflare Pages + Supabase (accounts, orders, admin, payments). Installation
steps live in `docs/SETUP.md`, the database schema in `supabase/schema.sql`. Until the
migration commit lands, this directory is still the plain static site — do not start the
migration by hand.

## Hard rules

1. **No build tooling in phase 1.** Do not introduce npm, bundlers, frameworks or a
   `package.json` while this directory is still the static site. The phase-2 stack
   (Astro, Supabase, payment adapters) is pre-approved by `docs/PLAN.md`; anything
   outside that stack still needs agreement first.
2. **No external runtime dependencies.** Fonts are self-hosted in `assets/fonts/`.
   Do not add CDN scripts, analytics, pixels, or cookie banners.
3. **Pages stay self-contained.** Each page carries its own header and footer markup —
   that is intentional duplication in exchange for zero tooling. If you change the nav,
   change it in all seven HTML files.
4. **Do not invent facts.** No fake testimonials, client logos, certifications, order
   counts, or staff photos. Pricing exists only as the values already written down;
   change them only with the owner's explicit instruction.
5. **Do not add fake buttons.** Every `a` and `button` must navigate, submit, or toggle
   something real.
6. **Mobile first.** Write new CSS for the 375 px case, then extend inside
   `@media (min-width: 48rem)` or `60rem`.
7. **Tokens only.** Colours, font stacks and spacing come from `:root` in
   `assets/css/style.css`.

## File ownership (keeps parallel edits collision-free)

| Area | Owner | Everyone else |
| --- | --- | --- |
| `assets/css/style.css`, `assets/js/site.js` | code owner | propose changes, do not rewrite wholesale |
| `*.html` page copy | content owner | small edits fine, mention them in the commit message |
| `README.md`, `AGENTS.md` | shared | update when the agreement changes |
| `tools/`, `assets/img/` | shared | regenerate, do not hand-edit binaries |

If two people must touch the same file, work on separate branches and merge with a
pull request rather than editing in place at the same time.

## Voice and copy

- English, sentence case, active voice, no exclamation marks, no emoji.
- Say what happens, not how good it is. "Quote back within 24 hours" beats "lightning-fast".
- Numbers carry two decimals in money cells and match across pages. The worked example
  in `pricing.html` and the manifest card on `index.html` describe the same order — if
  you change one, change both.

## Common tasks

```powershell
# preview
python -m http.server 4321

# regenerate the social cover after a headline change
python tools/make_og.py
```

Deployment is handled by Cloudflare Pages on push to `main`. There is nothing to run
locally to deploy.

## Definition of done

- Page renders at 375 px, 768 px and 1280 px widths without horizontal scroll.
- Every interactive element responds (nav, FAQ accordion, form validation).
- `sitemap.xml` and `robots.txt` still match the set of pages.
- Nothing false is claimed about the business.
