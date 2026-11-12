globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../chunks/astro/server_DkNjeDPj.mjs';
import { $ as $$Portal } from '../chunks/Portal_BOkafQ1A.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Login = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Login;
  const error = Astro2.url.searchParams.get("error") ?? "";
  const email = Astro2.url.searchParams.get("email") ?? "";
  return renderTemplate`${renderComponent($$result, "Portal", $$Portal, { "title": "Sign in", "user": Astro2.locals.user }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1>Sign in</h1> <p class="lede">Track your orders, upload payment receipts and follow shipments from here.</p> <form method="post" action="/api/auth/signin" class="card"> ${error && renderTemplate`<div class="err">${error}</div>`} <label for="email">Email</label> <input id="email" name="email" type="email" required${addAttribute(email, "value")} autocomplete="email"> <label for="password">Password</label> <input id="password" name="password" type="password" required autocomplete="current-password"> <button type="submit">Sign in</button> </form> <p class="fine">No account yet? <a href="/signup">Create one</a>.</p> ` })}`;
}, "C:/Users/Paco/DoubaoWork/chats/2026-11-10/new-chat/independent-site/src/pages/login.astro", void 0);

const $$file = "C:/Users/Paco/DoubaoWork/chats/2026-11-10/new-chat/independent-site/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
