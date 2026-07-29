-- Step 4 (관리자 대시보드 실데이터 연동) — Supabase SQL Editor에서 실행.
-- schema.sql이 이미 적용된 상태에서 이어서 실행한다. 한 번만 실행할 것(공지사항 seed 포함).

-- 0) 관리자 여부를 안전하게 확인하는 함수 (RLS 정책에서 재사용, 자기참조 재귀 문제 회피)
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- 1) profiles: 가입일자 컬럼 추가 (신규가입 추이 차트용)
alter table public.profiles
  add column if not exists created_at timestamptz not null default now();

-- 기존 회원가입 트리거가 새 컬럼도 채우도록 갱신
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, role, created_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    new.created_at
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- 2) profiles: 관리자는 전체 회원을 조회할 수 있도록 정책 추가 (기존 "본인만" 정책은 그대로 둠)
drop policy if exists "profiles are viewable by admins" on public.profiles;
create policy "profiles are viewable by admins"
  on public.profiles for select
  using (public.is_admin());

-- 3) 공지사항 테이블
create table if not exists public.notices (
  id bigint generated always as identity primary key,
  title_ko text not null,
  title_en text not null,
  excerpt_ko text not null default '',
  excerpt_en text not null default '',
  content_ko text not null default '',
  content_en text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.notices enable row level security;

-- 게시된 공지는 누구나(비로그인 포함) 조회 가능, 관리자는 임시저장까지 전부 조회 가능
drop policy if exists "notices are viewable by everyone" on public.notices;
create policy "notices are viewable by everyone"
  on public.notices for select
  using (status = 'published' or public.is_admin());

-- 등록/수정/삭제는 관리자만
drop policy if exists "notices are insertable by admins" on public.notices;
create policy "notices are insertable by admins"
  on public.notices for insert
  with check (public.is_admin());

drop policy if exists "notices are updatable by admins" on public.notices;
create policy "notices are updatable by admins"
  on public.notices for update
  using (public.is_admin());

drop policy if exists "notices are deletable by admins" on public.notices;
create policy "notices are deletable by admins"
  on public.notices for delete
  using (public.is_admin());

-- 4) 기존 더미 공지 8건을 실제 데이터로 이전 (한 번만 실행)
insert into public.notices (title_ko, title_en, excerpt_ko, excerpt_en, content_ko, content_en, status, created_at) values
  ($n0a$2026년 가을학기 English Adventure Club 모집 안내$n0a$, $n0b$Fall 2026 English Adventure Club Enrollment Open$n0b$, $n0c$초등 8~12세 대상 신규 그룹을 모집합니다. 정원이 한정되어 있으니 서둘러 신청해주세요.$n0c$, $n0d$New groups for ages 8–12 are now open. Spots are limited — sign up soon.$n0d$, $n0e$2026년 가을학기 English Adventure Club 신규 그룹을 모집합니다. 매주 1회 60~75분 소그룹 라이브 수업으로 진행되며, 이번 학기 주제는 "바다 탐험"입니다. 정원은 그룹당 6명으로 제한되어 있으니 관심 있으신 분들은 카카오톡(Beyond-English) 또는 전화(548-888-5301)로 빠르게 문의해주세요.$n0e$, $n0f$We're opening new Fall 2026 groups for English Adventure Club. Classes run weekly, 60–75 minutes, in small groups of up to 6 students. This term's theme is "Ocean Explorers." Spots are limited — reach out via KakaoTalk (Beyond-English) or phone (548-888-5301) to reserve a spot.$n0f$, 'published', '2026-07-20T00:00:00+00'::timestamptz),
  ($n1a$English Book Club 8월 선정 도서 안내$n1a$, $n1b$English Book Club — August Book Selection$n1b$, $n1c$8월 한 달간 함께 읽을 책이 정해졌습니다. 자료실에서 미리보기를 확인하세요.$n1c$, $n1d$This month's book pick is up — check the preview in the Resources page.$n1d$, $n1e$8월 English Book Club에서 함께 읽을 책이 정해졌습니다. 짧은 단편들로 구성되어 있어 매주 10~20페이지씩 부담 없이 읽을 수 있어요. 미리보기와 어휘 노트는 자료실 페이지에서 확인하실 수 있습니다.$n1e$, $n1f$The book for August's English Book Club has been selected. It's a collection of short stories, so each week's reading stays light at 10–20 pages. Find the preview and vocabulary notes on the Resources page.$n1f$, 'published', '2026-07-10T00:00:00+00'::timestamptz),
  ($n2a$여름 시즌 특별 이벤트 일정 공지$n2a$, $n2b$Summer Season Special Event Schedule$n2b$, $n2c$두 프로그램 모두를 위한 여름 특별 이벤트가 준비되어 있습니다.$n2c$, $n2d$Summer special events are planned for both programs.$n2d$, $n2e$Adventure Club과 Book Club 모두를 위한 여름 시즌 이벤트를 준비했습니다. Adventure Club은 "영어로 여름 캠프" 특별 활동을, Book Club은 여름 휴가지에서 쓸 수 있는 실전 표현 세션을 진행할 예정입니다. 자세한 일정은 추후 공지됩니다.$n2e$, $n2f$We've planned summer events for both Adventure Club and Book Club. Adventure Club will host a special "Summer English Camp" activity, while Book Club will run a session on practical travel English. Detailed schedules will be announced soon.$n2f$, 'published', '2026-06-28T00:00:00+00'::timestamptz),
  ($n3a$Beyond English 웹사이트 오픈 안내$n3a$, $n3b$Beyond English Website is Now Live$n3b$, $n3c$강사 소개, 수업 진행방식, 가격, 자료실을 한곳에서 확인하실 수 있어요.$n3c$, $n3d$Instructor info, curriculum, pricing, and resources — all in one place.$n3d$, $n3e$Beyond English 공식 웹사이트가 오픈했습니다. 강사 소개, 수업 진행방식, 가격 정보, 학습 자료실을 웹사이트에서 확인하실 수 있으며, 한국어와 영어를 모두 지원합니다. 궁금한 점은 언제든 문의해주세요.$n3e$, $n3f$The official Beyond English website is now live. You can find instructor info, how classes work, pricing, and learning resources — all in Korean and English. Feel free to reach out with any questions.$n3f$, 'published', '2026-06-15T00:00:00+00'::timestamptz),
  ($n4a$6월 Adventure Passport 배지 수여자 발표$n4a$, $n4b$June Adventure Passport Badge Winners$n4b$, $n4c$6월 한 달간 미션을 완료한 친구들에게 Adventure Badge를 수여했습니다.$n4c$, $n4d$Congrats to everyone who earned an Adventure Badge in June!$n4d$, $n4e$6월 한 달간 주간 Adventure Mission을 꾸준히 완료한 친구들에게 Adventure Badge를 수여했습니다. 모든 참여자에게 축하의 박수를 보내며, 7월에도 새로운 미션으로 만나요!$n4e$, $n4f$Congratulations to everyone who completed their weekly Adventure Missions in June and earned an Adventure Badge! See you in July with brand-new missions.$n4f$, 'published', '2026-06-02T00:00:00+00'::timestamptz),
  ($n5a$English Book Club 온라인 커뮤니티 오픈$n5a$, $n5b$English Book Club Online Community is Open$n5b$, $n5c$카카오톡 그룹을 통해 수업이 없는 날에도 영어를 계속 접할 수 있어요.$n5c$, $n5d$Stay connected to English even between classes via our KakaoTalk group.$n5d$, $n5e$English Book Club 멤버를 위한 카카오톡 온라인 커뮤니티를 오픈했습니다. 오늘의 단어, 자주 쓰는 표현, 발음 팁을 매일 공유하니 하루 5분만 투자해도 꾸준히 영어를 접할 수 있어요. 가입을 원하시면 강사에게 문의해주세요.$n5e$, $n5f$We've launched a KakaoTalk community for English Book Club members. We share a word of the day, common expressions, and pronunciation tips daily — just 5 minutes a day keeps your English active. Contact your instructor to join.$n5f$, 'published', '2026-05-20T00:00:00+00'::timestamptz),
  ($n6a$어린이날 특별 수업 안내$n6a$, $n6b$Children's Day Special Class$n6b$, $n6c$Adventure Club 어린이들을 위한 특별 게임 수업을 진행했습니다.$n6c$, $n6d$A special games-themed class for our Adventure Club kids.$n6d$, $n6e$어린이날을 맞아 Adventure Club 정규 수업 대신 특별 게임 수업을 진행했습니다. 팀 게임과 보드게임을 통해 즐겁게 영어를 사용하는 시간을 가졌습니다. 참여해주신 모든 친구들 고마워요!$n6e$, $n6f$To celebrate Children's Day, we replaced our regular Adventure Club session with a special games class — team games and board games, all in English. Thanks to everyone who joined in the fun!$n6f$, 'published', '2026-05-05T00:00:00+00'::timestamptz),
  ($n7a$4월 부모님 성장 리포트 발송 완료$n7a$, $n7b$April Parent Progress Reports Sent$n7b$, $n7c$Adventure Club 학부모님께 4월 성장 리포트를 발송했습니다.$n7c$, $n7d$April growth reports have been sent to Adventure Club parents.$n7d$, $n7e$4월 한 달간의 수업 참여도, 말하기 자신감, 새로 배운 표현, 강점과 다음 목표를 정리한 성장 리포트를 학부모님께 발송했습니다. 확인이 어려우신 경우 카카오톡으로 다시 보내드릴 수 있어요.$n7e$, $n7f$We've sent April progress reports covering participation, speaking confidence, new expressions, and next goals to all Adventure Club parents. If you haven't received yours, let us know and we'll resend it over KakaoTalk.$n7f$, 'published', '2026-04-18T00:00:00+00'::timestamptz);
