import { supabase } from './supabaseClient'

// profiles.created_at은 관리자만 전체 조회 가능(RLS "profiles are viewable by admins").
export async function fetchMemberCreatedDates() {
  const { data, error } = await supabase.from('profiles').select('created_at')
  if (error) throw error
  return data.map((row) => new Date(row.created_at))
}

export function countThisMonth(dates) {
  const now = new Date()
  return dates.filter((d) => d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()).length
}

export function buildMonthlySignups(dates, monthsBack = 6) {
  const now = new Date()
  const buckets = []
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    buckets.push({ year: d.getFullYear(), month: d.getMonth(), count: 0 })
  }

  dates.forEach((date) => {
    const bucket = buckets.find((b) => b.year === date.getFullYear() && b.month === date.getMonth())
    if (bucket) bucket.count += 1
  })

  return buckets.map((b) => {
    const label = new Date(b.year, b.month, 1)
    return {
      monthKo: `${b.month + 1}월`,
      monthEn: label.toLocaleString('en-US', { month: 'short' }),
      value: b.count,
    }
  })
}
