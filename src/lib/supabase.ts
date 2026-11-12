import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import type { AstroCookies } from 'astro';

type AnyLocals = { runtime?: { env?: Record<string, string | undefined> } } & Record<string, unknown>;

function readEnv(locals: AnyLocals | undefined) {
  const runtimeEnv = locals?.runtime?.env ?? {};
  const url = runtimeEnv.PUBLIC_SUPABASE_URL ?? import.meta.env.PUBLIC_SUPABASE_URL;
  const key = runtimeEnv.PUBLIC_SUPABASE_ANON_KEY ?? import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('缺少 PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY（本地放 .env，线上放 Pages 环境变量）');
  }
  return { url, key };
}

/**
 * 服务端 Supabase 客户端：登录态存在 cookie 里。
 * 用的是 publishable / anon key，权限完全由 RLS 决定——服务端没有绕过 RLS 的密钥。
 *
 * 读 cookie 走 request headers（Astro 的 cookies 没有 getAll），写 cookie 走 AstroCookies，
 * 这样 Set-Cookie 才会被框架带到响应里。
 */
export function createSupabaseServerClient(cookies: AstroCookies, requestHeaders: Headers, locals?: AnyLocals) {
  const { url, key } = readEnv(locals);

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return parseCookieHeader(requestHeaders.get('cookie') ?? '').map((c) => ({
          name: c.name ?? '',
          value: c.value ?? '',
        }));
      },
      setAll(list) {
        for (const { name, value, options } of list) {
          cookies.set(name, value, { ...(options as Record<string, unknown>), path: '/' });
        }
      },
    },
  });
}
