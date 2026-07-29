import { GraduationCap, Languages } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { instructor } from '../data/instructor'
import Button from '../components/common/Button'

export default function AboutPage() {
  const { t, lang } = useLanguage()
  const languages = lang === 'ko' ? instructor.languagesKo : instructor.languagesEn

  return (
    <div>
      <section className="section" style={{ background: 'linear-gradient(180deg, #EAF2FF 0%, var(--bg) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'center' }}>
          <div
            style={{
              width: 220,
              height: 220,
              borderRadius: '50%',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              margin: '0 auto',
              gap: 8,
              overflow: 'hidden',
            }}
          >
            {instructor.photo ? (
              <img
                src={instructor.photo}
                alt={instructor.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <>
                <GraduationCap className="icon" style={{ width: 64, height: 64, color: 'var(--primary)' }} />
                <span className="sub" style={{ fontSize: 12 }}>{t('about.photoPlaceholder')}</span>
              </>
            )}
          </div>

          <div style={{ flex: '1 1 420px' }}>
            <span className="eyebrow">{t('about.eyebrow')}</span>
            <h1>{instructor.name}</h1>
            <p style={{ color: 'var(--primary)', fontWeight: 700, marginTop: -8 }}>
              {lang === 'ko' ? instructor.roleKo : instructor.roleEn}
            </p>
            <p style={{ maxWidth: 620 }}>{lang === 'ko' ? instructor.bioKo : instructor.bioEn}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
              <Languages className="icon" style={{ width: 18, height: 18, color: 'var(--sub)' }} />
              <span className="sub" style={{ fontSize: 14 }}>{t('about.languages')}:</span>
              {languages.map((l) => (
                <span
                  key={l}
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    background: '#EAF2FF',
                    color: 'var(--primary-dark)',
                    borderRadius: 999,
                    padding: '4px 12px',
                  }}
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--primary)', color: '#fff' }}>
        <div className="container text-center">
          <h2 style={{ color: '#fff' }}>{t('home.instructor.title')}</h2>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 }}>
            <Button as="link" to="/pricing" style={{ background: '#fff', color: 'var(--primary)' }}>
              {t('curriculum.seePricing')}
            </Button>
            <Button as="link" to="/signup" style={{ background: 'transparent', border: '1.5px solid #fff', color: '#fff' }}>
              {t('about.cta')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
