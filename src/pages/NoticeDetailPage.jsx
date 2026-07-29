import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { fetchNoticeById } from '../lib/notices'
import Button from '../components/common/Button'
import PageStub from '../components/common/PageStub'

export default function NoticeDetailPage() {
  const { id } = useParams()
  const { t, lang } = useLanguage()
  const [notice, setNotice] = useState(undefined)

  useEffect(() => {
    setNotice(undefined)
    fetchNoticeById(id).then(setNotice)
  }, [id])

  if (notice === undefined) {
    return <PageStub title={t('common.loading')} />
  }

  if (!notice) {
    return <PageStub title="404" />
  }

  return (
    <div className="container section" style={{ maxWidth: 720, margin: '0 auto' }}>
      <Button as="link" to="/notices" variant="ghost" size="sm" style={{ marginBottom: 24 }}>
        <ArrowLeft className="icon" style={{ width: 16, height: 16 }} />
        {t('notices.back')}
      </Button>

      <span className="eyebrow">{t('notices.eyebrow')}</span>
      <h1>{lang === 'ko' ? notice.titleKo : notice.titleEn}</h1>
      <p className="sub" style={{ fontSize: 14 }}>
        {t('notices.publishedOn')} {notice.date}
      </p>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, marginTop: 16, fontSize: 16, lineHeight: 1.8 }}>
        <p>{lang === 'ko' ? notice.contentKo : notice.contentEn}</p>
      </div>
    </div>
  )
}
