import { useLanguage } from '../../i18n/LanguageContext'

export default function PageStub({ title }) {
  const { t } = useLanguage()
  return (
    <div className="container page-stub">
      <h1>{title}</h1>
      <p className="sub">{t('common.comingSoon')}</p>
    </div>
  )
}
