import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const form = await request.formData();
  const email = String(form.get('email') ?? '').trim();
  const password = String(form.get('password') ?? '');
  const company = String(form.get('company') ?? '').trim();
  const country = String(form.get('country') ?? '').trim().toUpperCase();

  if (!email || password.length < 8) {
    return redirect('/signup?error=' + encodeURIComponent('Email and a password of at least 8 characters are required.') + '&email=' + encodeURIComponent(email));
  }

  const { data, error } = await locals.supabase.auth.signUp({
    email,
    password,
    options: { data: { company: company || null, country: country || null } },
  });

  if (error) {
    return redirect('/signup?error=' + encodeURIComponent(error.message) + '&email=' + encodeURIComponent(email));
  }

  // 邮箱确认开着时没有 session，提示去收信；关着时直接进门户。
  if (!data.session) {
    return redirect('/signup?done=1', 303);
  }

  if (company || country) {
    await locals.supabase
      .from('profiles')
      .update({ company: company || null, country: country || null })
      .eq('id', data.user!.id);
  }

  return redirect('/portal', 303);
};
