# API使用ガイド - 公益資本主義アカデミー

## 📚 概要

このドキュメントでは、フロントエンドから新しいAPIを使用する方法を説明します。

---

## 🎣 React Hooksの使用

カスタムフックを使用すると、APIの呼び出しが簡単になります。

### 講座一覧の取得

```typescript
import { useLessons } from '@/lib/hooks/useLessons';

function CurriculumPage() {
  const { lessons, loading, error } = useLessons();

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;

  return (
    <div>
      {lessons.map(lesson => (
        <div key={lesson.id}>
          <h2>{lesson.title}</h2>
          <p>{lesson.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### 講座進捗の管理

```typescript
import { useLessonProgress } from '@/lib/hooks/useLessons';

function ProgressTracker({ lessonId }: { lessonId: number }) {
  const { progress, loading, error, updateProgress } = useLessonProgress(lessonId);

  const handleComplete = async (sessionNumber: number) => {
    try {
      await updateProgress(lessonId, sessionNumber, 'completed', 300);
      alert('進捗を保存しました！');
    } catch (err) {
      alert('保存に失敗しました');
    }
  };

  return (
    <div>
      {progress.map(p => (
        <div key={p.session_number}>
          Session {p.session_number}: {p.status}
          {p.status !== 'completed' && (
            <button onClick={() => handleComplete(p.session_number)}>
              完了にする
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

### ワーク回答の保存

```typescript
import { useWorkAnswer } from '@/lib/hooks/useLessons';
import { useState } from 'react';

function WorkPage({ lessonId }: { lessonId: number }) {
  const { answer, loading, saveAnswer } = useWorkAnswer(lessonId);
  const [formData, setFormData] = useState({
    question_1: '',
    question_2: '',
    question_3: { company: '', reason: '' },
  });

  const handleSave = async () => {
    try {
      await saveAnswer(formData);
      alert('回答を保存しました！');
    } catch (err) {
      alert('保存に失敗しました');
    }
  };

  // 既存の回答がある場合は初期値に設定
  useEffect(() => {
    if (answer?.answers) {
      setFormData(answer.answers);
    }
  }, [answer]);

  return (
    <form>
      <input
        value={formData.question_1}
        onChange={(e) => setFormData({ ...formData, question_1: e.target.value })}
        placeholder="質問1の回答"
      />
      <button type="button" onClick={handleSave}>
        保存
      </button>
    </form>
  );
}
```

### AI対話の記録

```typescript
import { useDialogueHistory } from '@/lib/hooks/useLessons';

function DialoguePage({ lessonId }: { lessonId: number }) {
  const { history, loading, saveDialogue } = useDialogueHistory(lessonId);
  const [userInput, setUserInput] = useState('');

  const handleSubmit = async () => {
    // AIに問いかけ（実際のAI応答生成ロジックは別途実装）
    const aiResponse = await generateAIResponse(userInput);
    
    try {
      await saveDialogue(lessonId, userInput, aiResponse, '公益資本主義について');
      setUserInput('');
    } catch (err) {
      alert('保存に失敗しました');
    }
  };

  return (
    <div>
      <div className="history">
        {history.map(item => (
          <div key={item.id}>
            <div className="user">{item.user_input}</div>
            <div className="ai">{item.ai_response}</div>
          </div>
        ))}
      </div>
      <textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="あなたの考えを入力..."
      />
      <button onClick={handleSubmit}>送信</button>
    </div>
  );
}
```

### コミュニティ投稿の表示

```typescript
import { useCommunityPosts } from '@/lib/hooks/useLessons';

function CommunitySection({ lessonId }: { lessonId: number }) {
  const { posts, loading, createPost } = useCommunityPosts(lessonId);
  const [newPost, setNewPost] = useState('');

  const handlePost = async () => {
    if (newPost.length < 10) {
      alert('10文字以上入力してください');
      return;
    }

    try {
      await createPost(lessonId, newPost, true);
      setNewPost('');
      alert('投稿しました！');
    } catch (err) {
      alert('投稿に失敗しました');
    }
  };

  return (
    <div>
      <h2>みんなの意見広場</h2>
      <div className="posts">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <p>{post.content}</p>
            <div className="meta">
              <span>{post.likes_count} いいね</span>
              <span>{new Date(post.posted_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="new-post">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="あなたの意見を投稿..."
        />
        <button onClick={handlePost}>投稿する</button>
      </div>
    </div>
  );
}
```

### いいね機能

```typescript
import { useLikes } from '@/lib/hooks/useLessons';

function LikeButton({ postId }: { postId: number }) {
  const { likes, addLike, removeLike } = useLikes(postId);
  const [liked, setLiked] = useState(false);

  const handleToggle = async () => {
    try {
      if (liked) {
        await removeLike();
      } else {
        await addLike();
      }
      setLiked(!liked);
    } catch (err) {
      alert('いいねの処理に失敗しました');
    }
  };

  return (
    <button onClick={handleToggle}>
      {liked ? '❤️' : '🤍'} {likes.length}
    </button>
  );
}
```

---

## 🔥 直接APIを呼び出す（フックを使わない場合）

### 進捗の取得

```typescript
const fetchProgress = async (lessonId?: number) => {
  const url = lessonId 
    ? `/api/lessons/progress?lesson_id=${lessonId}`
    : '/api/lessons/progress';
  
  const response = await fetch(url);
  const { data, error } = await response.json();
  
  if (error) {
    throw new Error(error);
  }
  
  return data;
};
```

### 進捗の更新

```typescript
const updateProgress = async (
  lessonId: number,
  sessionNumber: number,
  status: 'not_started' | 'in_progress' | 'completed'
) => {
  const response = await fetch('/api/lessons/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      lesson_id: lessonId,
      session_number: sessionNumber,
      status,
    }),
  });
  
  const { data, error } = await response.json();
  
  if (error) {
    throw new Error(error);
  }
  
  return data;
};
```

---

## 📊 統計データの取得

### 全体統計

```typescript
import { useLessonStats } from '@/lib/hooks/useLessons';

function DashboardStats() {
  const { stats, loading } = useLessonStats();

  if (loading) return <div>読み込み中...</div>;

  return (
    <div>
      <h2>学習統計</h2>
      <div>完了講座: {stats.overall.completed_lessons} / {stats.overall.total_lessons}</div>
      <div>全体進捗率: {stats.overall.overall_progress_percentage}%</div>
      <div>総学習時間: {Math.floor(stats.overall.total_time_spent_seconds / 60)}分</div>
    </div>
  );
}
```

### 講座別統計

```typescript
function LessonDetailStats({ lessonId }: { lessonId: number }) {
  const { stats, loading } = useLessonStats(lessonId);

  if (loading) return <div>読み込み中...</div>;

  const lessonStat = stats.by_lesson.find((s: any) => s.lesson_id === lessonId);

  return (
    <div>
      <div>完了セッション: {lessonStat.completed_sessions} / {lessonStat.total_sessions}</div>
      <div>進捗率: {lessonStat.progress_percentage}%</div>
    </div>
  );
}
```

---

## 🎨 UIコンポーネント例

### 進捗バー

```typescript
function ProgressBar({ lessonId }: { lessonId: number }) {
  const { progress } = useLessonProgress(lessonId);
  
  const completedCount = progress.filter(p => p.status === 'completed').length;
  const percentage = (completedCount / 5) * 100;

  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${percentage}%` }} />
      <span>{completedCount} / 5 完了</span>
    </div>
  );
}
```

### セッションリスト

```typescript
import { SESSION_NAMES } from '@/types';

function SessionList({ lessonId }: { lessonId: number }) {
  const { progress, updateProgress } = useLessonProgress(lessonId);

  return (
    <div className="session-list">
      {[1, 2, 3, 4, 5].map(sessionNumber => {
        const sessionProgress = progress.find(p => p.session_number === sessionNumber);
        const status = sessionProgress?.status || 'not_started';

        return (
          <div key={sessionNumber} className={`session-item ${status}`}>
            <span>Session {sessionNumber}: {SESSION_NAMES[sessionNumber]}</span>
            {status === 'completed' ? (
              <span>✅ 完了</span>
            ) : (
              <button onClick={() => updateProgress(lessonId, sessionNumber, 'in_progress')}>
                開始
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

---

## 🚨 エラーハンドリング

### グローバルエラーハンドラー

```typescript
const handleApiError = (error: any) => {
  if (error.message.includes('認証')) {
    // ログインページにリダイレクト
    window.location.href = '/auth/login';
  } else {
    // エラー通知を表示
    toast.error(error.message);
  }
};

// 使用例
try {
  await updateProgress(1, 1, 'completed');
} catch (err) {
  handleApiError(err);
}
```

### カスタムエラー型

```typescript
interface ApiError {
  error: string;
  status?: number;
  details?: any;
}

const fetchWithErrorHandling = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, options);
  const result = await response.json();

  if (!response.ok) {
    const error: ApiError = {
      error: result.error || 'エラーが発生しました',
      status: response.status,
      details: result.details,
    };
    throw error;
  }

  return result.data;
};
```

---

## 📱 オフライン対応（将来の拡張）

### LocalStorageでのキャッシュ

```typescript
const CACHE_KEY = 'lesson_progress_cache';

const saveToCache = (data: any) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(data));
};

const loadFromCache = () => {
  const cached = localStorage.getItem(CACHE_KEY);
  return cached ? JSON.parse(cached) : null;
};

// オフライン時はキャッシュから読み込む
const fetchProgressWithCache = async (lessonId: number) => {
  try {
    const data = await fetchProgress(lessonId);
    saveToCache(data);
    return data;
  } catch (err) {
    // オンライン時のエラーならキャッシュを返す
    return loadFromCache();
  }
};
```

---

## 🧪 テスト例

### Jest + React Testing Library

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useLessonProgress } from '@/lib/hooks/useLessons';

describe('useLessonProgress', () => {
  it('講座進捗を取得できる', async () => {
    const { result } = renderHook(() => useLessonProgress(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.progress).toHaveLength(5);
    expect(result.current.error).toBeNull();
  });

  it('進捗を更新できる', async () => {
    const { result } = renderHook(() => useLessonProgress(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.updateProgress(1, 1, 'completed');

    expect(result.current.progress[0].status).toBe('completed');
  });
});
```

---

## 📖 参考資料

- [DATA_MODEL_UPDATE.md](./DATA_MODEL_UPDATE.md) - データモデル更新ガイド
- [src/lib/hooks/useLessons.ts](./src/lib/hooks/useLessons.ts) - カスタムフック実装
- [src/types/index.ts](./src/types/index.ts) - 型定義

---

**最終更新**: 2025-10-22  
**バージョン**: 1.0

