// ユーザー型
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  subscription_status: 'active' | 'inactive' | 'cancelled';
  subscription_end_date: string | null;
}

// コース型
export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  created_at: string;
}

// 講義型
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

// 進捗型
export interface UserProgress {
  id: string;
  user_id: string;
  lecture_id: string;
  video_completed: boolean;
  ai_chat_completed: boolean;
  quiz_completed: boolean;
  worksheet_submitted: boolean;
  completed_at: string | null;
}

// クイズ結果型
export interface QuizResult {
  id: string;
  user_id: string;
  lecture_id: string;
  score: number;
  answers: Record<string, boolean>;
  created_at: string;
}

// ワークシート型
export interface Worksheet {
  id: string;
  user_id: string;
  lecture_id: string;
  content: string;
  submitted_at: string;
}

// 掲示板投稿型
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

// AI対話履歴型
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
