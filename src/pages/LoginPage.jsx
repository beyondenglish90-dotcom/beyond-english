import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import GoogleLoginButton from '../components/auth/GoogleLoginButton'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: 10,
  border: '1px solid var(--border)',
  fontFamily: 'inherit',
  fontSize: 14,
  background: 'var(--bg)',
}

export default function LoginPage() {
  const { t } = useLanguage()
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const redirectTo = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login({ email, password })
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    try {
      // 성공 시 Google 동의 화면으로 전체 페이지 리디렉션되므로 여기서 별도 navigate는 하지 않는다.
      await loginWithGoogle()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container section" style={{ maxWidth: 420, margin: '0 auto' }}>
      <div className="text-center" style={{ marginBottom: 28 }}>
        <span className="eyebrow">{t('auth.login')}</span>
        <h1 style={{ fontSize: 28 }}>{t('auth.loginTitle')}</h1>
        <p className="sub">{t('auth.loginSubtitle')}</p>
      </div>

      <Card style={{ padding: 32 }} hover={false}>
        <GoogleLoginButton onClick={handleGoogle} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span className="sub" style={{ fontSize: 12 }}>{t('auth.orDivider')}</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{t('auth.email')}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{t('auth.password')}</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          {error && <p style={{ color: '#E03131', fontSize: 13, margin: 0 }}>{error}</p>}

          <Button type="submit" className="btn-block" disabled={submitting}>
            {t('auth.submitLogin')}
          </Button>
        </form>

        <p className="text-center sub" style={{ fontSize: 14, marginTop: 20 }}>
          {t('auth.noAccount')}{' '}
          <Link to="/signup" style={{ fontWeight: 700 }}>
            {t('auth.goSignup')}
          </Link>
        </p>
      </Card>
    </div>
  )
}
