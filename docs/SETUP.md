# SETUP.md — 安装与配置说明

从一台已装好基础工具的本机，到 lucky7link.com 能上线、能收单的完整步骤。
按顺序做，每步都有验证命令；验证不通过不要往下走。

---

## 0. 本机已具备（已实测，无需重装）

| 工具 | 版本 | 状态 |
| --- | --- | --- |
| Node.js | v22.23.2 | 已装 |
| npm | 10.9.8 | 已装 |
| Git | 2.56.0.windows.4（含 git-lfs 3.8.1） | 已装，PATH 已写入 Machine 级 |
| Python | 3.13.16 + Pillow 13.0.0 | 已装，仅用于 `tools/` 下的脚本 |
| VS Code | 已装 | 可选编辑器 |
| Trae CN（国内版） | 已装 | 主力 IDE |
| pnpm / yarn | 未装 | 用不到，别装 |

```powershell
node --version    # 期望 v22.x
npm --version     # 期望 10.9.x
git --version     # 期望 2.56.0
```

网络前提：直连 `github.com:443` 会超时，本机已有 `127.0.0.1:7897` 代理可用。
git 已全局配置：

```powershell
git config --global --get http.proxy     # 期望 http://127.0.0.1:7897
git config --global --get https.proxy    # 同上
```

代理没开的时候，任何 `git push` 都会卡住不动——先开代理再推。

---

## 1. GitHub：还差两步

仓库已在本地初始化（分支 `main`，两次提交），远端已设为
`git@github.com:lucky777618/procurement-site.git`。需要你在浏览器做两件事：

**① 加 SSH 公钥**

- 打开 https://github.com/settings/ssh/new
- Title 随便填（`Paco-Windows`），Key 粘贴这一串：

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIM27nQ9oXTPy2NrcSdcttnWwXAxL4W6kwcm4weDjZCiX lucky777sourcin@gmail.com
```

**② 建私有仓库**

- 打开 https://github.com/new
- 名称 `procurement-site`，选 **Private**
- **不要**勾 README / .gitignore / license（本地已有内容）

验证与首次推送：

```powershell
ssh -T git@github.com      # 期望出现 "successfully authenticated"
git push -u origin main
```

> 邮箱提醒：提交作者当前是 `lucky777sourcin@gmail.com`，疑似少一个 g（正确可能是 `lucky777sourcing@gmail.com`）。确认后我可以整体重写提交作者。

---

## 2. 脚手架：把静态站升级为 Astro SSR

现在仓库里是 7 个纯静态 HTML。按 PLAN.md 迁到 Astro，旧的先留作文案底本。

```powershell
cd C:\Users\Paco\DoubaoWork\chats\2026-11-10\new-chat\independent-site

# 1) 旧页面先归档，别删
New-Item -ItemType Directory -Force legacy | Out-Null
Move-Item index.html,services.html,pricing.html,faq.html,contact.html,privacy.html,404.html -Destination legacy

# 2) 初始化 Astro（非空目录会提示继续，选 yes）
npm create astro@latest . -- --template minimal --install --no-git

# 3) 加 Cloudflare 适配器（SSR 必需）
npx astro add cloudflare

# 4) 跑起来
npm run dev
```

打开 http://localhost:4321 能看到 Astro 默认页即为通过。

依赖装不动的备选：

```powershell
npm config set registry https://registry.npmmirror.com
npm install
```

跑通后提交一次，作为 P1 的起点：

```powershell
git add -A
git commit -m "Migrate to Astro SSR scaffold"
```

---

## 3. Supabase：数据库 / 认证 / 存储

1. https://supabase.com 注册，新建项目
   - 名称 `lucky7link`
   - Region 选 **Frankfurt**（面向中亚/欧洲延迟更低）
   - 数据库密码存好
2. 进项目 → **SQL Editor**，把 `supabase/schema.sql` 全文粘贴执行
3. 进 **Project Settings → API**，抄三个值：

| 变量 | 来源 | 用在 |
| --- | --- | --- |
| `PUBLIC_SUPABASE_URL` | Project URL | 前后端 |
| `PUBLIC_SUPABASE_ANON_KEY` | `anon` public key | 浏览器（受 RLS 约束） |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` secret | **仅服务端**，绕过 RLS，绝不可进前端 |

4. 认证设置：Authentication → Providers → Email 打开；关掉邮箱确认可省测试麻烦，上线前再开
5. Storage：新建 bucket `payment-proofs`（水单）和 `package-photos`（包裹照），都设为 private

本机 `.env`（该文件已在 `.gitignore`，不要提交）：

