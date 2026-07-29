import { useEffect, useMemo, useState } from 'react'
import { Search, Plus, Trash2, Eye, EyeOff } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import { fetchNotices, createNotice, setNoticeStatus, deleteNotice } from '../../lib/notices'
import Card from '../common/Card'
import Button from '../common/Button'

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: 8,
  border: '1px solid var(--border)',
  fontFamily: 'inherit',
  fontSize: 13,
  background: 'var(--bg)',
}

export default function NoticesManager() {
  const { t, lang } = useLanguage()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ titleKo: '', titleEn: '', date: '' })

  useEffect(() => {
    fetchNotices()
      .then(setList)
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return list.filter((n) => {
      const matchesQuery = !q || (lang === 'ko' ? n.titleKo : n.titleEn).toLowerCase().includes(q)
      const matchesStatus = statusFilter === 'all' || n.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [list, query, statusFilter, lang])

  const toggleStatus = async (id) => {
    const target = list.find((n) => n.id === id)
    const nextStatus = target.status === 'published' ? 'draft' : 'published'
    setList((prev) => prev.map((n) => (n.id === id ? { ...n, status: nextStatus } : n)))
    await setNoticeStatus(id, nextStatus)
  }

  const removeNotice = async (id) => {
    setList((prev) => prev.filter((n) => n.id !== id))
    await deleteNotice(id)
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    const created = await createNotice(form)
    setList((prev) => [created, ...prev])
    setForm({ titleKo: '', titleEn: '', date: '' })
    setShowForm(false)
  }

  return (
    <Card style={{ padding: 28 }} hover={false}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <h3 style={{ margin: 0 }}>{t('admin.noticesManageTitle')}</h3>
        <Button size="sm" onClick={() => setShowForm((v) => !v)}>
          <Plus className="icon" style={{ width: 16, height: 16 }} />
          {t('admin.addNotice')}
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20, padding: 16, background: 'var(--bg)', borderRadius: 12 }}
        >
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>{t('admin.titleKoLabel')}</label>
            <input required style={inputStyle} value={form.titleKo} onChange={(e) => setForm((f) => ({ ...f, titleKo: e.target.value }))} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>{t('admin.titleEnLabel')}</label>
            <input required style={inputStyle} value={form.titleEn} onChange={(e) => setForm((f) => ({ ...f, titleEn: e.target.value }))} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>{t('admin.dateLabel')}</label>
            <input type="date" style={inputStyle} value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <Button type="submit" size="sm">{t('admin.save')}</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setShowForm(false)}>{t('admin.cancel')}</Button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            border: '1px solid var(--border)',
            borderRadius: 999,
            padding: '8px 14px',
            flex: '1 1 220px',
          }}
        >
          <Search className="icon" style={{ width: 16, height: 16, color: 'var(--sub)' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('admin.searchPlaceholder')}
            style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, width: '100%', fontFamily: 'inherit' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'published', 'draft'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={statusFilter === s ? 'btn btn-sm' : 'btn btn-outline btn-sm'}
            >
              {t(`admin.filter${s === 'all' ? 'All' : s === 'published' ? 'Published' : 'Draft'}`)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="sub" style={{ padding: '24px 0', textAlign: 'center' }}>{t('common.loading')}</p>
      ) : filtered.length === 0 ? (
        <p className="sub" style={{ padding: '24px 0', textAlign: 'center' }}>{t('admin.empty')}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filtered.map((n) => (
            <div
              key={n.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 0',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  borderRadius: 999,
                  padding: '3px 10px',
                  flexShrink: 0,
                  color: n.status === 'published' ? '#12A150' : 'var(--sub)',
                  background: n.status === 'published' ? '#E7F8EE' : 'var(--bg)',
                }}
              >
                {n.status === 'published' ? t('admin.statusPublished') : t('admin.statusDraft')}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {lang === 'ko' ? n.titleKo : n.titleEn}
                </p>
              </div>
              <span className="sub" style={{ fontSize: 12, flexShrink: 0 }}>{n.date}</span>
              <button
                onClick={() => toggleStatus(n.id)}
                className="btn btn-outline btn-sm"
                style={{ flexShrink: 0 }}
                title={n.status === 'published' ? t('admin.statusDraft') : t('admin.statusPublished')}
              >
                {n.status === 'published' ? <EyeOff className="icon" style={{ width: 14, height: 14 }} /> : <Eye className="icon" style={{ width: 14, height: 14 }} />}
              </button>
              <button
                onClick={() => removeNotice(n.id)}
                className="btn btn-outline btn-sm"
                style={{ flexShrink: 0, color: '#E03131', borderColor: '#F3C6C6' }}
              >
                <Trash2 className="icon" style={{ width: 14, height: 14 }} />
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
