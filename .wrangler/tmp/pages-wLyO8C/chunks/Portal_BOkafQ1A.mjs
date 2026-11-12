globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, l as renderHead, r as renderTemplate, n as renderSlot, h as createAstro } from './astro/server_DkNjeDPj.mjs';
/* empty css                         */

const $$Astro = createAstro();
const $$Portal = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Portal;
  const { title = "Lucky7Link", user = null } = Astro2.props;
  return renderTemplate`<html lang="en" data-astro-cid-kh4pan3y> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${title} · Lucky7Link</title><link rel="preload" href="/assets/fonts/archivo-latin-600.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/assets/css/style.css">${renderHead()}</head> <body class="portal" data-astro-cid-kh4pan3y> <div class="shell" data-astro-cid-kh4pan3y> <div class="bar" data-astro-cid-kh4pan3y> <a href="/" data-astro-cid-kh4pan3y>Lucky7Link</a> ${user ? renderTemplate`<span class="who" data-astro-cid-kh4pan3y>${user.email} · <a href="/portal" data-astro-cid-kh4pan3y>Portal</a> · <a href="/api/auth/signout" data-astro-cid-kh4pan3y>Sign out</a></span>` : renderTemplate`<span class="who" data-astro-cid-kh4pan3y>Customer portal</span>`} </div> ${renderSlot($$result, $$slots["default"])} </div> </body></html>`;
}, "C:/Users/Paco/DoubaoWork/chats/2026-11-10/new-chat/independent-site/src/layouts/Portal.astro", void 0);

export { $$Portal as $ };
