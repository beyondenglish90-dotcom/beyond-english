import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, BookOpen, Download, Bell, LogOut, Pencil } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid var(--border)',
  fontFamily: 'inherit',
  fontSize: 14,
  background: 'var(--bg)',
}

const activityLog = [
  { icon: BookOpen, ko: 'English Book Club 멤버십에 등록했어요', en: 'Enrolled in the English Book Club membership', date: '2026-07-05' },
  { icon: Download, ko: 'English Adventure Club 소개 자료를 다운로드했어요', en: 'Downloaded the English Adventure Club info sheet', date: '2026-07-12' },
  { icon: Bell, ko: '"English Book Club 8월 선정 도서 안내" 공지를 읽었어요', en: 'Read the notice "August Book Selection"', date: '2026-07-18' },
]

export default function MyPage() {
  const { t, lang } = useLanguage()
  const { user, updateProfile, logout } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [saved, setSaved] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    await updateProfile({ name })
    setEditing(false)
    setSaved(true)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  if (!user) return null

  return (
    <div className="container section" style={{ maxWidth: 880, margin: '0 auto' }}>
      <span className="eyebrow">{t('auth.mypage')}</span>
      <h1>{t('mypage.greeting')}, {user.name}</h1>

      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <Card style={{ padding: 28 }} hover={false}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#EAF2FF',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <User className="icon" style={{ width: 28, height: 28 }} />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 17 }}>{user.name}</p>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--primary-dark)',
                  background: '#EAF2FF',
                  borderRadius: 999,
                  padding: '2px 10px',
                }}
              >
                {user.role === 'admin' ? t('mypage.roleAdmin') : t('mypage.roleStudent')}
              </span>
            </div>
          </div>

          {editing ? (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{t('auth.name')}</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{t('auth.email')}</label>
                <input type="email" disabled value={user.email} style={{ ...inputStyle, color: 'var(--sub)' }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Button type="submit" size="sm">
                  {t('mypage.saveButton')}
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(false)}>
                  {t('mypage.cancelButton')}
                </Button>
              </div>
            </form>
          ) : (
            <>
              <p className="sub" style={{ fontSize: 14, margin: '0 0 16px' }}>{user.email}</p>
              <Button size="sm" variant="outline" onClick={() => { setEditing(true); setSaved(false) }}>
                <Pencil className="icon" style={{ width: 14, height: 14 }} />
                {t('mypage.editButton')}
              </Button>
            </>
          )}

          {saved && !editing && (
            <p style={{ color: 'var(--primary)', fontSize: 13, marginTop: 12 }}>{t('mypage.savedMsg')}</p>
          )}

          <Button size="sm" variant="ghost" onClick={handleLogout} style={{ marginTop: 20 }}>
            <LogOut className="icon" style={{ width: 14, height: 14 }} />
            {t('mypage.logoutButton')}
          </Button>
        </Card>

        <Card style={{ padding: 28 }} hover={false}>
          <h3 style={{ marginTop: 0 }}>{t('mypage.activityTitle')}</h3>
          <ul style={{ display: 'flex', flexDirection: 'column' }}>
            {activityLog.map((item, i) => {
              const Icon = item.icon
              return (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 12,
                    padding: '14px 0',
                    borderBottom: i < activityLog.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <Icon className="icon" style={{ width: 18, height: 18, color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ margin: 0, fontSize: 14 }}>{lang === 'ko' ? item.ko : item.en}</p>
                    <span className="sub" style={{ fontSize: 12 }}>{item.date}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>
    </div>
  )
}
