import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { fetchMemberCreatedDates, countThisMonth, buildMonthlySignups } from '../lib/adminStats'
import SectionTitle from '../components/common/SectionTitle'
import StatsCards from '../components/admin/StatsCards'
import AdminChart from '../components/admin/AdminChart'
import NoticesManager from '../components/admin/NoticesManager'

export default function AdminPage() {
  const { t } = useLanguage()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchMemberCreatedDates().then((dates) => {
      setStats({
        total: dates.length,
        thisMonth: countThisMonth(dates),
        monthlySignups: buildMonthlySignups(dates),
      })
    })
  }, [])

  return (
    <div className="container section">
      <SectionTitle eyebrow={t('admin.eyebrow')} title={t('admin.title')} subtitle={t('admin.intro')} align="left" />

      {stats ? (
        <>
          <div style={{ marginBottom: 32 }}>
            <StatsCards total={stats.total} thisMonth={stats.thisMonth} />
          </div>
          <div style={{ marginBottom: 32 }}>
            <AdminChart data={stats.monthlySignups} />
          </div>
        </>
      ) : (
        <p className="sub" style={{ marginBottom: 32 }}>{t('common.loading')}</p>
      )}

      <NoticesManager />
    </div>
  )
}
