import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
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

export default function SignupPage() {
  const { t } = useLanguage()
  const { signup, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError(t('auth.passwordMismatch'))
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const { needsEmailConfirmation: needsConfirm } = await signup({ name, email, password })
      if (needsConfirm) {
        setNeedsEmailConfirmation(true)
      } else {
        navigate('/mypage', { replace: true })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    try {
      await loginWithGoogle()
    } catch (err) {
      setError(err.message)
    }
  }

  if (needsEmailConfirmation) {
    return (
      <div className="container section text-center" style={{ maxWidth: 420, margin: '0 auto' }}>
        <MailCheck className="icon" style={{ width: 40, height: 40, color: 'var(--primary)', margin: '0 auto 12px' }} />
        <h1 style={{ fontSize: 24 }}>{t('auth.checkEmailTitle')}</h1>
        <p className="sub">
          {t('auth.checkEmailDesc')} <strong>{email}</strong>
        </p>
        <Button as="link" to="/login" variant="outline" style={{ marginTop: 16 }}>
          {t('auth.goLogin')}
        </Button>
      </div>
    )
  }

  return (
    <div className="container section" style={{ maxWidth: 420, margin: '0 auto' }}>
      <div className="text-center" style={{ marginBottom: 28 }}>
        <span className="eyebrow">{t('auth.signup')}</span>
        <h1 style={{ fontSize: 28 }}>{t('auth.signupTitle')}</h1>
        <p className="sub">{t('auth.signupSubtitle')}</p>
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
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{t('auth.name')}</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          </div>
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
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
              {t('auth.confirmPassword')}
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          {error && <p style={{ color: '#E03131', fontSize: 13, margin: 0 }}>{error}</p>}

          <Button type="submit" className="btn-block" disabled={submitting}>
            {t('auth.submitSignup')}
          </Button>
        </form>

        <p className="text-center sub" style={{ fontSize: 14, marginTop: 20 }}>
          {t('auth.hasAccount')}{' '}
          <Link to="/login" style={{ fontWeight: 700 }}>
            {t('auth.goLogin')}
          </Link>
        </p>
      </Card>
    </div>
  )
}
