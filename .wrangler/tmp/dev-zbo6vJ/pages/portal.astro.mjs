globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../chunks/astro/server_DkNjeDPj.mjs';
import { $ as $$Portal } from '../chunks/Portal_BOkafQ1A.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  if (!Astro2.locals.user) {
    return Astro2.redirect("/login");
  }
  const supabase = Astro2.locals.supabase;
  const [{ data: profile }, { data: orders, error }] = await Promise.all([
    supabase.from("profiles").select("full_name, company, country, role").eq("id", Astro2.locals.user.id).maybeSingle(),
    supabase.from("orders").select("order_no, status, currency, total_amount, created_at").order("created_at", { ascending: false }).limit(20)
  ]);
  const statusLabel = {
    draft: "Draft",
    pending_payment: "Waiting for payment",
    paid: "Paid",
    purchasing: "Purchasing",
    at_warehouse: "At warehouse",
    consolidating: "Consolidating",
    shipped: "Shipped",
    delivered: "Delivered",
    closed: "Closed",
    cancelled: "Cancelled"
  };
  return renderTemplate`${renderComponent($$result, "Portal", $$Portal, { "title": "Portal", "user": Astro2.locals.user, "data-astro-cid-4d3t45dq": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 data-astro-cid-4d3t45dq>Your orders</h1> <p class="lede" data-astro-cid-4d3t45dq> ${profile?.company ? `${profile.company} \xB7 ` : ""}${profile?.country ? `${profile.country} \xB7 ` : ""}
Everything we buy, inspect and consolidate for you, with documents kept per order.
</p> ${error && renderTemplate`<div class="err" data-astro-cid-4d3t45dq>${error.message}</div>`}<div class="card" data-astro-cid-4d3t45dq> <h2 data-astro-cid-4d3t45dq>Orders</h2> ${orders && orders.length > 0 ? renderTemplate`<table data-astro-cid-4d3t45dq> <thead data-astro-cid-4d3t45dq> <tr data-astro-cid-4d3t45dq><th data-astro-cid-4d3t45dq>Order</th><th data-astro-cid-4d3t45dq>Status</th><th data-astro-cid-4d3t45dq>Placed</th><th class="num" data-astro-cid-4d3t45dq>Total</th></tr> </thead> <tbody data-astro-cid-4d3t45dq> ${orders.map((o) => renderTemplate`<tr data-astro-cid-4d3t45dq> <td data-astro-cid-4d3t45dq><a${addAttribute(`/portal/orders/${o.order_no}`, "href")} data-astro-cid-4d3t45dq>${o.order_no}</a></td> <td data-astro-cid-4d3t45dq>${statusLabel[o.status] ?? o.status}</td> <td data-astro-cid-4d3t45dq>${new Date(o.created_at).toISOString().slice(0, 10)}</td> <td class="num" data-astro-cid-4d3t45dq>${o.currency} ${Number(o.total_amount).toFixed(2)}</td> </tr>`)} </tbody> </table>` : renderTemplate`<p data-astro-cid-4d3t45dq>No orders yet. Send an enquiry and we will quote it — the order shows up here once we open it.</p>`} </div> <p class="fine" data-astro-cid-4d3t45dq>
Payment methods depend on your country. Need a channel that is not shown? <a href="/contact" data-astro-cid-4d3t45dq>Write to us</a>.
</p> ` })} `;
}, "C:/Users/Paco/DoubaoWork/chats/2026-11-10/new-chat/independent-site/src/pages/portal/index.astro", void 0);

const $$file = "C:/Users/Paco/DoubaoWork/chats/2026-11-10/new-chat/independent-site/src/pages/portal/index.astro";
const $$url = "/portal";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
