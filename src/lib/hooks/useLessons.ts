'use client';

import { useState, useEffect } from 'react';
import type {
  LessonProgress,
  WorkAnswer,
  DialogueHistory,
  CommunityPost,
  LessonProgressStats,
  LessonMetadata,
  LESSONS,
} from '@/types';

/**
 * 講座一覧を取得するフック
 */
export function useLessons() {
  const [lessons, setLessons] = useState<typeof LESSONS>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch('/api/lessons');
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || '講座の取得に失敗しました');
        }

        setLessons(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期しないエラー');
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  return { lessons, loading, error };
}

/**
 * 特定の講座を取得するフック
 */
export function useLesson(lessonId: number) {
  const [lesson, setLesson] = useState<LessonMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await fetch(`/api/lessons?id=${lessonId}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || '講座の取得に失敗しました');
        }

        setLesson(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期しないエラー');
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId]);

  return { lesson, loading, error };
}

/**
 * 講座進捗を取得するフック
 */
export function useLessonProgress(lessonId?: number) {
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const url = lessonId
        ? `/api/lessons/progress?lesson_id=${lessonId}`
        : '/api/lessons/progress';
      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '進捗の取得に失敗しました');
      }

      setProgress(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラー');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [lessonId]);

  const updateProgress = async (
    lessonId: number,
    sessionNumber: number,
    status: 'not_started' | 'in_progress' | 'completed',
    timeSpentSeconds?: number
  ) => {
    try {
      const response = await fetch('/api/lessons/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lesson_id: lessonId,
          session_number: sessionNumber,
          status,
          time_spent_seconds: timeSpentSeconds,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '進捗の更新に失敗しました');
      }

      // 進捗を再取得
      await fetchProgress();
      return result.data;
    } catch (err) {
      throw err;
    }
  };

  return { progress, loading, error, updateProgress, refetch: fetchProgress };
}

/**
 * 講座統計を取得するフック
 */
export function useLessonStats(lessonId?: number) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const url = lessonId
          ? `/api/lessons/stats?lesson_id=${lessonId}`
          : '/api/lessons/stats';
        const response = await fetch(url);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || '統計の取得に失敗しました');
        }

        setStats(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期しないエラー');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [lessonId]);

  return { stats, loading, error };
}

/**
 * ワーク回答を管理するフック
 */
export function useWorkAnswer(lessonId: number) {
  const [answer, setAnswer] = useState<WorkAnswer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnswer = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/lessons/work-answers?lesson_id=${lessonId}`);
      const result = await response.json();

      if (!response.ok && response.status !== 404) {
        throw new Error(result.error || '回答の取得に失敗しました');
      }

      setAnswer(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラー');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lessonId) {
      fetchAnswer();
    }
  }, [lessonId]);

  const saveAnswer = async (answers: Record<string, any>) => {
    try {
      const response = await fetch('/api/lessons/work-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lesson_id: lessonId,
          answers,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '回答の保存に失敗しました');
      }

      setAnswer(result.data);
      return result.data;
    } catch (err) {
      throw err;
    }
  };

  return { answer, loading, error, saveAnswer, refetch: fetchAnswer };
}

/**
 * 対話履歴を管理するフック
 */
export function useDialogueHistory(lessonId?: number) {
  const [history, setHistory] = useState<DialogueHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const url = lessonId
        ? `/api/lessons/dialogue?lesson_id=${lessonId}`
        : '/api/lessons/dialogue';
      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '対話履歴の取得に失敗しました');
      }

      setHistory(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラー');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [lessonId]);

  const saveDialogue = async (
    lessonId: number,
    userInput: string,
    aiResponse: string,
    promptTheme?: string
  ) => {
    try {
      const response = await fetch('/api/lessons/dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lesson_id: lessonId,
          user_input: userInput,
          ai_response: aiResponse,
          prompt_theme: promptTheme,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '対話の保存に失敗しました');
      }

      await fetchHistory();
      return result.data;
    } catch (err) {
      throw err;
    }
  };

  return { history, loading, error, saveDialogue, refetch: fetchHistory };
}

/**
 * コミュニティ投稿を管理するフック
 */
export function useCommunityPosts(lessonId?: number, limit = 20) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let url = `/api/community/posts?limit=${limit}`;
      if (lessonId) {
        url += `&lesson_id=${lessonId}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '投稿の取得に失敗しました');
      }

      setPosts(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラー');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [lessonId, limit]);

  const createPost = async (
    lessonId: number,
    content: string,
    isPublic = true
  ) => {
    try {
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lesson_id: lessonId,
          content,
          is_public: isPublic,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '投稿の作成に失敗しました');
      }

      await fetchPosts();
      return result.data;
    } catch (err) {
      throw err;
    }
  };

  const deletePost = async (postId: number) => {
    try {
      const response = await fetch('/api/community/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '投稿の削除に失敗しました');
      }

      await fetchPosts();
      return result;
    } catch (err) {
      throw err;
    }
  };

  return { posts, loading, error, createPost, deletePost, refetch: fetchPosts };
}

/**
 * いいねを管理するフック
 */
export function useLikes(postId: number) {
  const [likes, setLikes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLikes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/community/posts/${postId}/likes`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'いいね一覧の取得に失敗しました');
      }

      setLikes(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラー');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchLikes();
    }
  }, [postId]);

  const addLike = async () => {
    try {
      const response = await fetch(`/api/community/posts/${postId}/likes`, {
        method: 'POST',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'いいねの追加に失敗しました');
      }

      await fetchLikes();
      return result.data;
    } catch (err) {
      throw err;
    }
  };

  const removeLike = async () => {
    try {
      const response = await fetch(`/api/community/posts/${postId}/likes`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'いいねの削除に失敗しました');
      }

      await fetchLikes();
      return result;
    } catch (err) {
      throw err;
    }
  };

  return { likes, loading, error, addLike, removeLike, refetch: fetchLikes };
}

