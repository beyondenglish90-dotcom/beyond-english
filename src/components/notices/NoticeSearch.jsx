import { Search } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'

export default function NoticeSearch({ value, onChange }) {
  const { t } = useLanguage()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        border: '1px solid var(--border)',
        borderRadius: 999,
        padding: '10px 18px',
        background: 'var(--surface)',
        maxWidth: 360,
      }}
    >
      <Search className="icon" style={{ width: 18, height: 18, color: 'var(--sub)' }} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('notices.searchPlaceholder')}
        style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 14, width: '100%', fontFamily: 'inherit' }}
      />
    </div>
  )
}
