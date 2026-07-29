import { Users, UserPlus } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import Card from '../common/Card'

export default function StatsCards({ total, thisMonth }) {
  const { t } = useLanguage()

  const cards = [
    { icon: Users, label: t('admin.statTotalMembers'), value: total },
    { icon: UserPlus, label: t('admin.statNewThisMonth'), value: thisMonth },
  ]

  return (
    <div className="grid grid-2">
      {cards.map((stat) => (
        <Card key={stat.label} style={{ padding: 22 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: '#EAF2FF',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
            }}
          >
            <stat.icon className="icon" style={{ width: 20, height: 20 }} />
          </div>
          <p className="sub" style={{ margin: 0, fontSize: 13 }}>{stat.label}</p>
          <p style={{ margin: '2px 0 0', fontSize: 28, fontWeight: 700, color: '#1B1E28' }}>{stat.value}</p>
        </Card>
      ))}
    </div>
  )
}
