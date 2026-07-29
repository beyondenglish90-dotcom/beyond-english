import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

// Supabase Auth + profiles 테이블 기반 인증. 비밀번호는 Supabase가 직접 관리하며 이 앱은 저장하지 않는다.
// 세션은 Supabase SDK가 자체적으로 localStorage에 보관해 새로고침 후에도 유지된다.
const AuthContext = createContext(null)

// profiles 행을 기준으로 사용자 정보를 구성한다. role은 항상 'student'로 시작하며,
// 관리자 지정은 사이트 운영자가 Supabase에서 해당 사용자의 profiles.role을 직접 바꿔야만 가능하다
// (이메일 패턴 등 클라이언트가 판단할 수 있는 방식은 쓰지 않는다 — 스스로 admin이 될 수 없도록).
async function loadUser(sbUser) {
  if (!sbUser) return null

  const meta = sbUser.user_metadata || {}
  const fallbackName = meta.name || sbUser.email.split('@')[0]
  const fallbackRole = 'student'

  let { data: profile } = await supabase
    .from('profiles')
    .select('name, role, avatar_url')
    .eq('id', sbUser.id)
    .maybeSingle()

  if (!profile) {
    // schema.sql 적용 전에 만들어진 계정 등, 트리거가 못 잡은 경우 지금 백필한다.
    const { data: created } = await supabase
      .from('profiles')
      .upsert({ id: sbUser.id, name: fallbackName, role: fallbackRole })
      .select('name, role, avatar_url')
      .single()
    profile = created
  }

  return {
    id: sbUser.id,
    name: profile?.name || fallbackName,
    email: sbUser.email,
    avatar: profile?.avatar_url || null,
    role: profile?.role || fallbackRole,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(async ({ data }) => {
      const mapped = await loadUser(data.session?.user)
      if (active) {
        setUser(mapped)
        setLoading(false)
      }
    })

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const mapped = await loadUser(session?.user)
      if (active) setUser(mapped)
    })

    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  const login = useCallback(async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }, [])

  const loginWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) throw error
  }, [])

  const signup = useCallback(async ({ email, password, name }) => {
    // role은 넘기지 않는다 — DB 기본값(student)이 항상 적용되고, 관리자 지정은 운영자가 직접 한다.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) throw error
    // 이메일 확인이 켜져 있으면 session이 null로 온다 — 호출한 쪽에서 안내 메시지를 분기하는 데 쓴다.
    return { needsEmailConfirmation: !data.session }
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const updateProfile = useCallback(
    async (partial) => {
      if (!user) return
      // role은 여기서 못 바꾼다 — DB 트리거(protect_role_column)가 관리자가 아니면 되돌린다.
      const { name, avatar } = partial
      const { error } = await supabase
        .from('profiles')
        .update({ name, avatar_url: avatar, updated_at: new Date().toISOString() })
        .eq('id', user.id)
      if (error) throw error
      setUser((prev) => (prev ? { ...prev, ...partial } : prev))
    },
    [user],
  )

  const value = useMemo(
    () => ({ user, loading, login, loginWithGoogle, signup, logout, updateProfile }),
    [user, loading, login, loginWithGoogle, signup, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
