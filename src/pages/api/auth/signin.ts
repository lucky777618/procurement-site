import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const form = await request.formData();
  const email = String(form.get('email') ?? '').trim();
  const password = String(form.get('password') ?? '');

  if (!email || !password) {
    return redirect('/login?error=' + encodeURIComponent('Email and password are required.'));
  }

  const { error } = await locals.supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return redirect('/login?error=' + encodeURIComponent(error.message) + '&email=' + encodeURIComponent(email));
  }

  return redirect('/portal', 303);
};
