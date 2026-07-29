-- Step 5 (자료실 Supabase Storage 연동) — Supabase SQL Editor에서 실행.
-- step4_admin_dashboard.sql(is_admin() 함수)이 이미 적용된 상태에서 이어서 실행한다. 한 번만 실행할 것.

-- 1) 자료 파일을 담을 Storage 버킷 (공개 버킷 — 링크만 있으면 누구나 다운로드 가능)
insert into storage.buckets (id, name, public)
values ('resources', 'resources', true)
on conflict (id) do nothing;

-- 다운로드는 누구나, 업로드/삭제는 관리자만
drop policy if exists "resource files are publicly readable" on storage.objects;
create policy "resource files are publicly readable"
  on storage.objects for select
  using (bucket_id = 'resources');

drop policy if exists "resource files are insertable by admins" on storage.objects;
create policy "resource files are insertable by admins"
  on storage.objects for insert
  with check (bucket_id = 'resources' and public.is_admin());

drop policy if exists "resource files are deletable by admins" on storage.objects;
create policy "resource files are deletable by admins"
  on storage.objects for delete
  using (bucket_id = 'resources' and public.is_admin());

-- 2) 자료 메타데이터 테이블 (실제 파일은 Storage에, 여기는 제목/카테고리/링크만 저장)
create table if not exists public.resources (
  id bigint generated always as identity primary key,
  category text not null default 'general' check (category in ('adventure-club', 'book-club', 'general')),
  title_ko text not null,
  title_en text not null,
  file_url text,
  file_size bigint,
  file_type text not null default 'other' check (file_type in ('image', 'pdf', 'other')),
  created_at timestamptz not null default now()
);

alter table public.resources enable row level security;

-- 목록은 누구나 조회 가능 (자료실 페이지는 비로그인도 볼 수 있음)
drop policy if exists "resources are viewable by everyone" on public.resources;
create policy "resources are viewable by everyone"
  on public.resources for select
  using (true);

drop policy if exists "resources are insertable by admins" on public.resources;
create policy "resources are insertable by admins"
  on public.resources for insert
  with check (public.is_admin());

drop policy if exists "resources are deletable by admins" on public.resources;
create policy "resources are deletable by admins"
  on public.resources for delete
  using (public.is_admin());

-- 3) 기존 더미 자료 5건 이전 (이미지 2개는 기존 public/ 정적 파일 링크를 그대로 씀,
--    나머지는 "준비중" 상태 그대로 file_url = null)
insert into public.resources (category, title_ko, title_en, file_url, file_size, file_type, created_at) values
  ('adventure-club', 'English Adventure Club 소개 자료', 'English Adventure Club — Info Sheet', '/images/english-adventure-club.png', 1887436, 'image', '2026-07-01T00:00:00+00'::timestamptz),
  ('book-club', 'English Book Club 소개 자료', 'English Book Club — Info Sheet', '/images/english-book-club.png', 1798246, 'image', '2026-07-01T00:00:00+00'::timestamptz),
  ('book-club', '8월 Book Club 선정 도서 미리보기', 'August Book Club Preview', null, null, 'pdf', '2026-07-10T00:00:00+00'::timestamptz),
  ('adventure-club', 'Adventure Passport 양식', 'Adventure Passport Template', null, null, 'pdf', '2026-07-05T00:00:00+00'::timestamptz),
  ('general', 'Beyond English 브랜드 로고', 'Beyond English Brand Logo', '/Logo.png', 943512, 'image', '2026-06-20T00:00:00+00'::timestamptz);
