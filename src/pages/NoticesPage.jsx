import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { fetchNotices } from '../lib/notices'
import SectionTitle from '../components/common/SectionTitle'
import NoticeSearch from '../components/notices/NoticeSearch'

const PAGE_SIZE = 5

export default function NoticesPage() {
  const { t, lang } = useLanguage()
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchNotices()
      .then(setNotices)
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return notices
    return notices.filter((n) => (lang === 'ko' ? n.titleKo : n.titleEn).toLowerCase().includes(q))
  }, [notices, query, lang])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleSearch = (value) => {
    setQuery(value)
    setPage(1)
  }

  return (
    <div>
      <section className="section-sm" style={{ background: 'linear-gradient(180deg, #EAF2FF 0%, var(--bg) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <SectionTitle eyebrow={t('notices.eyebrow')} title={t('notices.title')} subtitle={t('notices.intro')} />
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            <NoticeSearch value={query} onChange={handleSearch} />
            <span className="sub" style={{ fontSize: 13 }}>
              {filtered.length} {t('notices.resultCount')}
            </span>
          </div>

          {loading ? (
            <p className="sub text-center" style={{ padding: '48px 0' }}>{t('common.loading')}</p>
          ) : pageItems.length === 0 ? (
            <p className="sub text-center" style={{ padding: '48px 0' }}>{t('notices.noResults')}</p>
          ) : (
            <ul style={{ display: 'flex', flexDirection: 'column' }}>
              {pageItems.map((notice) => (
                <li key={notice.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <Link
                    to={`/notices/${notice.id}`}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '18px 4px', color: 'var(--text)' }}
                  >
                    <Bell className="icon" style={{ width: 18, height: 18, color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 700, color: '#1B1E28' }}>
                        {lang === 'ko' ? notice.titleKo : notice.titleEn}
                      </p>
                      <p className="sub" style={{ margin: '4px 0 0', fontSize: 14 }}>
                        {lang === 'ko' ? notice.excerptKo : notice.excerptEn}
                      </p>
                    </div>
                    <span className="sub" style={{ fontSize: 13, flexShrink: 0 }}>{notice.date}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 32 }}>
              <button
                className="btn btn-outline btn-sm"
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="icon" style={{ width: 16, height: 16 }} />
                {t('notices.prev')}
              </button>
              <span className="sub" style={{ fontSize: 14 }}>{currentPage} / {totalPages}</span>
              <button
                className="btn btn-outline btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                {t('notices.next')}
                <ChevronRight className="icon" style={{ width: 16, height: 16 }} />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
