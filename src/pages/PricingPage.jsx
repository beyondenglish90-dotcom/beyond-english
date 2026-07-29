import { CheckCircle2, MessageCircle, Phone } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { programs } from '../data/programs'
import SectionTitle from '../components/common/SectionTitle'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

function PricingCard({ program, lang, t }) {
  const recommended = program.recommendedFor ? (lang === 'ko' ? program.recommendedFor.ko : program.recommendedFor.en) : null

  return (
    <Card style={{ padding: 32, display: 'flex', flexDirection: 'column' }} hover={false}>
      <span className="eyebrow">{lang === 'ko' ? program.audienceKo : program.audienceEn}</span>
      <h3 style={{ fontSize: 24 }}>{lang === 'ko' ? program.nameKo : program.nameEn}</h3>
      <p className="sub" style={{ fontStyle: 'italic', fontSize: 14, marginTop: -8 }}>
        {lang === 'ko' ? program.taglineKo : program.taglineEn}
      </p>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '12px 0 20px' }}>
        <span style={{ fontSize: 40, fontWeight: 700, color: 'var(--primary)' }}>${program.price}</span>
        <span className="sub">{t('pricing.monthly')}</span>
      </div>

      <h4 style={{ fontFamily: 'Inter', fontSize: 15 }}>{t('pricing.benefitsTitle')}</h4>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {program.benefits.map((b) => (
          <li key={b.ko} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14 }}>
            <CheckCircle2 className="icon" style={{ width: 18, height: 18, color: 'var(--primary)', flexShrink: 0, marginTop: 1 }} />
            {lang === 'ko' ? b.ko : b.en}
          </li>
        ))}
      </ul>

      {recommended && (
        <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: 20, marginBottom: 24 }}>
          <h4 style={{ fontFamily: 'Inter', fontSize: 14 }}>{t('pricing.recommendedTitle')}</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {recommended.map((r) => (
              <li key={r} style={{ fontSize: 13, color: 'var(--text)' }}>
                ✔ {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button as="a" href="#contact" className="btn-block" style={{ marginTop: 'auto' }}>
        {t('pricing.cta')}
      </Button>
    </Card>
  )
}

export default function PricingPage() {
  const { t, lang } = useLanguage()

  return (
    <div>
      <section className="section-sm" style={{ background: 'linear-gradient(180deg, #EAF2FF 0%, var(--bg) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <SectionTitle eyebrow={t('pricing.eyebrow')} title={t('pricing.title')} subtitle={t('pricing.intro')} />
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2" style={{ alignItems: 'stretch' }}>
          {programs.map((program) => (
            <PricingCard key={program.id} program={program} lang={lang} t={t} />
          ))}
        </div>
      </section>

      <section id="contact" className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div className="container text-center">
          <h2>{t('about.cta')}</h2>
          <p className="sub">{t('pricing.contactNote')}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 16 }}>
            <span
              className="btn btn-outline"
              style={{ cursor: 'default' }}
            >
              <MessageCircle className="icon" style={{ width: 18, height: 18 }} />
              Beyond-English
            </span>
            <Button as="a" href="tel:548-888-5301" variant="outline">
              <Phone className="icon" style={{ width: 18, height: 18 }} />
              548-888-5301
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
