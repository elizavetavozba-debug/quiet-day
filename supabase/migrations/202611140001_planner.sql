create table public.planner_tasks (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 title text not null check (char_length(trim(title)) between 1 and 200),
 due_date date not null,
 time time without time zone,
 category text not null default 'personal' check (category in ('personal','work','care')),
 priority text not null default 'normal' check (priority in ('normal','high')),
 notes text not null default '' check (char_length(notes) <= 3000),
 completed boolean not null default false,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index planner_tasks_owner_date_idx on public.planner_tasks(user_id,due_date);
alter table public.planner_tasks enable row level security;
revoke all on public.planner_tasks from anon;
grant select,insert,update,delete on public.planner_tasks to authenticated;
create policy planner_owner_select on public.planner_tasks for select to authenticated using ((select auth.uid())=user_id);
create policy planner_owner_insert on public.planner_tasks for insert to authenticated with check ((select auth.uid())=user_id);
create policy planner_owner_update on public.planner_tasks for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy planner_owner_delete on public.planner_tasks for delete to authenticated using ((select auth.uid())=user_id);
create function public.planner_set_updated_at() returns trigger language plpgsql set search_path = '' as $$ begin new.updated_at = now(); return new; end; $$;
create trigger planner_tasks_updated before update on public.planner_tasks for each row execute function public.planner_set_updated_at();
