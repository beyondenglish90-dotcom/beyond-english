import { useState } from 'react'
import { UploadCloud, CheckCircle2, Lock } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { resourceCategories } from '../../data/resources'
import { uploadResource } from '../../lib/resources'
import Card from '../common/Card'
import Button from '../common/Button'

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid var(--border)',
  fontFamily: 'inherit',
  fontSize: 14,
  background: 'var(--bg)',
}

export default function ResourceUploadForm({ onUploaded }) {
  const { t, lang } = useLanguage()
  const { user } = useAuth()
  const [titleKo, setTitleKo] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [category, setCategory] = useState(resourceCategories[1].id)
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!user || user.role !== 'admin') {
    return (
      <Card style={{ padding: 28, textAlign: 'center' }} hover={false}>
        <Lock className="icon" style={{ width: 28, height: 28, color: 'var(--sub)', margin: '0 auto 8px' }} />
        <p className="sub" style={{ margin: 0 }}>{t('resources.loginPrompt')}</p>
        <Button as="link" to="/login" size="sm" variant="outline" style={{ marginTop: 12 }}>
          {t('resources.goLogin')}
        </Button>
      </Card>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    setError('')
    setSuccess(false)
    setSubmitting(true)
    try {
      const created = await uploadResource({ titleKo, titleEn: titleEn || titleKo, category, file })
      onUploaded?.(created)
      setTitleKo('')
      setTitleEn('')
      setFile(null)
      e.target.reset()
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card style={{ padding: 28 }} hover={false}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <UploadCloud className="icon" style={{ color: 'var(--primary)' }} />
        <h3 style={{ margin: 0 }}>{t('resources.uploadTitle')}</h3>
      </div>
      <p className="sub" style={{ fontSize: 14 }}>{t('resources.uploadDesc')}</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
            {t('resources.uploadFileTitle')}
          </label>
          <input
            type="text"
            required
            style={inputStyle}
            placeholder={t('resources.uploadFileTitle')}
            value={titleKo}
            onChange={(e) => setTitleKo(e.target.value)}
          />
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
            {t('resources.uploadCategory')}
          </label>
          <select style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)}>
            {resourceCategories
              .filter((c) => c.id !== 'all')
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {lang === 'ko' ? c.ko : c.en}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>
            {t('resources.uploadFile')}
          </label>
          <input type="file" required style={inputStyle} onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>

        {error && <p style={{ color: '#E03131', fontSize: 13, margin: 0 }}>{error}</p>}

        <Button type="submit" className="btn-block" disabled={submitting}>
          {t('resources.uploadSubmit')}
        </Button>

        {success && (
          <p style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontSize: 13, margin: 0 }}>
            <CheckCircle2 className="icon" style={{ width: 16, height: 16 }} />
            {t('resources.uploadSuccess')}
          </p>
        )}
      </form>
    </Card>
  )
}
