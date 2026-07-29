import { Users, BookOpen, MessageCircle, Globe } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import SectionTitle from '../common/SectionTitle'
import Card from '../common/Card'

const ICONS = [Users, BookOpen, MessageCircle, Globe]

export default function FeatureHighlights() {
  const { t } = useLanguage()
  const items = t('home.features.items')

  return (
    <section className="section">
      <div className="container">
        <SectionTitle eyebrow={t('home.features.eyebrow')} title={t('home.features.title')} />
        <div className="grid grid-4">
          {items.map((item, i) => {
            const Icon = ICONS[i]
            return (
              <Card key={item.title} style={{ padding: 28 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: '#EAF2FF',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <Icon className="icon" />
                </div>
                <h4 style={{ fontFamily: 'Inter', fontSize: 16 }}>{item.title}</h4>
                <p className="sub" style={{ fontSize: 14, margin: 0 }}>{item.desc}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
