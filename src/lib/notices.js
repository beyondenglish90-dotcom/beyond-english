import { supabase } from './supabaseClient'

// notices 테이블 행(snake_case) ↔ 앱에서 쓰는 camelCase 모양으로 변환.
function mapNotice(row) {
  return {
    id: row.id,
    date: row.created_at?.slice(0, 10),
    titleKo: row.title_ko,
    titleEn: row.title_en,
    excerptKo: row.excerpt_ko,
    excerptEn: row.excerpt_en,
    contentKo: row.content_ko,
    contentEn: row.content_en,
    status: row.status,
  }
}

// RLS가 알아서 필터링한다: 로그인 안 했거나 관리자가 아니면 published만, 관리자면 전체.
export async function fetchNotices() {
  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map(mapNotice)
}

export async function fetchNoticeById(id) {
  const { data, error } = await supabase.from('notices').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data ? mapNotice(data) : null
}

export async function createNotice({ titleKo, titleEn, date }) {
  const { data, error } = await supabase
    .from('notices')
    .insert({
      title_ko: titleKo,
      title_en: titleEn,
      content_ko: titleKo,
      content_en: titleEn,
      status: 'draft',
      ...(date ? { created_at: new Date(date).toISOString() } : {}),
    })
    .select()
    .single()
  if (error) throw error
  return mapNotice(data)
}

export async function setNoticeStatus(id, status) {
  const { error } = await supabase.from('notices').update({ status }).eq('id', id)
  if (error) throw error
}

export async function deleteNotice(id) {
  const { error } = await supabase.from('notices').delete().eq('id', id)
  if (error) throw error
}
