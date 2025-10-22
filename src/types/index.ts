// ============================================
// database.tsから全ての型定義をエクスポート
// ============================================
export * from './database';

// ============================================
// 追加のアプリケーション固有の型定義
// ============================================

// 認証ユーザー型（Supabase Auth連携）
export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  email_confirmed_at?: string | null;
  last_sign_in_at?: string | null;
}

// ============================================
// レガシー型（後方互換性のため保持、非推奨）
// ============================================

// @deprecated - database.tsのProgramを使用してください
export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  created_at: string;
}

// @deprecated - database.tsのChapterを使用してください
export interface Lecture {
  id: string;
  course_id: string;
  order_number: number;
  title: string;
  video_url: string;
  duration: number;
  content: string;
  created_at: string;
}

// @deprecated - database.tsのWorkAnswerを使用してください
export interface Worksheet {
  id: string;
  user_id: string;
  lecture_id: string;
  content: string;
  submitted_at: string;
}

// @deprecated - database.tsのCommunityPostを使用してください
export interface DiscussionPost {
  id: string;
  user_id: string;
  lecture_id: string;
  content: string;
  likes_count: number;
  created_at: string;
  user?: {
    name: string;
  };
}

// @deprecated - database.tsのDialogueHistoryを使用してください
export interface AIChatHistory {
  id: string;
  user_id: string;
  lecture_id: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  created_at: string;
}

// ============================================
// Lesson（講座）関連の定数
// ============================================

// 講座番号の定義（1〜10回）
export const LESSON_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
export type LessonId = typeof LESSON_IDS[number];

// Session番号の定義（1〜5セッション）
export const SESSION_NUMBERS = [1, 2, 3, 4, 5] as const;
export type SessionNumber = typeof SESSION_NUMBERS[number];

// Session名の定義
export const SESSION_NAMES: Record<SessionNumber, string> = {
  1: '導入（イントロダクション）',
  2: '解説（コンテンツ）',
  3: 'ワーク（実践）',
  4: '対話（AI対話）',
  5: 'まとめ（サマリー）',
};

// Session種別
export type SessionType = 'introduction' | 'content' | 'work' | 'dialogue' | 'summary';

export const SESSION_TYPES: Record<SessionNumber, SessionType> = {
  1: 'introduction',
  2: 'content',
  3: 'work',
  4: 'dialogue',
  5: 'summary',
};

// ============================================
// Lesson（講座）メタデータ型
// ============================================

export interface LessonMetadata {
  id: LessonId;
  title: string;
  description: string;
  theme: string;
  order: number;
}

// 講座一覧（データ構造設計書に基づく）
export const LESSONS: LessonMetadata[] = [
  {
    id: 1,
    title: '第1回：公益資本主義とは',
    description: '公益資本主義の基本概念と原則について学びます。',
    theme: '基本概念',
    order: 1,
  },
  {
    id: 2,
    title: '第2回：企業の社会的責任',
    description: '企業が果たすべき社会的責任について考えます。',
    theme: 'CSR',
    order: 2,
  },
  {
    id: 3,
    title: '第3回：ステークホルダー経営',
    description: '多様なステークホルダーとの関係性を学びます。',
    theme: 'ステークホルダー',
    order: 3,
  },
  {
    id: 4,
    title: '第4回：持続可能な価値創造',
    description: '持続可能な経営と価値創造について理解します。',
    theme: 'サステナビリティ',
    order: 4,
  },
  {
    id: 5,
    title: '第5回：日本企業の事例研究',
    description: '日本企業の公益資本主義実践例を分析します。',
    theme: '事例研究',
    order: 5,
  },
  {
    id: 6,
    title: '第6回：グローバル視点',
    description: '世界の公益資本主義の動向を学びます。',
    theme: 'グローバル',
    order: 6,
  },
  {
    id: 7,
    title: '第7回：イノベーションと社会課題',
    description: 'イノベーションによる社会課題解決を考えます。',
    theme: 'イノベーション',
    order: 7,
  },
  {
    id: 8,
    title: '第8回：リーダーシップと組織文化',
    description: '公益資本主義を実践するリーダーシップを学びます。',
    theme: 'リーダーシップ',
    order: 8,
  },
  {
    id: 9,
    title: '第9回：未来への展望',
    description: '公益資本主義の未来について考察します。',
    theme: '未来',
    order: 9,
  },
  {
    id: 10,
    title: '第10回：実践への道',
    description: '自分自身の実践計画を立てます。',
    theme: '実践',
    order: 10,
  },
];

// ============================================
// ヘルパー関数
// ============================================

/**
 * 講座IDから講座情報を取得
 */
export function getLessonById(lessonId: LessonId): LessonMetadata | undefined {
  return LESSONS.find(lesson => lesson.id === lessonId);
}

/**
 * セッション番号からセッション名を取得
 */
export function getSessionName(sessionNumber: SessionNumber): string {
  return SESSION_NAMES[sessionNumber];
}

/**
 * セッション番号からセッション種別を取得
 */
export function getSessionType(sessionNumber: SessionNumber): SessionType {
  return SESSION_TYPES[sessionNumber];
}
