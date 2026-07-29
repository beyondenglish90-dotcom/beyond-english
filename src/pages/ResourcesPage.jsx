import { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { resourceCategories } from '../data/resources'
import { fetchResources } from '../lib/resources'
import SectionTitle from '../components/common/SectionTitle'
import ResourceCard from '../components/resources/ResourceCard'
import ResourceUploadForm from '../components/resources/ResourceUploadForm'

export default function ResourcesPage() {
  const { t, lang } = useLanguage()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    fetchResources()
      .then(setResources)
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(
    () => (activeCategory === 'all' ? resources : resources.filter((r) => r.category === activeCategory)),
    [resources, activeCategory],
  )

  return (
    <div>
      <section className="section-sm" style={{ background: 'linear-gradient(180deg, #EAF2FF 0%, var(--bg) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <SectionTitle eyebrow={t('resources.eyebrow')} title={t('resources.title')} subtitle={t('resources.intro')} />
        </div>
      </section>

      <section className="section">
        <div className="container resources-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 40, alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              {resourceCategories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={activeCategory === c.id ? 'btn btn-sm' : 'btn btn-outline btn-sm'}
                >
                  {lang === 'ko' ? c.ko : c.en}
                </button>
              ))}
            </div>

            {loading ? (
              <p className="sub">{t('common.loading')}</p>
            ) : filtered.length === 0 ? (
              <p className="sub">{t('resources.empty')}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {filtered.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onDeleted={(id) => setResources((prev) => prev.filter((r) => r.id !== id))}
                  />
                ))}
              </div>
            )}
          </div>

          <ResourceUploadForm onUploaded={(created) => setResources((prev) => [created, ...prev])} />
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .resources-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
