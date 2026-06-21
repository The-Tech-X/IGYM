create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table admin_users (
  id           uuid primary key references auth.users(id) on delete cascade,
  role         text not null check (role in ('admin', 'editor')),
  display_name text not null,
  created_at   timestamptz default now()
);

alter table admin_users enable row level security;

create policy "Users can read own profile"
  on admin_users for select
  using (id = auth.uid());

create table trainers (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  slug              text not null unique,
  role              text not null,
  specialty_eyebrow text not null,
  image_url         text,
  specialties       text[] not null default '{}',
  certifications    text[] not null default '{}',
  bio               text[] not null default '{}',
  availability      jsonb not null default '[]',
  instagram         text,
  display_order     integer not null default 0,
  is_active         boolean not null default true,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

create index trainers_active_order_idx on trainers(is_active, display_order);

drop trigger if exists trainers_updated_at on trainers;
create trigger trainers_updated_at
  before update on trainers
  for each row execute function update_updated_at();

alter table trainers enable row level security;

create policy "Public can read active trainers"
  on trainers for select
  using (is_active = true);

create policy "Admins can read all trainers"
  on trainers for select
  using (auth.uid() in (select id from admin_users));

create policy "Authenticated users can insert trainers"
  on trainers
  for insert
  to authenticated
  with check (auth.uid() in (select id from admin_users));

create policy "Authenticated users can update trainers"
  on trainers
  for update
  to authenticated
  using (auth.uid() in (select id from admin_users))
  with check (auth.uid() in (select id from admin_users));

create policy "Authenticated users can delete trainers"
  on trainers
  for delete
  to authenticated
  using (auth.uid() in (select id from admin_users));

create table transformations (
  id               uuid primary key default gen_random_uuid(),
  trainer_id       uuid not null references trainers(id) on delete cascade,
  client_name      text not null,
  duration         text not null,
  goal             text not null,
  goal_type        text not null check (goal_type in (
                     'weight_loss', 'muscle_gain',
                     'athletic_performance', 'post_rehab'
                   )),
  before_image_url text,
  after_image_url  text,
  testimonial      text check (char_length(testimonial) <= 250),
  display_order    integer not null default 0,
  created_at       timestamptz default now()
);

create index transformations_trainer_idx on transformations(trainer_id, display_order);

alter table transformations enable row level security;

create policy "Public can read transformations"
  on transformations for select
  using (true);

create policy "Admins can insert transformations"
  on transformations
  for insert
  to authenticated
  with check (auth.uid() in (select id from admin_users));

create policy "Admins can update transformations"
  on transformations
  for update
  to authenticated
  using (auth.uid() in (select id from admin_users))
  with check (auth.uid() in (select id from admin_users));

create policy "Admins can delete transformations"
  on transformations
  for delete
  to authenticated
  using (auth.uid() in (select id from admin_users));

create table journal_posts (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  slug              text not null unique,
  category          text not null check (category in (
                      'Training', 'Nutrition', 'Mindset', 'Recovery'
                    )),
  excerpt           text check (char_length(excerpt) <= 160),
  cover_image_url   text,
  author_name       text not null,
  author_avatar_url text,
  body              jsonb not null default '{}',
  read_time_minutes integer not null default 1,
  is_published      boolean not null default false,
  published_at      timestamptz,
  meta_title        text check (char_length(meta_title) <= 60),
  meta_description  text check (char_length(meta_description) <= 160),
  og_image_url      text,
  canonical_url     text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

create index journal_posts_published_idx on journal_posts(is_published, published_at desc);

drop trigger if exists journal_posts_updated_at on journal_posts;
create trigger journal_posts_updated_at
  before update on journal_posts
  for each row execute function update_updated_at();

alter table journal_posts enable row level security;

create policy "Public can read published posts"
  on journal_posts for select
  using (is_published = true);

create policy "Admins can read all posts"
  on journal_posts for select
  using (auth.uid() in (select id from admin_users));

create policy "Authenticated users can insert posts"
  on journal_posts
  for insert
  to authenticated
  with check (auth.uid() in (select id from admin_users));

create policy "Authenticated users can update posts"
  on journal_posts
  for update
  to authenticated
  using (auth.uid() in (select id from admin_users))
  with check (auth.uid() in (select id from admin_users));

create policy "Authenticated users can delete posts"
  on journal_posts
  for delete
  to authenticated
  using (auth.uid() in (select id from admin_users));

create table cafe_menu_items (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  category      text not null check (category in (
                  'Pre-Workout', 'Post-Workout', 'Meals', 'Juices', 'Shakes'
                )),
  description   text,
  price         numeric(10,2) not null,
  image_url     text,
  protein_g     numeric(6,1),
  carbs_g       numeric(6,1),
  fat_g         numeric(6,1),
  calories      integer,
  is_available  boolean not null default true,
  display_order integer not null default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index cafe_items_category_order_idx on cafe_menu_items(category, display_order);

drop trigger if exists cafe_menu_items_updated_at on cafe_menu_items;
create trigger cafe_menu_items_updated_at
  before update on cafe_menu_items
  for each row execute function update_updated_at();

alter table cafe_menu_items enable row level security;

create policy "Public can read available menu items"
  on cafe_menu_items for select
  using (is_available = true);

create policy "Admins can read all menu items"
  on cafe_menu_items for select
  using (auth.uid() in (select id from admin_users));

create policy "Authenticated users can insert menu items"
  on cafe_menu_items
  for insert
  to authenticated
  with check (auth.uid() in (select id from admin_users));

create policy "Authenticated users can update menu items"
  on cafe_menu_items
  for update
  to authenticated
  using (auth.uid() in (select id from admin_users))
  with check (auth.uid() in (select id from admin_users));

create policy "Authenticated users can delete menu items"
  on cafe_menu_items
  for delete
  to authenticated
  using (auth.uid() in (select id from admin_users));

-- ─────────────────────────────────────────────────────────────
-- Table-level GRANTs for the Supabase API roles.
-- Required because "Automatically expose new tables" is disabled.
-- RLS (enabled above) is what actually gates row access; these
-- grants only let the roles reach the tables. service_role
-- bypasses RLS entirely.
-- ─────────────────────────────────────────────────────────────

grant usage on schema public to anon, authenticated, service_role;

grant all on all tables    in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all routines  in schema public to anon, authenticated, service_role;

alter default privileges in schema public
  grant all on tables    to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on routines  to anon, authenticated, service_role;
