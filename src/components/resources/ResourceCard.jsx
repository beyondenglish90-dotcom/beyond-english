import { FileText, Image as ImageIcon, Download, Clock, Trash2 } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { resourceCategories } from '../../data/resources'
import { formatFileSize, deleteResource } from '../../lib/resources'
import Card from '../common/Card'
import Button from '../common/Button'

export default function ResourceCard({ resource, onDeleted }) {
  const { t, lang } = useLanguage()
  const { user } = useAuth()
  const Icon = resource.type === 'image' ? ImageIcon : FileText
  const category = resourceCategories.find((c) => c.id === resource.category)

  const handleDelete = async () => {
    await deleteResource(resource.id)
    onDeleted?.(resource.id)
  }

  return (
    <Card style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: '#EAF2FF',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon className="icon" style={{ width: 22, height: 22 }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--primary-dark)',
              background: '#EAF2FF',
              borderRadius: 999,
              padding: '2px 10px',
            }}
          >
            {category ? (lang === 'ko' ? category.ko : category.en) : resource.category}
          </span>
          <span className="sub" style={{ fontSize: 12 }}>{resource.date}</span>
        </div>
        <p style={{ margin: '4px 0 0', fontWeight: 700, color: '#1B1E28' }}>
          {lang === 'ko' ? resource.titleKo : resource.titleEn}
        </p>
        <p className="sub" style={{ margin: 0, fontSize: 13 }}>{formatFileSize(resource.fileSize)}</p>
      </div>

      {resource.fileUrl ? (
        <Button as="a" href={resource.fileUrl} download target="_blank" rel="noreferrer" size="sm" variant="outline">
          <Download className="icon" style={{ width: 16, height: 16 }} />
          {t('resources.download')}
        </Button>
      ) : (
        <span className="sub" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, flexShrink: 0 }}>
          <Clock className="icon" style={{ width: 16, height: 16 }} />
          {t('resources.comingSoon')}
        </span>
      )}

      {user?.role === 'admin' && (
        <button
          onClick={handleDelete}
          className="btn btn-outline btn-sm"
          style={{ flexShrink: 0, color: '#E03131', borderColor: '#F3C6C6' }}
        >
          <Trash2 className="icon" style={{ width: 14, height: 14 }} />
        </button>
      )}
    </Card>
  )
}
