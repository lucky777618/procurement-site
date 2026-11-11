# PLAN.md — lucky7link.com 系统方案 v1

本文件是施工图。改需求先改这里，再动代码。

## 1. 业务模型（已确认）

东莞代采购 + 验货 + 集货/集运，客户是海外中小 B。

成交分三条通道，**共用一套订单后台**：

| 通道 | 客户 | 下单方式 | 收款 | 系统类型 |
| --- | --- | --- | --- | --- |
| A 线上自助 | 中亚、东南亚、欧美 | 网站下单 | PayPal / 连连收单 | `paypal` `lianlian_card` `lianlian_alipay` |
| B 私聊报价 | 俄罗斯为主 | Telegram / WhatsApp / 微信谈定，店主后台建单 | 银行转账、边境账户人民币/卢布 | `manual` |
| C 混合 | 大额 B 端 | 站点看目录 → 私聊定价 → 后台出单 | 定金 + 尾款，均可线下 | `manual` + 分期 |

**关键事实**：连连不接俄罗斯付款，PayPal 在俄停用，支付宝对俄不通。俄罗斯线不做任何支付集成，只做"后台建单 + 客户传水单 + 店主确认到账"。

## 2. 技术栈（已拍板）

| 层 | 选型 | 说明 |
| --- | --- | --- |
| 前端 | Astro + SSR（`@astrojs/cloudflare`） | 展示页静态渲染保 SEO，写操作走服务端 |
| 部署 | Cloudflare Pages | Git 自动构建，免费额度够用 |
| 数据库 / 认证 / 存储 | Supabase（Postgres + Auth + Storage） | 含 RLS 行级权限 |
| 支付 | adapter 层：`paypal` / `lianlian` / `manual` | 同一接口，新增通道只加一个 adapter |
| 邮件 | Resend | 免费 3000 封/月 |
| 内容后台 | 不做 Decap CMS | 内容与订单同一个 `/admin` |

不做：购物车、库存扣减、自动物流轨迹、多语言、自动 WhatsApp/Telegram 推送（v1 只做跳转引导）。

## 3. 数据模型

八张表，全部在 `supabase/schema.sql`。

| 表 | 作用 | 关键字段 |
| --- | --- | --- |
| `profiles` | 客户档案，一对一挂 `auth.users` | `role`（customer/admin）、`company`、`country`、`telegram` |
| `quotes` | 询价单，私聊成交也从这里进 | `status`（new/quoted/accepted/expired）、`payload`（jsonb 品类数量） |
| `orders` | 订单主表 | `order_no`、`channel`、`currency`、`goods_amount`、`fee_amount`、`shipping_amount`、`total_amount`、`status`、`payer_note` |
| `order_items` | 明细行 | `sku`、`qty`、`unit_price`、`supplier` |
| `payments` | 每笔收款一条 | `method`、`status`、`amount`、`proof_url`、`confirmed_by`、`confirmed_at`、`external_id` |
| `packages` | 入库包裹（集运核心） | `tracking_no`、`weight_kg`、`dims`、`photo_url`、`status`（inbound/at_warehouse/packed/shipped） |
| `shipments` | 出运批次 | `carrier`、`awb`、`etd`、`eta`、`status` |
| `order_events` | 状态流水，审计用 | `order_id`、`from_status`、`to_status`、`actor`、`note` |

### 订单状态机

```
draft → pending_payment → paid → purchasing → at_warehouse
      → consolidating → shipped → delivered → closed
              ↘ cancelled（任何未 paid 阶段可取消）
```

### 付款状态机

```
pending → submitted（客户上传水单/等待回调）→ confirmed → refunded
```

线上通道由 webhook 直接把 `pending → confirmed`；线下由店主在后台点确认。

## 4. 路由清单

**公开（无需登录）**

| 路径 | 说明 |
| --- | --- |
| `/` `/services` `/pricing` `/faq` `/contact` `/privacy` | 现有七页迁到 Astro 路由 |
| `/quote` | 询价表单，提交后写 `quotes` |
| `/login` `/signup` | Supabase Auth，邮箱 + 密码 |

**客户（需登录）**

| 路径 | 说明 |
| --- | --- |
| `/account` | 概览：在途订单、待付款、包裹数 |
| `/account/orders` `/account/orders/[id]` | 订单列表与详情，含状态时间线 |
| `/account/orders/[id]/pay` | 支付页，按国家动态显示可用方式 |
| `/account/packages` | 我的包裹与照片 |
| `/account/profile` | 公司、国家、Telegram |

