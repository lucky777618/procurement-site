import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals, redirect }) => {
  await locals.supabase.auth.signOut();
  return redirect('/', 303);
};

export const POST = GET;
