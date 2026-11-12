import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServerClient } from './lib/supabase';

// 每个 SSR 请求都建一个带 cookie 的 Supabase 客户端，顺手刷新会话。
export const onRequest = defineMiddleware(async (context, next) => {
  let setupError: Error | null = null;

  try {
    context.locals.supabase = createSupabaseServerClient(context.cookies, context.locals);
    const { data } = await context.locals.supabase.auth.getUser();
    context.locals.user = data?.user ? { id: data.user.id, email: data.user.email ?? undefined } : null;
  } catch (e) {
    setupError = e instanceof Error ? e : new Error(String(e));
    context.locals.supabase = null;
    context.locals.user = null;
  }

  context.locals.setupError = setupError ? `${setupError.message}` : null;

  // 诊断页需要拿到真实异常，而不是一个 500 白页。
  if (setupError && context.url.pathname === '/_diag') {
    return new Response(
      JSON.stringify({ stage: 'middleware', message: setupError.message, stackTop: (setupError.stack ?? '').split('\n').slice(0, 4) }, null, 2),
      { status: 200, headers: { 'content-type': 'application/json; charset=utf-8' } },
    );
  }

  return next();
});
