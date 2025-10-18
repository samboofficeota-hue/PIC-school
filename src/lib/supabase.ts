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
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// サーバーサイド用のSupabaseクライアント（Service Role Key使用）
// クライアントサイドでは使用しないため、条件分岐でエラーを防ぐ
export const supabaseAdmin = (() => {
  if (typeof window !== 'undefined') {
    // クライアントサイドでは通常のクライアントを返す
    return supabase
  }
  
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required')
  }
  
  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
})()

// データベース操作のヘルパー関数
export const db = {
  // ユーザープロフィール関連
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    return { data, error }
  },

  async updateUserProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        ...updates,
        updated_at: new Date().toISOString()
      })
    
    return { data, error }
  },

  // プログラム関連
  async getPrograms() {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

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

  async getChapter(programId: number, chapterId: number) {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('program_id', programId)
      .eq('id', chapterId)
      .single()
    
    return { data, error }
  },

  // ユーザープログラム関連
  async getUserPrograms(userId: string) {
    const { data, error } = await supabase
      .from('user_programs')
      .select(`
        *,
        programs (
          id,
          title,
          description,
          thumbnail_url,
          instructor_name,
          duration_hours,
          difficulty_level,
          category
        )
      `)
      .eq('user_id', userId)
      .order('enrolled_at', { ascending: false })
    
    return { data, error }
  },

  async enrollInProgram(userId: string, programId: number) {
    const { data, error } = await supabase
      .from('user_programs')
      .insert({
        user_id: userId,
        program_id: programId
      })
    
    return { data, error }
  },

  // 学習進捗関連
  async getUserProgress(userId: string, programId?: number) {
    let query = supabase
      .from('user_progress')
      .select(`
        *,
        chapters (
          id,
          title,
          order_index,
          programs (
            id,
            title
          )
        )
      `)
      .eq('user_id', userId)
    
    if (programId) {
      query = query.eq('chapters.program_id', programId)
    }
    
    const { data, error } = await query.order('last_accessed_at', { ascending: false })
    
    return { data, error }
  },

  async updateProgress(userId: string, chapterId: number, progress: number, timeSpent: number = 0) {
    const { data, error } = await supabase.rpc('update_user_progress', {
      p_user_id: userId,
      p_chapter_id: chapterId,
      p_progress_percentage: progress,
      p_time_spent_minutes: timeSpent
    })
    
    return { data, error }
  },

  // 実績・ポイント関連
  async getUserAchievements(userId: string) {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements (
          id,
          name,
          description,
          icon_url,
          points,
          category,
          rarity
        )
      `)
      .eq('user_id', userId)
      .order('earned_at', { ascending: false })
    
    return { data, error }
  },

  async getUserPoints(userId: string) {
    const { data, error } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    return { data, error }
  },

  async getAvailableAchievements() {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true)
      .order('points', { ascending: false })
    
    return { data, error }
  },

  // 学習セッション関連
  async createLearningSession(userId: string, chapterId: number) {
    const { data, error } = await supabase
      .from('learning_sessions')
      .insert({
        user_id: userId,
        chapter_id: chapterId
      })
      .select()
      .single()
    
    return { data, error }
  },

  async endLearningSession(sessionId: number, progressBefore: number, progressAfter: number) {
    const { data, error } = await supabase
      .from('learning_sessions')
      .update({
        ended_at: new Date().toISOString(),
        progress_before: progressBefore,
        progress_after: progressAfter,
        duration_minutes: 0 // 計算は別途行う
      })
      .eq('id', sessionId)
    
    return { data, error }
  },

  // 通知関連
  async getUserNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  async markNotificationAsRead(notificationId: number) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
    
    return { data, error }
  },

  // 管理画面用
  async getAllUsers() {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        user_programs (
          programs (
            id,
            title
          )
        ),
        user_points (
          total_points
        )
      `)
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  async getAnalytics() {
    // ユーザー統計
    const { data: userStats, error: userError } = await supabase
      .from('user_profiles')
      .select('id, created_at')
    
    // プログラム統計
    const { data: programStats, error: programError } = await supabase
      .from('user_programs')
      .select('id, enrolled_at, completed_at, progress_percentage')
    
    // 学習セッション統計
    const { data: sessionStats, error: sessionError } = await supabase
      .from('learning_sessions')
      .select('id, started_at, duration_minutes, points_earned')
    
    if (userError || programError || sessionError) {
      return { data: null, error: userError || programError || sessionError }
    }
    
    const analytics = {
      totalUsers: userStats?.length || 0,
      totalEnrollments: programStats?.length || 0,
      completedPrograms: programStats?.filter(p => p.completed_at).length || 0,
      totalLearningTime: sessionStats?.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) || 0,
      totalPointsEarned: sessionStats?.reduce((sum, s) => sum + (s.points_earned || 0), 0) || 0
    }
    
    return { data: analytics, error: null }
  }
}
