import { GraduationCap, ArrowRight } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import { instructor } from '../../data/instructor'
import Button from '../common/Button'

export default function InstructorTeaser() {
  const { t, lang } = useLanguage()
  const credentials = lang === 'ko' ? instructor.credentialsKo : instructor.credentialsEn

  return (
    <section className="section">
      <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: '#EAF2FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            margin: '0 auto',
            overflow: 'hidden',
          }}
        >
          {instructor.photo ? (
            <img src={instructor.photo} alt={instructor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <GraduationCap className="icon" style={{ width: 72, height: 72, color: 'var(--primary)' }} />
          )}
        </div>

        <div style={{ flex: '1 1 360px' }}>
          <span className="eyebrow">{t('home.instructor.eyebrow')}</span>
          <h2>{t('home.instructor.title')}</h2>
          <p style={{ maxWidth: 520 }}>{t('home.instructor.description')}</p>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '16px 0 24px' }}>
            {credentials.map((c) => (
              <li key={c} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 15 }}>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>·</span>
                {c}
              </li>
            ))}
          </ul>
          <Button as="link" to="/about" variant="outline">
            {t('home.instructor.cta')}
            <ArrowRight className="icon" style={{ width: 16, height: 16 }} />
          </Button>
        </div>
      </div>
    </section>
  )
}
