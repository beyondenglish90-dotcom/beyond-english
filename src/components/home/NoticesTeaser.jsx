import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, ArrowRight } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import { fetchNotices } from '../../lib/notices'
import SectionTitle from '../common/SectionTitle'
import Button from '../common/Button'

export default function NoticesTeaser() {
  const { t, lang } = useLanguage()
  const [recent, setRecent] = useState([])

  useEffect(() => {
    fetchNotices().then((all) => setRecent(all.slice(0, 3)))
  }, [])

  if (recent.length === 0) return null

  return (
    <section className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        <SectionTitle eyebrow={t('home.notices.eyebrow')} title={t('home.notices.title')} />
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 1, maxWidth: 720, margin: '0 auto' }}>
          {recent.map((notice) => (
            <li key={notice.id}>
              <Link
                to={`/notices/${notice.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '16px 4px',
                  borderBottom: '1px solid var(--border)',
                  color: 'var(--text)',
                }}
              >
                <Bell className="icon" style={{ width: 18, height: 18, color: 'var(--primary)', flexShrink: 0 }} />
                <span style={{ flex: 1, fontWeight: 600 }}>
                  {lang === 'ko' ? notice.titleKo : notice.titleEn}
                </span>
                <span className="sub" style={{ fontSize: 13, flexShrink: 0 }}>{notice.date}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="text-center" style={{ marginTop: 24 }}>
          <Button as="link" to="/notices" variant="ghost" size="sm">
            {t('home.notices.cta')}
            <ArrowRight className="icon" style={{ width: 16, height: 16 }} />
          </Button>
        </div>
      </div>
    </section>
  )
}