**支付接口**

| 路径 | 说明 |
| --- | --- |
| `POST /api/pay/create` | 建支付单，返回跳转地址 |
| `POST /api/pay/webhook/paypal` | PayPal 回调：验签 + 幂等 |
| `POST /api/pay/webhook/lianlian` | 连连回调，预留 |
| `POST /api/pay/proof` | 水单上传（走 Supabase Storage） |

**后台（仅 admin）**

| 路径 | 说明 |
| --- | --- |
| `/admin` | 今日待办：待确认收款、待建单询价 |
| `/admin/orders` `/admin/orders/[id]` | 订单列表与详情，状态流转 |
| `/admin/quotes` | 询价转订单 |
| `/admin/customers` | 客户与账期备注 |
| `/admin/packages` | 入库登记、上传照片、打批次 |
| `/admin/settings` | 费率档位、付款说明文案 |

## 5. 权限

| 角色 | 读到 | 写到 |
| --- | --- | --- |
| 游客 | 公开页、`/quote` 提交 | 无 |
| customer | 自己的 `orders` / `packages` / `payments` | 自己的 `profile`、水单上传 |
| admin | 全部 | 全部（服务端用 service role） |

`service_role` key **只出现在服务端**，绝不进客户端 bundle。所有写操作经过 API 路由，浏览器不直连数据库写订单。

## 6. 支付矩阵（按客户国家显示）

| 客户所在 | 显示方式 |
| --- | --- |
| 俄罗斯 | 只显示「Telegram 私聊安排付款」，说明支持银行转账/人民币对公 |
| 中亚（KZ/UZ/KG/TJ/TM） | 卡（连连）、Alipay（若连连通道支持） |
| 欧美、澳新 | PayPal、卡（连连） |
| 东南亚、拉美 | 卡（连连）、Alipay |
| 其他/未识别 | 「联系我们先确认付款方式」 |

实现方式：`lib/pay/methods.ts` 里一张国家→方式映射表，页面和接口共用。

## 7. 每个状态谁在动

| 状态 | 谁触发 | 通知客户 |
| --- | --- | --- |
| pending_payment | 系统 | 邮件：订单已生成，附付款指引 |
| paid | webhook 或店主 | 邮件：收款确认 |
| purchasing | 店主 | 可选 |
| at_warehouse | 店主（入库登记） | 邮件 + 包裹照片 |
| consolidating | 店主 | 邮件：集货中 |
| shipped | 店主填运单 | 邮件：运单号与 ETA |
| delivered / closed | 店主 | 邮件 |

## 8. 分期

| 期 | 内容 | 状态 |
| --- | --- | --- |
| P0 | 静态展示站，接询盘 | **已完成**，待部署 |
| P1 | Astro SSR 骨架 + 客户门户 + 店主后台 + 手动单 + 水单 | 待开工 |
| P2 | PayPal adapter + webhook | 与商户审核并行 |
| P3 | 连连 adapter（卡 + Alipay） | 商户审核通常 1–3 周 |
| P4 | 包裹照片压缩与归档策略、费率后台可配 | 按需 |

P1 不等支付：先让订单能建、能看、能确认到账，支付通道随时插进来。

## 9. 验收标准

- 客户能注册、登录、看到自己订单的完整状态时间线。
- 俄罗斯客户全程不出现任何支付按钮，只出现私聊入口。
- 店主能在后台手动建单，客户立刻可见。
- 客户上传水单后，店主一条点击完成确认，`order_events` 留痕。
- 未登录访问 `/admin` 或他人订单，返回 403。
- 支付回调重复投递不会重复改状态（幂等）。
- 375 px 下所有页面无横向滚动。

## 10. 已知风险

| 风险 | 处置 |
| --- | --- |
| 包裹照片撑爆 1 GB 免费存储 | 上传前压到 300 KB 内，出库 90 天归档 |
| 连连商户审核周期不可控 | P1 不依赖支付，先上线 |
| 俄罗斯资金流合规 | 只收真实货款，合同/货权/资金三流一致；不做代付与资金池 |
| 单人维护成本 | 不引入第三方 CMS、不引入队列服务，能省一层就省一层 |
