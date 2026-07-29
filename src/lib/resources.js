import { supabase } from './supabaseClient'

const BUCKET = 'resources'

function mapResource(row) {
  return {
    id: row.id,
    category: row.category,
    titleKo: row.title_ko,
    titleEn: row.title_en,
    fileUrl: row.file_url,
    fileSize: row.file_size,
    type: row.file_type,
    date: row.created_at?.slice(0, 10),
  }
}

export function formatFileSize(bytes) {
  if (!bytes) return '—'
  const mb = bytes / (1024 * 1024)
  if (mb < 0.1) return `${Math.round(bytes / 1024)}KB`
  return `${mb.toFixed(1)}MB`
}

export async function fetchResources() {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map(mapResource)
}

function inferFileType(file) {
  if (file.type.startsWith('image/')) return 'image'
  if (file.type === 'application/pdf') return 'pdf'
  return 'other'
}

export async function uploadResource({ titleKo, titleEn, category, file }) {
  const path = `${Date.now()}-${file.name}`
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file)
  if (uploadError) throw uploadError

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)

  const { data, error } = await supabase
    .from('resources')
    .insert({
      category,
      title_ko: titleKo,
      title_en: titleEn,
      file_url: urlData.publicUrl,
      file_size: file.size,
      file_type: inferFileType(file),
    })
    .select()
    .single()
  if (error) throw error
  return mapResource(data)
}

export async function deleteResource(id) {
  const { error } = await supabase.from('resources').delete().eq('id', id)
  if (error) throw error
}
