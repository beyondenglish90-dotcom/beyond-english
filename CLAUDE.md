# CLAUDE.md — 프로젝트 가이드

이 파일은 Claude Code가 이 프로젝트에서 작업할 때 자동으로 읽는 지침 파일이다.
프로젝트 루트에 `CLAUDE.md`라는 이름으로 두면 세션 시작 시 자동으로 컨텍스트에 로드된다.

---

## 1. 로컬 연결 (Claude Code 설치·실행)

### 설치

```bash
# npm으로 설치 (Node.js 18+ 필요)
npm install -g @anthropic-ai/claude-code

# 또는 macOS 데스크톱 앱 사용 (Mac/Windows 지원)
# https://claude.ai/download
```

### 실행

```bash
cd /path/to/project   # 프로젝트 폴더로 이동
claude                # 대화형 세션 시작
```

- 처음 실행하면 브라우저로 Anthropic 계정 로그인(OAuth)을 안내한다.
- `claude "질문"` — 일회성 질문 실행
- `claude -c` — 직전 세션 이어서 계속
- VS Code / JetBrains 확장으로 IDE 안에서도 사용 가능

### 로컬 환경 정보

- OS: macOS (darwin)
- 셸: zsh
- 작업 디렉토리: 프로젝트 루트 기준으로 실행할 것

---

## 2. 필수 세팅

### 설정 파일 위치

| 파일 | 용도 |
|------|------|
| `~/.claude/CLAUDE.md` | 전역 지침 (모든 프로젝트 공통) |
| `<프로젝트>/CLAUDE.md` | 프로젝트별 지침 (이 파일) |
| `~/.claude/settings.json` | 전역 설정 (권한, 훅, 환경변수) |
| `<프로젝트>/.claude/settings.json` | 프로젝트 설정 (팀 공유, git 커밋) |
| `<프로젝트>/.claude/settings.local.json` | 개인 설정 (git 제외) |

