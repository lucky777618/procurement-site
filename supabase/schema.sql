-- lucky7link.com — 数据库结构 v1
-- 在 Supabase → SQL Editor 全文粘贴执行。
-- 约定：所有时间用 timestamptz；金额用 numeric(12,2)；管理员通过服务端 service_role 读写，绕过 RLS。

-- ============ 1. 客户档案 ============
create table if not exists profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  role          text not null default 'customer' check (role in ('customer','admin')),
  email         text,
  full_name     text,
  company       text,
  country       text,                       -- ISO-3166 alpha-2，用来决定显示哪些付款方式
  telegram      text,
  whatsapp      text,
  note          text,                       -- 店主内部备注，客户看不到
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============ 2. 询价单 ============
create table if not exists quotes (
  id            uuid primary key default gen_random_uuid(),
  customer_id   uuid references profiles(id) on delete set null,  -- 未注册也能询价
  name          text not null,
  email         text not null,
  company       text,
  country       text,
  payload       jsonb not null default '{}'::jsonb,  -- 品类、数量、链接、备注原样存
  status        text not null default 'new'
                check (status in ('new','quoted','accepted','declined','expired')),
  quoted_amount numeric(12,2),
  quoted_note   text,
  converted_order_id uuid,                  -- 转成订单后回填
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============ 3. 订单 ============
create table if not exists orders (
  id            uuid primary key default gen_random_uuid(),
  order_no      text not null unique,       -- 对客户展示的单号，如 L7L-2026-0001
  customer_id   uuid not null references profiles(id) on delete restrict,
  channel       text not null default 'online'
                check (channel in ('online','manual','mixed')),
  country       text,
  currency      char(3) not null default 'USD',
  goods_amount  numeric(12,2) not null default 0,
  fee_amount    numeric(12,2) not null default 0,
  shipping_amount numeric(12,2) not null default 0,
  total_amount  numeric(12,2) not null default 0,
  status        text not null default 'draft'
                check (status in ('draft','pending_payment','paid','purchasing',
                                  'at_warehouse','consolidating','shipped',
                                  'delivered','closed','cancelled')),
  payer_note    text,                       -- 付款人≠下单人时记清楚
  admin_note    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists orders_customer_idx on orders (customer_id, created_at desc);
create index if not exists orders_status_idx   on orders (status);

-- ============ 4. 订单明细 ============
create table if not exists order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references orders(id) on delete cascade,
  title         text not null,
  spec          text,
  qty           integer not null default 1 check (qty > 0),
  unit_price    numeric(12,2) not null default 0,     -- 记人民币进价或美元售价，用 currency 字段说明
  currency      char(3) not null default 'CNY',
  supplier      text,
  source_url    text,
  created_at    timestamptz not null default now()
);

create index if not exists order_items_order_idx on order_items (order_id);

-- ============ 5. 收款 ============
create table if not exists payments (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references orders(id) on delete cascade,
  method        text not null
                check (method in ('paypal','lianlian_card','lianlian_alipay','manual')),
  status        text not null default 'pending'
                check (status in ('pending','submitted','confirmed','refunded','failed')),
  amount        numeric(12,2) not null,
  currency      char(3) not null default 'USD',
  external_id   text,                       -- PayPal capture id / 连连流水号
  proof_url     text,                       -- 水单图片在 Storage 里的路径
  payer_name    text,
  confirmed_by  text,
  confirmed_at  timestamptz,
  raw           jsonb,                      -- webhook 原文，排障用
  created_at    timestamptz not null default now(),
  unique (order_id, method, external_id)    -- 同一笔回调重复投递不会重复入库
);

create index if not exists payments_order_idx on payments (order_id);

-- ============ 6. 入库包裹 ============
create table if not exists packages (
  id            uuid primary key default gen_random_uuid(),
  customer_id   uuid not null references profiles(id) on delete restrict,
  order_id      uuid references orders(id) on delete set null,
  tracking_no   text,
  carrier       text,
  weight_kg     numeric(8,2),
  dims          text,
  photo_url     text,                       -- 必须压缩后再传，目标 ≤300 KB
  status        text not null default 'inbound'
                check (status in ('inbound','at_warehouse','packed','shipped')),
  received_at   timestamptz,
  archived_at   timestamptz,                -- 出库 90 天后归档，用来清 Storage
  created_at    timestamptz not null default now()
);

create index if not exists packages_customer_idx on packages (customer_id, created_at desc);
create index if not exists packages_order_idx    on packages (order_id);

-- ============ 7. 出运批次 ============
create table if not exists shipments (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references orders(id) on delete cascade,
  carrier       text,
  awb           text,
  etd           date,
  eta           date,
  status        text not null default 'booked'
                check (status in ('booked','in_transit','arrived','delivered')),
  created_at    timestamptz not null default now()
);

-- ============ 8. 状态流水 ============
create table if not exists order_events (
  id            bigserial primary key,
  order_id      uuid not null references orders(id) on delete cascade,
  from_status   text,
  to_status     text,
  actor         text,                       -- 'system' / 'paypal-webhook' / 店主邮箱
  note          text,
  created_at    timestamptz not null default now()
);

create index if not exists order_events_order_idx on order_events (order_id, created_at);

-- ============ RLS ============
-- 原则：客户只能看见自己的；管理员走服务端 service_role，绕过 RLS。

alter table profiles     enable row level security;
alter table quotes       enable row level security;
alter table orders       enable row level security;
alter table order_items  enable row level security;
alter table payments     enable row level security;
alter table packages     enable row level security;
alter table shipments    enable row level security;
alter table order_events enable row level security;

-- 客户读自己的档案、改自己的联系方式
drop policy if exists profiles_self_select on profiles;
create policy profiles_self_select on profiles for select
  using (auth.uid() = id);

drop policy if exists profiles_self_update on profiles;
create policy profiles_self_update on profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);

