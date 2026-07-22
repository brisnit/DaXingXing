-- ============================================================================
-- Da Xing Xing — Supabase schema (initial)
-- Postgres + Supabase Auth + Row Level Security.
-- Run in the Supabase SQL editor, or via: supabase db push
-- This is an MVP-oriented schema: sensible relationships, timestamps, indexes,
-- ownership rules, and RLS. Extend as features harden.
-- ============================================================================

create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type user_role as enum ('user', 'manufacturer', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type project_stage as enum (
    'idea','concept','specification','feasibility_review','manufacturer_matching',
    'quoting','prototype','testing','revision','production_ready','in_production',
    'quality_control','shipping','launch','distribution'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type quote_status as enum ('draft','submitted','accepted','declined','expired');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum ('open','in_progress','completed','cancelled','on_hold');
exception when duplicate_object then null; end $$;

do $$ begin
  create type access_level as enum ('private','team','manufacturer_approved','public');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Helper: updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- Identity: profiles (1:1 with auth.users), companies, membership
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  role user_role not null default 'user',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists companies (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  website text,
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists company_members (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references companies(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  role text not null default 'editor', -- owner | admin | editor | viewer
  created_at timestamptz not null default now(),
  unique (company_id, profile_id)
);

-- ---------------------------------------------------------------------------
-- Catalog: categories, materials, manufacturing methods
-- ---------------------------------------------------------------------------
create table if not exists product_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  blurb text,
  regulated boolean not null default false,
  regulation_note text
);

create table if not exists materials (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  material_group text,
  swatch text,
  description text,
  cost_tier int check (cost_tier between 1 and 5),
  durability int check (durability between 1 and 5),
  sustainability int check (sustainability between 1 and 5),
  weight text,
  metadata jsonb default '{}'::jsonb
);

create table if not exists manufacturing_methods (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  description text
);

-- ---------------------------------------------------------------------------
-- Projects & the living specification
-- ---------------------------------------------------------------------------
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references profiles(id) on delete cascade,
  company_id uuid references companies(id) on delete set null,
  name text not null,
  category_id uuid references product_categories(id),
  stage project_stage not null default 'idea',
  completion int not null default 0,
  feasibility int,
  target_launch date,
  budget numeric,
  is_private boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_projects_owner on projects(owner_id);
create index if not exists idx_projects_stage on projects(stage);

create table if not exists product_briefs (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  overview text, intended_customer text, use_cases text,
  problem text, target_audience text,
  created_at timestamptz not null default now()
);

create table if not exists product_requirements (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  functional jsonb default '[]'::jsonb,
  performance jsonb default '[]'::jsonb,
  durability jsonb default '[]'::jsonb,
  compliance jsonb default '[]'::jsonb
);

create table if not exists product_versions (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  version int not null default 1,
  summary text,
  snapshot jsonb not null default '{}'::jsonb,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);
create index if not exists idx_versions_project on product_versions(project_id);

create table if not exists product_assets (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  kind text, -- render | photo | cad | drawing | packaging
  url text,
  created_at timestamptz not null default now()
);

create table if not exists product_dimensions (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  width_mm numeric, height_mm numeric, depth_mm numeric, weight_g numeric
);

create table if not exists product_materials (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  material_id uuid references materials(id),
  component text, notes text
);

create table if not exists product_components (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  name text, spec text, est_cost numeric
);

create table if not exists product_finishes (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  surface text, color text, placement text
);

create table if not exists product_packaging (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  type text, materials text, recyclable boolean default true, notes text
);

-- ---------------------------------------------------------------------------
-- Manufacturers
-- ---------------------------------------------------------------------------
create table if not exists manufacturers (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references profiles(id) on delete set null,
  name text not null,
  is_demo boolean not null default false,
  country text, region text, city text,
  moq int, lead_time_days int,
  prototype_capable boolean default false,
  us_manufacturing boolean default false,
  small_batch boolean default false,
  price_tier int check (price_tier between 1 and 3),
  rating numeric, on_time numeric, communication numeric,
  completed_projects int default 0,
  verified boolean not null default false,
  blurb text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_manufacturers_country on manufacturers(country);
create index if not exists idx_manufacturers_verified on manufacturers(verified);

create table if not exists manufacturer_capabilities (
  id uuid primary key default uuid_generate_v4(),
  manufacturer_id uuid not null references manufacturers(id) on delete cascade,
  specialties text[], materials text[], methods text[],
  export_regions text[], languages text[], capacity text
);

create table if not exists manufacturer_certifications (
  id uuid primary key default uuid_generate_v4(),
  manufacturer_id uuid not null references manufacturers(id) on delete cascade,
  name text not null, verified boolean default false
);

create table if not exists manufacturer_reviews (
  id uuid primary key default uuid_generate_v4(),
  manufacturer_id uuid not null references manufacturers(id) on delete cascade,
  author_id uuid references profiles(id),
  rating numeric, comment text,
  created_at timestamptz not null default now()
);

create table if not exists manufacturer_project_access (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  manufacturer_id uuid not null references manufacturers(id) on delete cascade,
  approved boolean not null default false,
  nda_signed boolean not null default false,
  requested_at timestamptz not null default now(),
  approved_at timestamptz,
  unique (project_id, manufacturer_id)
);

-- ---------------------------------------------------------------------------
-- Quotes & orders
-- ---------------------------------------------------------------------------
create table if not exists quote_requests (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  created_by uuid references profiles(id),
  quantity int, notes text,
  status quote_status not null default 'submitted',
  created_at timestamptz not null default now()
);

create table if not exists quotes (
  id uuid primary key default uuid_generate_v4(),
  quote_request_id uuid references quote_requests(id) on delete cascade,
  manufacturer_id uuid references manufacturers(id),
  prototype_cost numeric, tooling_cost numeric, mold_cost numeric, unit_cost numeric,
  moq int, sampling_days int, production_days int,
  packaging_cost numeric, qc_cost numeric, shipping_estimate numeric, duties_estimate numeric,
  payment_terms text, expires_at date,
  assumptions text[], exclusions text[],
  status quote_status not null default 'submitted',
  created_at timestamptz not null default now()
);
create index if not exists idx_quotes_request on quotes(quote_request_id);

create table if not exists quote_line_items (
  id uuid primary key default uuid_generate_v4(),
  quote_id uuid not null references quotes(id) on delete cascade,
  label text, amount numeric, qty int default 1
);

create table if not exists prototype_orders (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  manufacturer_id uuid references manufacturers(id),
  quote_id uuid references quotes(id),
  status order_status not null default 'open',
  stage text, -- specifications_approved ... ready_for_production
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists production_orders (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  manufacturer_id uuid references manufacturers(id),
  quantity int, unit_cost numeric,
  status order_status not null default 'open',
  progress int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists production_milestones (
  id uuid primary key default uuid_generate_v4(),
  production_order_id uuid not null references production_orders(id) on delete cascade,
  label text not null, completed boolean default false, due_date date, sort int default 0
);

create table if not exists inspections (
  id uuid primary key default uuid_generate_v4(),
  production_order_id uuid references production_orders(id) on delete cascade,
  type text, result text, report_url text,
  created_at timestamptz not null default now()
);

create table if not exists shipments (
  id uuid primary key default uuid_generate_v4(),
  production_order_id uuid references production_orders(id) on delete cascade,
  carrier text, tracking text, status text, eta date
);

-- ---------------------------------------------------------------------------
-- Collaboration: conversations, messages, files, approvals, notifications
-- ---------------------------------------------------------------------------
create table if not exists conversations (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  subject text,
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid references profiles(id),
  body text,
  attachments jsonb default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_messages_conversation on messages(conversation_id);

create table if not exists files (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  owner_id uuid references profiles(id),
  name text not null, kind text, url text, size_bytes bigint,
  version int default 1, access access_level not null default 'private',
  watermarked boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists approvals (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  requested_by uuid references profiles(id),
  subject text, status text default 'pending', -- pending | approved | rejected
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  kind text, title text, body text, url text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_notifications_profile on notifications(profile_id, read);

-- ---------------------------------------------------------------------------
-- Commerce: packages, service orders, brand/launch, preorders, billing
-- ---------------------------------------------------------------------------
create table if not exists service_packages (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null, name text not null, tagline text,
  price_label text, includes text[], active boolean default true,
  sort int default 0
);

create table if not exists service_orders (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  package_id uuid references service_packages(id),
  buyer_id uuid references profiles(id),
  status order_status not null default 'open',
  amount numeric,
  created_at timestamptz not null default now()
);

create table if not exists brand_projects (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  scope text[], status text default 'active',
  created_at timestamptz not null default now()
);

create table if not exists launch_campaigns (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  channel text, status text default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists preorder_products (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  title text, funding_goal numeric, preorder_price numeric, early_bird_price numeric,
  ships_estimate date, published boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists preorder_orders (
  id uuid primary key default uuid_generate_v4(),
  preorder_product_id uuid references preorder_products(id) on delete cascade,
  email text, amount numeric, config jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists subscriptions (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id) on delete cascade,
  company_id uuid references companies(id) on delete cascade,
  tier text not null, -- explorer | builder | company | enterprise
  stripe_customer_id text, stripe_subscription_id text,
  status text default 'active',
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id),
  amount numeric, currency text default 'usd',
  kind text, -- subscription | package | deposit | production | inspection | logistics
  stripe_payment_intent text, status text default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists disputes (
  id uuid primary key default uuid_generate_v4(),
  order_ref uuid, raised_by uuid references profiles(id),
  reason text, status text default 'open',
  created_at timestamptz not null default now()
);

create table if not exists compliance_flags (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  area text, severity text, note text, resolved boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references profiles(id),
  action text not null, target_type text, target_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_audit_created on audit_logs(created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','companies','projects','manufacturers','prototype_orders','production_orders'
  ] loop
    execute format(
      'drop trigger if exists trg_%1$s_updated on %1$s;
       create trigger trg_%1$s_updated before update on %1$s
       for each row execute function set_updated_at();', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Row Level Security (representative policies — private-by-default)
-- ---------------------------------------------------------------------------
alter table profiles enable row level security;
alter table projects enable row level security;
alter table product_versions enable row level security;
alter table files enable row level security;
alter table notifications enable row level security;
alter table quote_requests enable row level security;

-- Profiles: a user can see/update their own row.
drop policy if exists "profiles self" on profiles;
create policy "profiles self" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Projects: owner (or company member) has full access; private by default.
drop policy if exists "projects owner" on projects;
create policy "projects owner" on projects
  for all using (
    auth.uid() = owner_id
    or exists (
      select 1 from company_members cm
      where cm.company_id = projects.company_id and cm.profile_id = auth.uid()
    )
  )
  with check (auth.uid() = owner_id);

-- Product versions: visible if the parent project is visible to the user.
drop policy if exists "versions via project" on product_versions;
create policy "versions via project" on product_versions
  for all using (
    exists (select 1 from projects p where p.id = product_versions.project_id and p.owner_id = auth.uid())
  );

-- Files: owner-only unless access level opens them up (extend as needed).
drop policy if exists "files owner" on files;
create policy "files owner" on files
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- Notifications: recipient only.
drop policy if exists "notifications self" on notifications;
create policy "notifications self" on notifications
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- Quote requests: project owner only.
drop policy if exists "quote_requests owner" on quote_requests;
create policy "quote_requests owner" on quote_requests
  for all using (
    exists (select 1 from projects p where p.id = quote_requests.project_id and p.owner_id = auth.uid())
  );

-- NOTE: manufacturers, product_categories, and materials are treated as
-- readable catalog data; add SELECT policies (e.g. `using (true)`) or serve
-- them via a service role depending on your exposure model.

-- ---------------------------------------------------------------------------
-- Auto-create a profile row when a new auth user signs up.
-- ---------------------------------------------------------------------------
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
