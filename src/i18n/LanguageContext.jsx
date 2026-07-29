import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import ko from './locales/ko.json'
import en from './locales/en.json'

const dictionaries = { ko, en }
const LanguageContext = createContext(null)

function resolve(dict, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), dict)
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('be_lang') || 'ko')

  const setLang = useCallback((next) => {
    setLangState(next)
    localStorage.setItem('be_lang', next)
  }, [])

  const toggleLang = useCallback(() => {
    setLang(lang === 'ko' ? 'en' : 'ko')
  }, [lang, setLang])

  const t = useCallback((key) => {
    const value = resolve(dictionaries[lang], key)
    return value !== undefined ? value : key
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, toggleLang, t }), [lang, setLang, toggleLang, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
