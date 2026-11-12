globalThis.process ??= {}; globalThis.process.env ??= {};
import { o as decodeKey } from './chunks/astro/server_DkNjeDPj.mjs';
import './chunks/astro-designed-error-pages_Cknbv_d1.mjs';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_D0YxyBfh.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/Paco/DoubaoWork/chats/2026-11-10/new-chat/independent-site/","cacheDir":"file:///C:/Users/Paco/DoubaoWork/chats/2026-11-10/new-chat/independent-site/node_modules/.astro/","outDir":"file:///C:/Users/Paco/DoubaoWork/chats/2026-11-10/new-chat/independent-site/dist/","srcDir":"file:///C:/Users/Paco/DoubaoWork/chats/2026-11-10/new-chat/independent-site/src/","publicDir":"file:///C:/Users/Paco/DoubaoWork/chats/2026-11-10/new-chat/independent-site/public/","buildClientDir":"file:///C:/Users/Paco/DoubaoWork/chats/2026-11-10/new-chat/independent-site/dist/","buildServerDir":"file:///C:/Users/Paco/DoubaoWork/chats/2026-11-10/new-chat/independent-site/dist/_worker.js/","adapterName":"@astrojs/cloudflare","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/signin","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/signin\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"signin","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/signin.ts","pathname":"/api/auth/signin","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/signout","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/signout\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"signout","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/signout.ts","pathname":"/api/auth/signout","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/signup","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/signup\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"signup","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/signup.ts","pathname":"/api/auth/signup","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"inline","content":":root{--ink: #0f1a1c;--paper: #f3f4f0;--gold: #d99e26;--rust: #a8482c;--line: rgba(15, 26, 28, .14)}body.portal{margin:0;background:var(--paper);color:var(--ink);font-family:Archivo,system-ui,sans-serif;line-height:1.55}.shell[data-astro-cid-kh4pan3y]{max-width:980px;margin:0 auto;padding:24px 20px 72px}.bar[data-astro-cid-kh4pan3y]{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 0 18px;border-bottom:1px solid var(--line);font-family:IBM Plex Mono,ui-monospace,monospace;font-size:13px;letter-spacing:.04em;text-transform:uppercase}.bar[data-astro-cid-kh4pan3y] a[data-astro-cid-kh4pan3y]{color:var(--ink);text-decoration:none}.bar[data-astro-cid-kh4pan3y] .who[data-astro-cid-kh4pan3y]{opacity:.7;text-transform:none;letter-spacing:0}.card[data-astro-cid-kh4pan3y]{background:#fff;border:1px solid var(--line);padding:22px;margin-top:22px}.card[data-astro-cid-kh4pan3y] h2[data-astro-cid-kh4pan3y]{font-size:15px;letter-spacing:.08em;text-transform:uppercase;margin:0 0 12px}h1[data-astro-cid-kh4pan3y]{font-size:clamp(26px,4vw,38px);line-height:1.15;margin:28px 0 10px;letter-spacing:-.02em}.lede[data-astro-cid-kh4pan3y]{max-width:58ch;opacity:.78;margin:0 0 22px}label[data-astro-cid-kh4pan3y]{display:block;font-size:13px;letter-spacing:.06em;text-transform:uppercase;margin:16px 0 6px}input[data-astro-cid-kh4pan3y]{width:100%;box-sizing:border-box;padding:12px 14px;font-size:16px;border:1px solid var(--line);background:#fff;color:var(--ink)}button[data-astro-cid-kh4pan3y]{margin-top:22px;width:100%;padding:14px;font-size:15px;cursor:pointer;background:var(--ink);color:var(--paper);border:0;letter-spacing:.05em;text-transform:uppercase;font-family:IBM Plex Mono,ui-monospace,monospace}button[data-astro-cid-kh4pan3y]:hover{background:#22343a}.err[data-astro-cid-kh4pan3y]{border-left:3px solid var(--rust);padding:10px 14px;background:#fff;margin:18px 0 0;font-size:14px}.fine[data-astro-cid-kh4pan3y]{font-size:14px;opacity:.72;margin-top:18px}.fine[data-astro-cid-kh4pan3y] a[data-astro-cid-kh4pan3y]{color:var(--rust)}\n"}],"routeData":{"route":"/login","isIndex":false,"type":"page","pattern":"^\\/login\\/?$","segments":[[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/login.astro","pathname":"/login","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"inline","content":":root{--ink: #0f1a1c;--paper: #f3f4f0;--gold: #d99e26;--rust: #a8482c;--line: rgba(15, 26, 28, .14)}body.portal{margin:0;background:var(--paper);color:var(--ink);font-family:Archivo,system-ui,sans-serif;line-height:1.55}.shell[data-astro-cid-kh4pan3y]{max-width:980px;margin:0 auto;padding:24px 20px 72px}.bar[data-astro-cid-kh4pan3y]{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 0 18px;border-bottom:1px solid var(--line);font-family:IBM Plex Mono,ui-monospace,monospace;font-size:13px;letter-spacing:.04em;text-transform:uppercase}.bar[data-astro-cid-kh4pan3y] a[data-astro-cid-kh4pan3y]{color:var(--ink);text-decoration:none}.bar[data-astro-cid-kh4pan3y] .who[data-astro-cid-kh4pan3y]{opacity:.7;text-transform:none;letter-spacing:0}.card[data-astro-cid-kh4pan3y]{background:#fff;border:1px solid var(--line);padding:22px;margin-top:22px}.card[data-astro-cid-kh4pan3y] h2[data-astro-cid-kh4pan3y]{font-size:15px;letter-spacing:.08em;text-transform:uppercase;margin:0 0 12px}h1[data-astro-cid-kh4pan3y]{font-size:clamp(26px,4vw,38px);line-height:1.15;margin:28px 0 10px;letter-spacing:-.02em}.lede[data-astro-cid-kh4pan3y]{max-width:58ch;opacity:.78;margin:0 0 22px}label[data-astro-cid-kh4pan3y]{display:block;font-size:13px;letter-spacing:.06em;text-transform:uppercase;margin:16px 0 6px}input[data-astro-cid-kh4pan3y]{width:100%;box-sizing:border-box;padding:12px 14px;font-size:16px;border:1px solid var(--line);background:#fff;color:var(--ink)}button[data-astro-cid-kh4pan3y]{margin-top:22px;width:100%;padding:14px;font-size:15px;cursor:pointer;background:var(--ink);color:var(--paper);border:0;letter-spacing:.05em;text-transform:uppercase;font-family:IBM Plex Mono,ui-monospace,monospace}button[data-astro-cid-kh4pan3y]:hover{background:#22343a}.err[data-astro-cid-kh4pan3y]{border-left:3px solid var(--rust);padding:10px 14px;background:#fff;margin:18px 0 0;font-size:14px}.fine[data-astro-cid-kh4pan3y]{font-size:14px;opacity:.72;margin-top:18px}.fine[data-astro-cid-kh4pan3y] a[data-astro-cid-kh4pan3y]{color:var(--rust)}\ntable[data-astro-cid-4d3t45dq]{width:100%;border-collapse:collapse;font-size:15px}th[data-astro-cid-4d3t45dq],td[data-astro-cid-4d3t45dq]{text-align:left;padding:10px 8px;border-bottom:1px solid rgba(15,26,28,.1)}th[data-astro-cid-4d3t45dq]{font-family:IBM Plex Mono,ui-monospace,monospace;font-size:12px;letter-spacing:.06em;text-transform:uppercase;opacity:.7}.num[data-astro-cid-4d3t45dq]{text-align:right;font-variant-numeric:tabular-nums}a[data-astro-cid-4d3t45dq]{color:#a8482c}\n"}],"routeData":{"route":"/portal","isIndex":true,"type":"page","pattern":"^\\/portal\\/?$","segments":[[{"content":"portal","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/portal/index.astro","pathname":"/portal","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"inline","content":":root{--ink: #0f1a1c;--paper: #f3f4f0;--gold: #d99e26;--rust: #a8482c;--line: rgba(15, 26, 28, .14)}body.portal{margin:0;background:var(--paper);color:var(--ink);font-family:Archivo,system-ui,sans-serif;line-height:1.55}.shell[data-astro-cid-kh4pan3y]{max-width:980px;margin:0 auto;padding:24px 20px 72px}.bar[data-astro-cid-kh4pan3y]{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 0 18px;border-bottom:1px solid var(--line);font-family:IBM Plex Mono,ui-monospace,monospace;font-size:13px;letter-spacing:.04em;text-transform:uppercase}.bar[data-astro-cid-kh4pan3y] a[data-astro-cid-kh4pan3y]{color:var(--ink);text-decoration:none}.bar[data-astro-cid-kh4pan3y] .who[data-astro-cid-kh4pan3y]{opacity:.7;text-transform:none;letter-spacing:0}.card[data-astro-cid-kh4pan3y]{background:#fff;border:1px solid var(--line);padding:22px;margin-top:22px}.card[data-astro-cid-kh4pan3y] h2[data-astro-cid-kh4pan3y]{font-size:15px;letter-spacing:.08em;text-transform:uppercase;margin:0 0 12px}h1[data-astro-cid-kh4pan3y]{font-size:clamp(26px,4vw,38px);line-height:1.15;margin:28px 0 10px;letter-spacing:-.02em}.lede[data-astro-cid-kh4pan3y]{max-width:58ch;opacity:.78;margin:0 0 22px}label[data-astro-cid-kh4pan3y]{display:block;font-size:13px;letter-spacing:.06em;text-transform:uppercase;margin:16px 0 6px}input[data-astro-cid-kh4pan3y]{width:100%;box-sizing:border-box;padding:12px 14px;font-size:16px;border:1px solid var(--line);background:#fff;color:var(--ink)}button[data-astro-cid-kh4pan3y]{margin-top:22px;width:100%;padding:14px;font-size:15px;cursor:pointer;background:var(--ink);color:var(--paper);border:0;letter-spacing:.05em;text-transform:uppercase;font-family:IBM Plex Mono,ui-monospace,monospace}button[data-astro-cid-kh4pan3y]:hover{background:#22343a}.err[data-astro-cid-kh4pan3y]{border-left:3px solid var(--rust);padding:10px 14px;background:#fff;margin:18px 0 0;font-size:14px}.fine[data-astro-cid-kh4pan3y]{font-size:14px;opacity:.72;margin-top:18px}.fine[data-astro-cid-kh4pan3y] a[data-astro-cid-kh4pan3y]{color:var(--rust)}\n"}],"routeData":{"route":"/signup","isIndex":false,"type":"page","pattern":"^\\/signup\\/?$","segments":[[{"content":"signup","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/signup.astro","pathname":"/signup","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/Paco/DoubaoWork/chats/2026-11-10/new-chat/independent-site/src/pages/login.astro",{"propagation":"none","containsHead":true}],["C:/Users/Paco/DoubaoWork/chats/2026-11-10/new-chat/independent-site/src/pages/portal/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/Paco/DoubaoWork/chats/2026-11-10/new-chat/independent-site/src/pages/signup.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astro-page:src/pages/api/auth/signin@_@ts":"pages/api/auth/signin.astro.mjs","\u0000@astro-page:src/pages/api/auth/signout@_@ts":"pages/api/auth/signout.astro.mjs","\u0000@astro-page:src/pages/api/auth/signup@_@ts":"pages/api/auth/signup.astro.mjs","\u0000@astro-page:src/pages/login@_@astro":"pages/login.astro.mjs","\u0000@astro-page:src/pages/portal/index@_@astro":"pages/portal.astro.mjs","\u0000@astro-page:src/pages/signup@_@astro":"pages/signup.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"index.js","\u0000@astro-renderers":"renderers.mjs","\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_DdCq9Pel.mjs","C:/Users/Paco/DoubaoWork/chats/2026-11-10/new-chat/independent-site/node_modules/astro/dist/assets/services/noop.js":"chunks/noop_BpHR5zb1.mjs","C:/Users/Paco/DoubaoWork/chats/2026-11-10/new-chat/independent-site/node_modules/unstorage/drivers/cloudflare-kv-binding.mjs":"chunks/cloudflare-kv-binding_hV136--Z.mjs","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/404.html","/contact.html","/faq.html","/index.html","/pricing.html","/privacy.html","/robots.txt","/services.html","/sitemap.xml","/_headers","/_worker.js/index.js","/_worker.js/noop-entrypoint.mjs","/_worker.js/renderers.mjs","/_worker.js/_@astrojs-ssr-adapter.mjs","/_worker.js/_astro-internal_middleware.mjs","/assets/fonts/archivo-400.woff2","/assets/fonts/archivo-600.woff2","/assets/fonts/archivo-700.woff2","/assets/fonts/plexmono-400.woff2","/assets/fonts/plexmono-500.woff2","/assets/css/style.css","/assets/img/og-cover.png","/assets/js/site.js","/_worker.js/chunks/astro-designed-error-pages_Cknbv_d1.mjs","/_worker.js/chunks/astro_BQX0jCvv.mjs","/_worker.js/chunks/cloudflare-kv-binding_hV136--Z.mjs","/_worker.js/chunks/generic_CGbyGZ-M.mjs","/_worker.js/chunks/noop-middleware_D0YxyBfh.mjs","/_worker.js/chunks/noop_BpHR5zb1.mjs","/_worker.js/chunks/path_CH3auf61.mjs","/_worker.js/chunks/Portal_BOkafQ1A.mjs","/_worker.js/chunks/remote_CVXTZJrr.mjs","/_worker.js/chunks/render-context_B0aEVABc.mjs","/_worker.js/chunks/_@astrojs-ssr-adapter_DdO1XHew.mjs","/_worker.js/pages/login.astro.mjs","/_worker.js/pages/portal.astro.mjs","/_worker.js/pages/signup.astro.mjs","/_worker.js/pages/_image.astro.mjs","/_worker.js/chunks/astro/server_DkNjeDPj.mjs","/_worker.js/pages/api/auth/signin.astro.mjs","/_worker.js/pages/api/auth/signout.astro.mjs","/_worker.js/pages/api/auth/signup.astro.mjs"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"7rVVyVkqnmsF6bOSm9CSdfDmfaQnBrTaYt51XVGQqNc=","sessionConfig":{"driver":"cloudflare-kv-binding","options":{"binding":"SESSION"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/cloudflare-kv-binding_hV136--Z.mjs');

export { manifest };
