import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl,
    key: supabaseKey ? 'present' : 'missing'
  })
  throw new Error('Missing Supabase environment variables')
}

// クライアントサイド用のSupabaseクライアント
export const supabase = createClient(supabaseUrl, supabaseKey)

// サーバーサイド用のSupabaseクライアント（Service Role Key使用）
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// データベース操作のヘルパー関数
export const db = {
  // プログラム一覧取得
  async getPrograms() {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // プログラム詳細取得
  async getProgram(id: number) {
    const { data, error } = await supabase
      .from('programs')
      .select(`
        *,
        chapters (
          id,
          title,
          content,
          video_url,
          order_index
        )
      `)
      .eq('id', id)
      .single()
    
    return { data, error }
  },

  // チャプター詳細取得
  async getChapter(programId: number, chapterId: number) {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('program_id', programId)
      .eq('id', chapterId)
      .single()
    
    return { data, error }
  },

  // ユーザープログレス取得
  async getUserProgress(userId: string, programId: number) {
    const { data, error } = await supabase
      .from('user_progress')
      .select(`
        *,
        chapters (
          id,
          title,
          order_index
        )
      `)
      .eq('user_id', userId)
      .eq('chapters.program_id', programId)
    
    return { data, error }
  },

  // プログレス更新
  async updateProgress(userId: string, chapterId: number, progress: number) {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        chapter_id: chapterId,
        progress_percentage: progress,
        completed_at: progress === 100 ? new Date().toISOString() : null
      })
    
    return { data, error }
  }
}
