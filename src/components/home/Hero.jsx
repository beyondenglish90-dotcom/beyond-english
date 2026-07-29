import { useLanguage } from '../../i18n/LanguageContext'
import Button from '../common/Button'

export default function Hero() {
  const { t } = useLanguage()

  return (
    <section
      style={{
        background: 'linear-gradient(180deg, #EAF2FF 0%, var(--bg) 100%)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="container section" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 48 }}>
        <div style={{ flex: '1 1 420px' }}>
          <span className="eyebrow">{t('home.hero.eyebrow')}</span>
          <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)' }}>{t('home.hero.title')}</h1>
          <p style={{ fontSize: 17, maxWidth: 480 }}>{t('home.hero.subtitle')}</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
            <Button as="link" to="/pricing">
              {t('home.hero.ctaPrimary')}
            </Button>
            <Button as="link" to="/curriculum" variant="outline">
              {t('home.hero.ctaSecondary')}
            </Button>
          </div>
        </div>

        <div style={{ flex: '1 1 320px', display: 'flex', justifyContent: 'center' }}>
          <img
            src="/Logo.png"
            alt="Beyond English"
            style={{ width: '100%', maxWidth: 360, filter: 'drop-shadow(0 12px 24px rgba(49,130,246,.15))' }}
          />
        </div>
      </div>
    </section>
  )
}
