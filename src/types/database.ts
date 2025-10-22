// データベーススキーマに対応した型定義
// このファイルは src/types/index.ts の代わりに使用することを推奨

// ============================================
// テーブル型定義
// ============================================

// ユーザープロフィール
export interface UserProfile {
  id: string; // UUID
  name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  birthday: string | null; // Date型はstringとして扱う
  created_at: string;
  updated_at: string;
}

// プログラム（コース）
export interface Program {
  id: number;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  instructor_name: string | null;
  instructor_bio: string | null;
  price: number;
  duration_hours: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  category: string | null;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

// チャプター（講義）
export interface Chapter {
  id: number;
  program_id: number;
  title: string;
  description: string | null;
  content: string | null;
  video_url: string | null;
  duration_minutes: number;
  order_index: number;
  is_free: boolean;
  created_at: string;
  updated_at: string;
}

// ユーザープログラム登録
export interface UserProgram {
  id: number;
  user_id: string; // UUID
  program_id: number;
  enrolled_at: string;
  completed_at: string | null;
  progress_percentage: number;
  last_accessed_at: string;
}

// ユーザー学習進捗
export interface UserProgress {
  id: number;
  user_id: string; // UUID
  chapter_id: number;
  progress_percentage: number;
  time_spent_minutes: number;
  completed_at: string | null;
  last_accessed_at: string;
  created_at: string;
  updated_at: string;
}

// 実績・バッジ
export interface Achievement {
  id: number;
  name: string;
  description: string | null;
  icon_url: string | null;
  points: number;
  category: string | null;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  conditions: Record<string, any> | null; // JSONB
  is_active: boolean;
  created_at: string;
}

// ユーザー実績
export interface UserAchievement {
  id: number;
  user_id: string; // UUID
  achievement_id: number;
  earned_at: string;
  points_earned: number;
}

// ユーザーポイント
export interface UserPoints {
  id: number;
  user_id: string; // UUID
  total_points: number;
  earned_points: number;
  spent_points: number;
  created_at: string;
  updated_at: string;
}

// 学習セッション
export interface LearningSession {
  id: number;
  user_id: string; // UUID
  chapter_id: number;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number;
  progress_before: number;
  progress_after: number;
  points_earned: number;
}

// 通知
export interface Notification {
  id: number;
  user_id: string; // UUID
  title: string;
  message: string;
  type: 'achievement' | 'progress' | 'system' | 'marketing';
  is_read: boolean;
  created_at: string;
}

// 管理者権限
export interface AdminRole {
  id: number;
  user_id: string; // UUID
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: Record<string, any>; // JSONB
  created_at: string;
}

// ============================================
// リレーション型定義（JOIN結果用）
// ============================================

// プログラムとチャプター
export interface ProgramWithChapters extends Program {
  chapters: Chapter[];
}

// ユーザープログラムとプログラム情報
export interface UserProgramWithDetails extends UserProgram {
  programs: Program;
}

// ユーザー進捗とチャプター情報
export interface UserProgressWithChapter extends UserProgress {
  chapters: Chapter & {
    programs: Program;
  };
}

// ユーザー実績と実績情報
export interface UserAchievementWithDetails extends UserAchievement {
  achievements: Achievement;
}

// ============================================
// API レスポンス型
// ============================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface ApiErrorResponse {
  error: string;
  status?: number;
}

// ============================================
// フォーム/入力型
// ============================================

export interface UserProfileUpdate {
  name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  phone?: string;
  birthday?: string;
}

export interface ProgramEnrollInput {
  programId: number;
}

export interface ProgressUpdateInput {
  chapterId: number;
  progress: number;
  timeSpent?: number;
}

// ============================================
// 分析・統計型
// ============================================

export interface UserStats {
  enrolledPrograms: number;
  completedPrograms: number;
  totalLearningTime: number;
  totalPoints: number;
}

export interface ProgramStats {
  id: number;
  title: string;
  enrolledUsers: number;
  completionRate: number;
  averageProgress: number;
}

export interface AnalyticsData {
  totalUsers: number;
  totalEnrollments: number;
  completedPrograms: number;
  totalLearningTime: number;
  totalPointsEarned: number;
}

// ============================================
// RPC関数のパラメータ型
// ============================================

export interface UpdateUserProgressParams {
  p_user_id: string;
  p_chapter_id: number;
  p_progress_percentage: number;
  p_time_spent_minutes?: number;
}

// ============================================
// 公益資本主義アカデミー専用テーブル型
// ============================================

// 講座進捗（lesson_progress）
export interface LessonProgress {
  id: number;
  user_id: string; // UUID
  lesson_id: number; // 講座番号（1-10）
  session_number: number; // Session番号（1-5）
  status: 'not_started' | 'in_progress' | 'completed';
  started_at: string | null;
  completed_at: string | null;
  time_spent_seconds: number;
  created_at: string;
  updated_at: string;
}

// ワーク回答（work_answers）
export interface WorkAnswer {
  id: number;
  user_id: string; // UUID
  lesson_id: number; // 講座番号（1-10）
  answers: Record<string, any>; // JSONB - 各質問の回答
  submitted_at: string;
  updated_at: string;
}

// 対話履歴（dialogue_history）
export interface DialogueHistory {
  id: number;
  user_id: string; // UUID
  lesson_id: number; // 講座番号（1-10）
  user_input: string;
  ai_response: string;
  prompt_theme: string | null;
  submitted_at: string;
  created_at: string;
}

// コミュニティ投稿（community_posts）
export interface CommunityPost {
  id: number;
  user_id: string; // UUID
  lesson_id: number; // 講座番号（1-10）
  content: string;
  likes_count: number;
  is_public: boolean;
  posted_at: string;
  updated_at: string;
  created_at: string;
}

// いいね（likes）
export interface Like {
  id: number;
  user_id: string; // UUID
  post_id: number;
  liked_at: string;
}

// ============================================
// 拡張されたユーザープロフィール型
// ============================================

export interface UserProfileExtended extends UserProfile {
  display_name?: string | null;
  user_type?: 'high_school' | 'university' | 'working' | 'other' | null;
  joined_at?: string;
  last_active_at?: string;
}

// ============================================
// リレーション型（JOIN結果用）- 公益資本主義アカデミー
// ============================================

// コミュニティ投稿とユーザー情報
export interface CommunityPostWithUser extends CommunityPost {
  user_profiles: {
    display_name: string | null;
    user_type: string | null;
  };
}

// 講座進捗の統計
export interface LessonProgressStats {
  lesson_id: number;
  total_sessions: number;
  completed_sessions: number;
  progress_percentage: number;
  total_time_spent_seconds: number;
}

// ============================================
// フォーム/入力型 - 公益資本主義アカデミー
// ============================================

export interface LessonProgressInput {
  lesson_id: number;
  session_number: number;
  status: 'not_started' | 'in_progress' | 'completed';
  time_spent_seconds?: number;
}

export interface WorkAnswerInput {
  lesson_id: number;
  answers: Record<string, any>;
}

export interface DialogueHistoryInput {
  lesson_id: number;
  user_input: string;
  ai_response: string;
  prompt_theme?: string;
}

export interface CommunityPostInput {
  lesson_id: number;
  content: string;
  is_public?: boolean;
}

export interface LikeInput {
  post_id: number;
}

