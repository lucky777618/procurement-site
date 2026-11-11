// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// 静态营销页放在 public/，由 Pages 直接返回；
// /login、/signup、/portal、/admin、/api/* 走 SSR（Workers）。
export default defineConfig({
  output: 'server',
  adapter: cloudflare({ imageService: 'passthrough' }),
  devToolbar: { enabled: false },
});