-- 询价：谁都能提交；登录用户能看自己提交的
drop policy if exists quotes_public_insert on quotes;
create policy quotes_public_insert on quotes for insert
  with check (true);

drop policy if exists quotes_self_select on quotes;
create policy quotes_self_select on quotes for select
  using (auth.uid() = customer_id);

-- 订单：客户只读自己的，写操作全部走 API（服务端）
drop policy if exists orders_self_select on orders;
create policy orders_self_select on orders for select
  using (auth.uid() = customer_id);

-- 明细：跟着订单走
drop policy if exists order_items_self_select on order_items;
create policy order_items_self_select on order_items for select
  using (exists (select 1 from orders o
                 where o.id = order_items.order_id and o.customer_id = auth.uid()));

-- 收款：客户能看到自己订单下的付款记录与状态（用于看"已到账/待确认"）
drop policy if exists payments_self_select on payments;
create policy payments_self_select on payments for select
  using (exists (select 1 from orders o
                 where o.id = payments.order_id and o.customer_id = auth.uid()));

-- 包裹：自己的
drop policy if exists packages_self_select on packages;
create policy packages_self_select on packages for select
  using (auth.uid() = customer_id);

-- 运单：自己订单下的
drop policy if exists shipments_self_select on shipments;
create policy shipments_self_select on shipments for select
  using (exists (select 1 from orders o
                 where o.id = shipments.order_id and o.customer_id = auth.uid()));

-- 流水：自己的订单
drop policy if exists order_events_self_select on order_events;
create policy order_events_self_select on order_events for select
  using (exists (select 1 from orders o
                 where o.id = order_events.order_id and o.customer_id = auth.uid()));

-- ============ 一个最小的商品化假设 ============
-- 订阅邮箱确认关掉时，注册后会立刻有 session；上线前记得在
-- Authentication → Providers → Email 里把 Confirm email 打开。
