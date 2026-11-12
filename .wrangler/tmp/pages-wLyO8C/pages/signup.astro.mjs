globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../chunks/astro/server_DkNjeDPj.mjs';
import { $ as $$Portal } from '../chunks/Portal_BOkafQ1A.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Signup = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Signup;
  const error = Astro2.url.searchParams.get("error") ?? "";
  const email = Astro2.url.searchParams.get("email") ?? "";
  const company = Astro2.url.searchParams.get("company") ?? "";
  const country = Astro2.url.searchParams.get("country") ?? "";
  const done = Astro2.url.searchParams.get("done") === "1";
  return renderTemplate`${renderComponent($$result, "Portal", $$Portal, { "title": "Create account", "user": Astro2.locals.user }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1>Create your account</h1> <p class="lede">One account for quotes, orders and shipment tracking. We use it to keep every document for your order in one place.</p> ${done ? renderTemplate`<div class="card"> <h2>Check your inbox</h2> <p>We sent a confirmation link to the address you entered. Click it, then <a href="/login">sign in</a>.</p> </div>` : renderTemplate`<form method="post" action="/api/auth/signup" class="card"> ${error && renderTemplate`<div class="err">${error}</div>`} <label for="email">Email</label> <input id="email" name="email" type="email" required${addAttribute(email, "value")} autocomplete="email"> <label for="password">Password</label> <input id="password" name="password" type="password" required minlength="8" autocomplete="new-password"> <label for="company">Company (optional)</label> <input id="company" name="company"${addAttribute(company, "value")} autocomplete="organization"> <label for="country">Country (ISO code, e.g. RU)</label> <input id="country" name="country"${addAttribute(country, "value")} maxlength="2" autocomplete="country"> <button type="submit">Create account</button> </form>`}<p class="fine">Already registered? <a href="/login">Sign in</a>.</p> ` })}`;
}, "C:/Users/Paco/DoubaoWork/chats/2026-11-10/new-chat/independent-site/src/pages/signup.astro", void 0);

const $$file = "C:/Users/Paco/DoubaoWork/chats/2026-11-10/new-chat/independent-site/src/pages/signup.astro";
const $$url = "/signup";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Signup,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
