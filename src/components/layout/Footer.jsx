import { Link } from 'react-router-dom'
import { useLanguage } from '../../i18n/LanguageContext'

const LINKS = [
  { to: '/about', key: 'nav.about' },
  { to: '/curriculum', key: 'nav.curriculum' },
  { to: '/pricing', key: 'nav.pricing' },
  { to: '/resources', key: 'nav.resources' },
  { to: '/notices', key: 'nav.notices' },
]

export default function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', marginTop: 40 }}>
      <div className="container section-sm" style={{ display: 'flex', flexWrap: 'wrap', gap: 40, justifyContent: 'space-between' }}>
        <div style={{ maxWidth: 280 }}>
          <img src="/Logo.png" alt="Beyond English" style={{ height: 40, marginBottom: 12 }} />
          <p className="sub" style={{ fontSize: 14 }}>{t('brand.tagline')}</p>
        </div>

        <div>
          <h4 style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--sub)', marginBottom: 12 }}>
            {t('footer.quickLinks')}
          </h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} style={{ color: 'var(--text)', fontSize: 14 }}>
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 style={{ fontFamily: 'Inter', fontSize: 14, color: 'var(--sub)', marginBottom: 12 }}>
            {t('footer.contact')}
          </h4>
          <p className="sub" style={{ fontSize: 14, margin: 0 }}>
            Email: <a href="mailto:beyondenglish90@gmail.com" style={{ color: 'inherit' }}>beyondenglish90@gmail.com</a><br />
            KakaoTalk ID: Beyond-English<br />
            Tel: 548-888-5301
          </p>
        </div>
      </div>

      <div className="container" style={{ borderTop: '1px solid var(--border)', padding: '16px 24px', fontSize: 13 }}>
        <p className="sub" style={{ margin: 0 }}>
          &copy; {year} Beyond English. {t('footer.rights')}
        </p>
      </div>
    </footer>
  )
}
