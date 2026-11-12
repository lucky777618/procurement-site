globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, locals, redirect }) => {
  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || !password) {
    return redirect("/login?error=" + encodeURIComponent("Email and password are required."));
  }
  const { error } = await locals.supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return redirect("/login?error=" + encodeURIComponent(error.message) + "&email=" + encodeURIComponent(email));
  }
  return redirect("/portal", 303);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
