import { GraduationCap, Briefcase, Languages } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { instructor } from '../data/instructor'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

function TimelineList({ items, lang }) {
  return (
    <ul style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            display: 'flex',
            gap: 16,
            padding: '16px 0',
            borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
          }}
        >
          <span className="sub" style={{ fontSize: 13, fontWeight: 700, width: 90, flexShrink: 0 }}>
            {item.period}
          </span>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: '#1B1E28' }}>
              {lang === 'ko' ? item.titleKo : item.titleEn}
            </p>
            <p className="sub" style={{ margin: 0, fontSize: 14 }}>
              {lang === 'ko' ? item.orgKo : item.orgEn}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}

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

      <section className="section">
        <div className="container grid grid-2" style={{ alignItems: 'start' }}>
          <Card style={{ padding: 28 }} hover={false}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <GraduationCap className="icon" style={{ color: 'var(--primary)' }} />
              <h3 style={{ margin: 0 }}>{t('about.education')}</h3>
            </div>
            <TimelineList items={instructor.education} lang={lang} />
          </Card>

          <Card style={{ padding: 28 }} hover={false}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Briefcase className="icon" style={{ color: 'var(--primary)' }} />
              <h3 style={{ margin: 0 }}>{t('about.experience')}</h3>
            </div>
            <TimelineList items={instructor.experience} lang={lang} />
          </Card>
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
