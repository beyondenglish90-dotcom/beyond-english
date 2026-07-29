import { useLanguage } from '../../i18n/LanguageContext'
import Card from '../common/Card'

const WIDTH = 640
const HEIGHT = 220
const PADDING = 32
const BAR_GAP = 24

export default function AdminChart({ data }) {
  const { t, lang } = useLanguage()
  const max = Math.max(1, ...data.map((m) => m.value))
  const chartHeight = HEIGHT - PADDING * 2
  const barWidth = (WIDTH - PADDING * 2 - BAR_GAP * (data.length - 1)) / data.length

  return (
    <Card style={{ padding: 28 }} hover={false}>
      <h3 style={{ marginTop: 0 }}>{t('admin.chartTitle')}</h3>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ width: '100%', height: 'auto' }} role="img" aria-label={t('admin.chartTitle')}>
        {data.map((m, i) => {
          const barHeight = (m.value / max) * chartHeight
          const x = PADDING + i * (barWidth + BAR_GAP)
          const y = HEIGHT - PADDING - barHeight
          return (
            <g key={m.monthKo}>
              <rect x={x} y={y} width={barWidth} height={barHeight} rx={8} fill="var(--primary)" opacity={i === data.length - 1 ? 1 : 0.65} />
              <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fontSize="12" fontWeight="700" fill="#1B1E28">
                {m.value}
              </text>
              <text x={x + barWidth / 2} y={HEIGHT - PADDING + 18} textAnchor="middle" fontSize="12" fill="#8B95A1">
                {lang === 'ko' ? m.monthKo : m.monthEn}
              </text>
            </g>
          )
        })}
      </svg>
    </Card>
  )
}
