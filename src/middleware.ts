import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServerClient } from './lib/supabase';

// 每个 SSR 请求都建一个带 cookie 的 Supabase 客户端，顺手刷新会话。
export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.supabase = createSupabaseServerClient(context.cookies, context.locals);
  const { data } = await context.locals.supabase.auth.getUser();
  context.locals.user = data?.user ? { id: data.user.id, email: data.user.email ?? undefined } : null;
  return next();
});
