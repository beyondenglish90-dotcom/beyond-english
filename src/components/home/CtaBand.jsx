import { useLanguage } from '../../i18n/LanguageContext'
import Button from '../common/Button'

export default function CtaBand() {
  const { t } = useLanguage()

  return (
    <section className="section" style={{ background: 'var(--primary)', color: '#fff' }}>
      <div className="container text-center">
        <h2 style={{ color: '#fff' }}>{t('home.cta.title')}</h2>
        <p style={{ color: '#EAF2FF', maxWidth: 460, margin: '0 auto 24px' }}>{t('home.cta.subtitle')}</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button as="link" to="/signup" style={{ background: '#fff', color: 'var(--primary)' }}>
            {t('home.cta.primary')}
          </Button>
          <Button as="link" to="/pricing" style={{ background: 'transparent', border: '1.5px solid #fff', color: '#fff' }}>
            {t('home.cta.secondary')}
          </Button>
        </div>
      </div>
    </section>
  )
}
