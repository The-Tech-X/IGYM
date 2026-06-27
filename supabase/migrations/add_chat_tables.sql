-- ─── gym_info ──────────────────────────────────────────────────────────────
-- Single-row table holding the AI knowledge base (plain text, admin-editable)

create table gym_info (
  id         boolean primary key default true,
  content    text not null default '',
  updated_at timestamptz default now()
);

alter table gym_info add constraint gym_info_one_row check (id = true);

create trigger gym_info_updated_at
  before update on gym_info
  for each row execute function update_updated_at();

alter table gym_info enable row level security;

create policy "Public can read gym_info"
  on gym_info for select
  to anon, authenticated
  using (true);

create policy "Admins can update gym_info"
  on gym_info for update
  to authenticated
  using (auth.uid() in (select id from admin_users))
  with check (auth.uid() in (select id from admin_users));

insert into gym_info (content) values ('') on conflict do nothing;

-- ─── leads ─────────────────────────────────────────────────────────────────
-- Visitor contacts captured by the AI concierge during chat

create table leads (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  phone      text not null,
  enquiry    text,
  created_at timestamptz default now()
);

alter table leads enable row level security;

create policy "Service role can insert leads"
  on leads for insert
  to service_role
  with check (true);

create policy "Admins can read leads"
  on leads for select
  to authenticated
  using (auth.uid() in (select id from admin_users));