```
PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

> 从东莞访问 `*.supabase.co` 可能偏慢，控制台打不开时开代理即可；这不影响线上客户访问。

---

## 4. 支付通道

### PayPal（欧美，P2）

1. https://developer.paypal.com 用企业账户登录 → Apps & Credentials
2. 先建 **Sandbox** app，拿 `Client ID` / `Secret`
3. Webhook：订阅 `PAYMENT.CAPTURE.COMPLETED`，记下 `Webhook ID`
4. 沙箱测试卡：`4111 1111 1111 1111`，有效期任意未来日期
5. 上线前再建 Live app，替换密钥，费率约 3.4%–4.4% + 固定费

环境变量：

```
PAYPAL_ENV=sandbox
PAYPAL_CLIENT_ID=xxx
PAYPAL_CLIENT_SECRET=xxx
PAYPAL_WEBHOOK_ID=xxx
```

### 连连（中亚/东南亚/拉美，P3）

联系客户经理确认三件事，问清楚再开工：

1. 自建站是否支持 **API 接入**（不是只支持 Shopify 插件）
2. 收单通道里是否已经包含 **Alipay** 作为钱包方式（若包含，不必单独申请支付宝商户号）
3. 是否支持**服务贸易/代采购**类目，审核需要哪些材料

已知：连连不接俄罗斯付款，属合规限制，不要试图绕。

### 支付宝

走连连通道。若连连不支持，再申请 Alipay Cross-border Online Payment，材料为营业执照、可用网站 URL、法人及股东证件，费率按量 2.2% / 2.0% / 更低。

### 俄罗斯（manual，P1 就要有）

不做任何集成。系统里只有一个线下结算类型，靠店主后台点确认。

---

## 5. 邮件

1. https://resend.com 注册，拿 `RESEND_API_KEY`
2. Domains → 添加 `lucky7link.com`，按提示在 Cloudflare DNS 加 SPF/DKIM 记录，验证通过
3. Cloudflare → Email Routing：把 `hello@` 和 `quote@` 转发到你真实邮箱（免费）

```
RESEND_API_KEY=xxx
MAIL_FROM=Lucky7Link <hello@lucky7link.com>
```

---

## 6. 部署到 Cloudflare Pages

1. Cloudflare Dashboard → Workers & Pages → Create → **Pages** → Connect to Git
2. 选仓库 `lucky777618/procurement-site`，分支 `main`
3. 构建配置：

| 项 | 值 |
| --- | --- |
| Framework preset | Astro |
| Build command | `npm run build` |
| Output directory | `dist` |

4. Settings → Environment variables，把 `.env` 里全部变量填进 **Production**（`SUPABASE_SERVICE_ROLE_KEY` 属于 secret，同样只放这里）
5. 首次部署成功后 → Custom domains → 添加 `lucky7link.com` 与 `www.lucky7link.com`
   域名已在 Cloudflare DNS，记录会自动创建
6. 决定 `www` 与主域哪个为主，另一条做 301

> 适配器版本差异：`@astrojs/cloudflare` 新版可能要求部署到 Workers 而非 Pages。
> `npx astro add cloudflare` 安装后会直接告诉你走哪条，按它说的做，两条都免费。

---

## 7. Trae 侧要做的

| 步骤 | 命令/动作 |
| --- | --- |
| 打开工程 | Trae → Open Folder → `...\independent-site` |
| 装依赖 | 终端 `npm install` |
| 起服务 | `npm run dev`，浏览器开 4321 |
| 开工前 | 先读 `AGENTS.md` 和 `docs/PLAN.md` |
| 分支 | `git switch -c feat/订单页`，完成后 PR 回 `main` |

分工边界：`src/pages`、`src/components`、`src/lib`、`supabase/` 属于代码侧；
文案与 `docs/` 由我这边定稿，改文案不要顺手改逻辑。

---

## 8. 常见故障

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| `git push` 卡住不动 | 没开代理 | 开 127.0.0.1:7897，确认 `git config --get http.proxy` |
| `npm create` / `npm install` 极慢 | 直连 registry | `npm config set registry https://registry.npmmirror.com` |
| PowerShell 报 `npm.ps1 无法加载` | 执行策略 | 用 `npm.cmd install`，或 `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| Supabase 控制台打不开 | 跨境线路 | 开代理访问，不影响线上 |
| `astro add cloudflare` 报 adapter 版本不符 | Astro 版本与适配器不匹配 | 按提示升降级适配器，别硬改配置 |
| 端口 4321 被占 | 上次进程没退 | `npx astro dev --port 4322` |

---

## 9. 账号与成本清单

| 事项 | 谁办 | 周期 | 成本 |
| --- | --- | --- | --- |
| GitHub 私有仓库 | 你（两步点击） | 5 分钟 | 免费 |
| Supabase 项目 | 你注册，我配 | 10 分钟 | 免费档起步，照片多了 Pro $25/月 |
| Cloudflare Pages | 你授权 Git | 10 分钟 | 免费（构建 500 次/月） |
| PayPal 企业账户 | 你（需营业执照） | 1–3 天审核 | 交易费率 3.4%–4.4% |
| 连连商户号 | 你（联系客户经理） | 1–3 周 | 费率约 0.3%–0.5% |
| 支付宝（若要单独开） | 你 | 3–7 天 | 2.2% 起 |
| Resend | 你注册 | 10 分钟 | 免费 3000 封/月 |

先办 GitHub 和 Supabase，这两件不阻塞任何开发；PayPal 与连连并行去申请，别等代码。
