-- Step 2 (마이페이지) — Supabase 대시보드 SQL Editor에서 실행.
-- 실행 순서: 아래 전체를 한 번에 붙여넣고 Run.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  role text not null default 'student' check (role in ('student', 'admin')),
  avatar_url text,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- 본인 프로필만 조회 가능
create policy "profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

-- 본인 프로필만 수정 가능
create policy "profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id);

-- 본인 id로만 프로필 행을 만들 수 있음 (기존 계정 백필용, 트리거가 못 잡은 경우 앱이 직접 생성)
create policy "profiles are insertable by owner"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 회원가입 시 profiles 행을 자동 생성하는 트리거
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- role은 관리자만 바꿀 수 있도록 보호 (본인이 앱/API로 직접 role을 바꿔치기하는 것 방지).
-- auth.uid()가 NULL이면 SQL Editor 등 대시보드에서 직접 실행한 것이므로 항상 허용한다
-- (로그인한 앱 사용자가 자기 자신을 admin으로 못 올리게 막는 게 목적이지,
--  프로젝트 소유자의 SQL Editor 작업까지 막으려는 게 아니다).
create or replace function public.protect_role_column()
returns trigger as $$
begin
  if new.role is distinct from old.role then
    if auth.uid() is not null and not exists (
      select 1 from public.profiles where id = auth.uid() and role = 'admin'
    ) then
      new.role := old.role;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists protect_role_before_update on public.profiles;
create trigger protect_role_before_update
  before update on public.profiles
  for each row execute procedure public.protect_role_column();
