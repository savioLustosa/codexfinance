create extension if not exists "pgcrypto";

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'backlog' check (status in ('backlog', 'active', 'blocked', 'done')),
  start_date date,
  end_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  assignee_id uuid references auth.users(id) on delete set null,
  title text not null,
  description text,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  due_date date,
  created_at timestamptz not null default now()
);

alter table public.teams enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;

create policy "teams_owner_policy"
  on public.teams
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "projects_owner_policy"
  on public.projects
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "tasks_owner_policy"
  on public.tasks
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);