### 권한(permissions) 예시 — `.claude/settings.json`

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run build)",
      "Bash(npm run dev:*)",
      "Bash(git status)",
      "Bash(git diff:*)"
    ],
    "deny": [
      "Bash(rm -rf:*)"
    ]
  }
}
```

### 배포 규칙 (중요)

- **배포는 `git push origin main`으로만 한다.**
- Netlify CLI, Vercel CLI 등으로 직접 배포하지 마.
- 배포·서버 구성은 기존 방식 그대로 유지하고 임의로 바꾸지 마.

---

## 3. 하네스(Harness) 기본 내용

하네스란 Claude가 실제로 동작하는 실행 환경(도구, 권한, 컨텍스트 관리)을 말한다.

### Claude가 쓰는 주요 도구

- **Read / Write / Edit** — 파일 읽기·생성·수정
- **Bash** — 셸 명령 실행 (권한 모드에 따라 승인 필요)
- **Glob / Grep** — 파일·코드 검색
- **Agent(서브에이전트)** — 큰 탐색·병렬 작업을 별도 에이전트에 위임
- **WebSearch / WebFetch** — 웹 검색·페이지 가져오기
- **Skill(슬래시 명령)** — `/init`, `/code-review`, `/simplify` 등

### 컨텍스트 로딩 순서

1. `~/.claude/CLAUDE.md` (전역 지침)
2. 프로젝트 루트의 `CLAUDE.md` (이 파일)
3. 메모리 인덱스 (`~/.claude/projects/.../memory/MEMORY.md`)

대화가 길어지면 자동으로 요약(compact)되어 다음 컨텍스트로 이어진다.

### 권한 모드

- 기본: 파일 수정·명령 실행 전 사용자 승인 요청
- `/permissions` 로 허용 목록 관리 (터미널 세션에서)
- 자주 쓰는 안전한 명령은 settings.json의 allow에 등록해 프롬프트 줄이기

### 훅(hooks) — 자동화

특정 이벤트(도구 실행 전/후, 세션 종료 등)에 셸 명령을 자동 실행하려면
settings.json에 hooks를 등록한다. "매번 X 할 때마다 Y 해줘" 같은 자동화는
기억이 아니라 훅으로만 보장된다.

---

## 4. 작업 원칙 (요약)

우선순위: **정확성 > 검증 > 최소 변경 > 명확성 > 유지보수성**

- 파일·API·스키마가 존재한다고 가정하지 말고 먼저 읽어서 확인해.
- 수정 전에 관련 파일을 읽고, 수정 후에는 테스트·실행으로 검증해.
- 요청된 작업에만 변경을 국한하고, 관련 없는 리팩토링은 하지 마.
- 가장 단순한 해결책을 선호하고, 불필요한 의존성·추상화를 추가하지 마.
- 기존 프로젝트의 관례와 스타일을 따라.
- 막히면 멈추고 무엇이 막혔는지, 무엇이 검증됐는지 명확히 보고해.
- 검증 없이 "성공했다"고 주장하지 마.

---

## 5. 프로젝트별 정보 (직접 채워 넣기)

> 아래 항목은 프로젝트마다 수정해서 사용.

- **프로젝트 이름:** Beyond English (영어 과외 웹사이트, ko/en 다국어)
- **기술 스택:** Vite + React + react-router-dom, lucide-react(라인 아이콘). 백엔드는 PART 2에서 Supabase Auth/DB 연동 예정
- **개발 서버 실행:** `npm run dev` (beyond-english 폴더 기준, 기본 5174 포트로 프리뷰 연결됨)
- **빌드:** `npm run build`
- **테스트:** 아직 없음
- **배포:** `git push origin main` (자동 배포) — Netlify/Vercel CLI 직접 배포 금지
- **주의사항:**
  - 디자인 시스템 고정값: 색상(#3182F6 등 토스 블루), 버튼 pill 모양(radius 999px), 제목 Playfair Display / 본문 Inter, 아이콘은 lucide-react 라인 스타일 — `src/styles/global.css` 참고
  - AI 챗봇/추천 기능은 사용자가 명시적으로 제외 요청함 (넣지 않음)
  - 게시판은 "공지사항" 용도로만 사용, 검색은 공지사항 글 검색으로 한정
  - 강사(마리아) 프로필, 커리큘럼, 가격 정보는 `beyond-english/Maria Tovar Resume (1).docx`, 로고/광고 이미지는 `public/Logo.png`, `public/images/`에 있음
  - **PART 1 + PART 2 모두 완료.** 회원가입/로그인/마이페이지/구글로그인/관리자 대시보드/공지사항/자료실 전부 실제 Supabase 백엔드(Auth + Postgres + Storage) 연동됨. 프론트엔드 더미로 남아있는 기능 없음
  - **DB 마이그레이션 적용 순서** (전부 실행됨): `supabase/schema.sql`(Step②, profiles) → `supabase/step4_admin_dashboard.sql`(Step④, 관리자 통계·notices 테이블) → `supabase/step5_resources_storage.sql`(자료실, Storage 버킷·resources 테이블). 새 환경에 다시 세팅할 땐 이 순서 그대로.
  - 자료실은 Supabase Storage 버킷 `resources`(공개 버킷) + `resources` 테이블 조합. 업로드/삭제는 관리자만(RLS), 다운로드는 누구나. 삭제 시 DB 행만 지우고 Storage 원본 파일은 남음(수동 정리 필요 시 대시보드에서)
  - 관리자 대시보드 통계 중 "Adventure/Book Club 수강생 수"는 enrollments 테이블이 없어 의도적으로 제외함(요청자와 합의된 범위) — 필요해지면 새 테이블 설계부터 시작해야 함. "자료 다운로드 수"도 다운로드 로그가 없어 제외
  - AI 챗봇·추천 기능은 요청자가 명시적으로 제외함
  - **관리자(admin) 권한은 이메일 패턴이 아니라 `profiles.role` 컬럼으로만 판단한다.** 새 계정은 항상 `student`로 시작하며, 관리자로 올리려면 Supabase 대시보드에서 해당 사용자의 `profiles.role`을 운영자가 직접 `admin`으로 바꿔야 한다 (DB 트리거 `protect_role_column`이 사용자 스스로 role을 바꾸는 걸 막음). 예전에 있던 "admin으로 시작하는 이메일은 자동 관리자" 방식은 보안상 제거함
  - 강사 사진은 아직 미전달 — `src/data/instructor.js`의 `photo: null` 자리에 나중에 채워 넣을 것
