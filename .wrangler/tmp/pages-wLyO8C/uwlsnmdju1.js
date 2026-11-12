// <define:__ROUTES__>
var define_ROUTES_default = {
  version: 1,
  include: [
    "/*"
  ],
  exclude: [
    "/_astro/*",
    "/404.html",
    "/contact.html",
    "/faq.html",
    "/index.html",
    "/pricing.html",
    "/privacy.html",
    "/robots.txt",
    "/services.html",
    "/sitemap.xml",
    "/assets/fonts/archivo-400.woff2",
    "/assets/fonts/archivo-600.woff2",
    "/assets/fonts/archivo-700.woff2",
    "/assets/fonts/plexmono-400.woff2",
    "/assets/fonts/plexmono-500.woff2",
    "/assets/css/style.css",
    "/assets/js/site.js",
    "/assets/img/og-cover.png"
  ]
};

// node_modules/wrangler/templates/pages-dev-pipeline.ts
import worker from "C:\\Users\\Paco\\DoubaoWork\\chats\\2026-11-10\\new-chat\\independent-site\\.wrangler\\tmp\\pages-wLyO8C\\bundledWorker-0.6899986381359735.mjs";
import { isRoutingRuleMatch } from "C:\\Users\\Paco\\DoubaoWork\\chats\\2026-11-10\\new-chat\\independent-site\\node_modules\\wrangler\\templates\\pages-dev-util.ts";
export * from "C:\\Users\\Paco\\DoubaoWork\\chats\\2026-11-10\\new-chat\\independent-site\\.wrangler\\tmp\\pages-wLyO8C\\bundledWorker-0.6899986381359735.mjs";
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        const workerAsHandler = worker;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  pages_dev_pipeline_default as default
};
//# sourceMappingURL=uwlsnmdju1.js.map
