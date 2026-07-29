import { Clock, ChevronRight } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { programs } from '../data/programs'
import { getIcon } from '../components/common/iconMap'
import SectionTitle from '../components/common/SectionTitle'
import Card from '../components/common/Card'

function IconTile({ icon, title, desc }) {
  const Icon = getIcon(icon)
  return (
    <Card style={{ padding: 24 }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: '#EAF2FF',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 14,
        }}
      >
        <Icon className="icon" style={{ width: 22, height: 22 }} />
      </div>
      <h4 style={{ fontFamily: 'Inter', fontSize: 15 }}>{title}</h4>
      <p className="sub" style={{ fontSize: 13, margin: 0 }}>{desc}</p>
    </Card>
  )
}

function FlowStep({ icon, title, desc, index, total }) {
  const Icon = getIcon(icon)
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 140px', minWidth: 140 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'var(--primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
          }}
        >
          <Icon className="icon" style={{ width: 26, height: 26 }} />
        </div>
        <h4 style={{ fontFamily: 'Inter', fontSize: 15, textAlign: 'center' }}>{title}</h4>
        <p className="sub" style={{ fontSize: 13, textAlign: 'center', margin: 0 }}>{desc}</p>
      </div>
      {index < total - 1 && (
        <ChevronRight className="icon flow-arrow" style={{ width: 20, height: 20, color: 'var(--border)', alignSelf: 'center', flexShrink: 0 }} />
      )}
    </>
  )
}

function ProgramSection({ program, lang, t }) {
  const isAdventure = program.id === 'adventure-club'

  return (
    <section className="section" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        <div style={{ marginBottom: 32 }}>
          <span className="eyebrow">{lang === 'ko' ? program.audienceKo : program.audienceEn}</span>
          <h2>{lang === 'ko' ? program.nameKo : program.nameEn}</h2>
          <p style={{ maxWidth: 640 }}>{lang === 'ko' ? program.goalKo : program.goalEn}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--sub)', fontSize: 14 }}>
            <Clock className="icon" style={{ width: 16, height: 16 }} />
            {lang === 'ko' ? program.sessionKo : program.sessionEn}
          </div>
        </div>

        {isAdventure ? (
          <>
            <h3 style={{ fontSize: 18, fontFamily: 'Inter' }}>{t('curriculum.activitiesTitle')}</h3>
            <div className="grid grid-3" style={{ marginBottom: 40 }}>
              {program.activities.map((a) => (
                <IconTile
                  key={a.titleKo}
                  icon={a.icon}
                  title={lang === 'ko' ? a.titleKo : a.titleEn}
                  desc={lang === 'ko' ? a.descKo : a.descEn}
                />
              ))}
            </div>
            <h3 style={{ fontSize: 18, fontFamily: 'Inter' }}>{t('curriculum.membershipTitle')}</h3>
            <div className="grid grid-4">
              {program.membershipHighlights.map((h) => (
                <IconTile
                  key={h.titleKo}
                  icon={h.icon}
                  title={lang === 'ko' ? h.titleKo : h.titleEn}
                  desc={lang === 'ko' ? h.descKo : h.descEn}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <h3 style={{ fontSize: 18, fontFamily: 'Inter' }}>{t('curriculum.flowTitle')}</h3>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 40, position: 'relative' }}>
              {program.weeklyFlow.map((step, i) => (
                <FlowStep
                  key={step.titleKo}
                  icon={step.icon}
                  title={lang === 'ko' ? step.titleKo : step.titleEn}
                  desc={lang === 'ko' ? step.descKo : step.descEn}
                  index={i}
                  total={program.weeklyFlow.length}
                />
              ))}
            </div>
            <h3 style={{ fontSize: 18, fontFamily: 'Inter' }}>{t('curriculum.highlightsTitle')}</h3>
            <div className="grid grid-4">
              {program.highlights.map((h) => (
                <IconTile
                  key={h.titleKo}
                  icon={h.icon}
                  title={lang === 'ko' ? h.titleKo : h.titleEn}
                  desc={lang === 'ko' ? h.descKo : h.descEn}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default function CurriculumPage() {
  const { t, lang } = useLanguage()

  return (
    <div>
      <section className="section-sm" style={{ background: 'linear-gradient(180deg, #EAF2FF 0%, var(--bg) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <SectionTitle eyebrow={t('curriculum.eyebrow')} title={t('curriculum.title')} subtitle={t('curriculum.intro')} />
        </div>
      </section>

      {programs.map((program) => (
        <ProgramSection key={program.id} program={program} lang={lang} t={t} />
      ))}
    </div>
  )
}
