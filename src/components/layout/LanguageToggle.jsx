import { useLanguage } from '../../i18n/LanguageContext'

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage()

  return (
    <div
      role="group"
      aria-label="Language"
      style={{
        display: 'flex',
        border: '1px solid var(--border)',
        borderRadius: 999,
        padding: 3,
        gap: 2,
        background: 'var(--surface)',
      }}
    >
      {['ko', 'en'].map((code) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          style={{
            border: 'none',
            cursor: 'pointer',
            borderRadius: 999,
            padding: '6px 12px',
            fontSize: 13,
            fontWeight: 700,
            background: lang === code ? 'var(--primary)' : 'transparent',
            color: lang === code ? '#fff' : 'var(--sub)',
            transition: '.15s',
          }}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
