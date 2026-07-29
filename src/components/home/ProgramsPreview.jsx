import { ArrowRight } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import { programs } from '../../data/programs'
import SectionTitle from '../common/SectionTitle'
import Card from '../common/Card'
import Button from '../common/Button'

export default function ProgramsPreview() {
  const { t, lang } = useLanguage()

  return (
    <section className="section" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        <SectionTitle eyebrow={t('home.programs.eyebrow')} title={t('home.programs.title')} />
        <div className="grid grid-2">
          {programs.map((program) => (
            <Card key={program.id} style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: 28 }}>
                <span className="eyebrow">{lang === 'ko' ? program.audienceKo : program.audienceEn}</span>
                <h3 style={{ fontSize: 24 }}>{lang === 'ko' ? program.nameKo : program.nameEn}</h3>
                <p className="sub" style={{ fontStyle: 'italic', fontSize: 14 }}>
                  {lang === 'ko' ? program.taglineKo : program.taglineEn}
                </p>
                <p style={{ fontSize: 15 }}>{lang === 'ko' ? program.descriptionKo : program.descriptionEn}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, margin: '16px 0' }}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--primary)' }}>${program.price}</span>
                  <span className="sub">{t('home.programs.monthly')}</span>
                </div>
                <Button as="link" to="/pricing" variant="outline">
                  {t('home.programs.cta')}
                  <ArrowRight className="icon" style={{ width: 16, height: 16 }} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
