import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase 환경변수가 설정되지 않았어요. .env.example을 .env로 복사하고 ' +
      'VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 값을 채워주세요. ' +
      '값이 없는 동안은 로그인/회원가입만 동작하지 않고 나머지 페이지는 정상 표시돼요.',
  )
}

// 키가 없어도 createClient 자체는 실패하지 않도록 자리표시 값을 넣는다.
// 실제 인증 호출 시에만 네트워크 에러로 실패하며, 페이지 렌더링 자체는 막지 않는다.
export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  anonKey || 'public-anon-key-placeholder',
)
