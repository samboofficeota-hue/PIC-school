# データモデル更新ガイド

## 📋 概要

公益資本主義アカデミーの新しいデータモデル設計に基づいて、データベーススキーマ、TypeScript型定義、APIルートを更新しました。

更新日: 2025-10-22

---

## 🎯 主な変更点

### 1. 新しいテーブルの追加

以下の5つのテーブルを追加しました：

#### 📊 `lesson_progress`（講座進捗）
- **目的**: ユーザーがどの講座のどのSessionまで完了したかを記録
- **主要フィールド**: 
  - `lesson_id` (1-10): 講座番号
  - `session_number` (1-5): Session番号
  - `status`: 'not_started' | 'in_progress' | 'completed'
  - `time_spent_seconds`: 学習時間（秒）

#### ✍️ `work_answers`（ワーク回答）
- **目的**: Session 3のワークで入力された内容を保存
- **主要フィールド**:
  - `lesson_id` (1-10): 講座番号
  - `answers` (JSONB): 各質問の回答

#### 💬 `dialogue_history`（対話履歴）
- **目的**: Session 4でのユーザーの考えとAI応答を記録
- **主要フィールド**:
  - `lesson_id` (1-10): 講座番号
  - `user_input`: ユーザーの入力
  - `ai_response`: AIの応答
  - `prompt_theme`: 問いのテーマ

#### 🌐 `community_posts`（コミュニティ投稿）
- **目的**: みんなの意見広場への投稿を管理
- **主要フィールド**:
  - `lesson_id` (1-10): 講座番号
  - `content`: 投稿内容
  - `likes_count`: いいね数
  - `is_public`: 公開/非公開

#### ❤️ `likes`（いいね）
- **目的**: コミュニティ投稿へのいいねを管理
- **主要フィールド**:
  - `post_id`: 投稿ID
  - `user_id`: いいねしたユーザーID

### 2. ユーザープロフィールの拡張

`user_profiles` テーブルに以下のフィールドを追加：
- `display_name`: 表示名（例：大学生A、社会人B）
- `user_type`: ユーザータイプ（'high_school' | 'university' | 'working' | 'other'）
- `joined_at`: 登録日時
- `last_active_at`: 最終アクティブ日時

---

## 🔧 技術的な更新

### TypeScript型定義

#### `src/types/database.ts`
新しいテーブルに対応した型定義を追加：
- `LessonProgress`
- `WorkAnswer`
- `DialogueHistory`
- `CommunityPost`
- `Like`
- `UserProfileExtended`

#### `src/types/index.ts`
- database.tsから全型をエクスポート
- 講座メタデータ型の追加（`LessonMetadata`, `SessionType`）
- 講座一覧定数（`LESSONS`, `SESSION_NAMES`, `SESSION_TYPES`）
- ヘルパー関数（`getLessonById`, `getSessionName`, `getSessionType`）

### APIルート

以下のAPIルートを新規作成：

#### 講座関連
- `GET /api/lessons` - 講座一覧取得
- `GET /api/lessons/stats` - 講座別進捗統計

#### 進捗管理
- `GET /api/lessons/progress` - 進捗取得
- `POST /api/lessons/progress` - 進捗作成・更新
- `PUT /api/lessons/progress` - 進捗更新

#### ワーク回答
- `GET /api/lessons/work-answers` - ワーク回答取得
- `POST /api/lessons/work-answers` - ワーク回答作成・更新
- `PUT /api/lessons/work-answers` - ワーク回答更新

#### 対話履歴
- `GET /api/lessons/dialogue` - 対話履歴取得
- `POST /api/lessons/dialogue` - 対話履歴作成

#### コミュニティ
- `GET /api/community/posts` - 投稿一覧取得
- `POST /api/community/posts` - 投稿作成
- `PUT /api/community/posts` - 投稿更新
- `DELETE /api/community/posts` - 投稿削除

#### いいね
- `GET /api/community/posts/[id]/likes` - いいね一覧取得
- `POST /api/community/posts/[id]/likes` - いいね追加
- `DELETE /api/community/posts/[id]/likes` - いいね削除

---

## 🚀 データベース移行手順

### ステップ1: Supabaseダッシュボードにログイン

```bash
# プロジェクトのSupabaseダッシュボードにアクセス
```

### ステップ2: SQL Editorでスキーマを実行

1. Supabaseダッシュボード > SQL Editor に移動
2. `supabase/schema.sql` ファイルの内容をコピー
3. SQL Editorに貼り付け
4. "Run"をクリックして実行

### ステップ3: スキーマの適用確認

以下のクエリで新しいテーブルが作成されたことを確認：

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'lesson_progress', 
  'work_answers', 
  'dialogue_history', 
  'community_posts', 
  'likes'
);
```

### ステップ4: RLSポリシーの確認

```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN (
  'lesson_progress', 
  'work_answers', 
  'dialogue_history', 
  'community_posts', 
  'likes'
);
```

### ステップ5: TypeScript型の生成（オプション）

Supabase CLIを使用して型を自動生成：

```bash
npm run update-types
# または
./scripts/update-types.sh
```

---

## 📊 データ構造の関係図

```
users (auth.users)
  ↓
user_profiles (拡張プロフィール)
  ↓
├─ lesson_progress (講座進捗)
├─ work_answers (ワーク回答)
├─ dialogue_history (対話履歴)
└─ community_posts (コミュニティ投稿)
     ↓
     likes (いいね)
```

---

## 🎨 フロントエンドでの使用例

### 進捗の取得

```typescript
// 全進捗を取得
const response = await fetch('/api/lessons/progress');
const { data } = await response.json();

// 特定の講座の進捗を取得
const response = await fetch('/api/lessons/progress?lesson_id=1');
const { data } = await response.json();
```

### 進捗の保存

```typescript
const response = await fetch('/api/lessons/progress', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    lesson_id: 1,
    session_number: 3,
    status: 'completed',
    time_spent_seconds: 1200,
  }),
});
```

### ワーク回答の保存

```typescript
const response = await fetch('/api/lessons/work-answers', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    lesson_id: 1,
    answers: {
      question_1: '公益資本主義とは...',
      question_2: '日本には必要だと思います...',
      question_3: {
        company: 'トヨタ',
        reason: '従業員を大切にしているから',
      },
    },
  }),
});
```

### コミュニティ投稿の取得

```typescript
// 第1回の公開投稿を取得
const response = await fetch('/api/community/posts?lesson_id=1&is_public=true&limit=10');
const { data } = await response.json();
```

### コミュニティ投稿の作成

```typescript
const response = await fetch('/api/community/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    lesson_id: 1,
    content: '公益資本主義について学んで、企業の社会的責任の重要性を実感しました。',
    is_public: true,
  }),
});
```

### いいねの追加

```typescript
const response = await fetch(`/api/community/posts/${postId}/likes`, {
  method: 'POST',
});
```

---

## 🔒 セキュリティ

### Row Level Security (RLS)

すべての新しいテーブルにRLSポリシーが設定されています：

- **lesson_progress**: ユーザーは自分の進捗のみ閲覧・編集可能
- **work_answers**: ユーザーは自分の回答のみ閲覧・編集可能
- **dialogue_history**: ユーザーは自分の対話履歴のみ閲覧可能
- **community_posts**: 公開投稿は全員が閲覧可能、編集・削除は投稿者のみ
- **likes**: 全員が閲覧可能、追加・削除は本人のみ

### トリガー

- **likes**: いいねの追加・削除時に自動的に `community_posts.likes_count` を更新

---

## 📈 次のステップ

### 実装推奨順序

1. ✅ データベーススキーマの適用
2. ✅ TypeScript型定義の更新
3. ✅ APIルートの作成
4. ⏳ フロントエンドコンポーネントの更新
   - カリキュラムページ（講座一覧）
   - 講座詳細ページ（Session 1-5）
   - ワークページ（Session 3）
   - 対話ページ（Session 4）
   - みんなの意見広場（Session 4）
5. ⏳ テストデータの投入
6. ⏳ エンドツーエンドテスト

### フロントエンド更新のチェックリスト

- [ ] カリキュラムページで `LESSONS` 定数を使用
- [ ] 進捗表示に `/api/lessons/progress` を使用
- [ ] Session 3でワーク回答APIを統合
- [ ] Session 4で対話履歴APIとコミュニティAPIを統合
- [ ] いいね機能を実装
- [ ] 進捗率の計算を統一

---

## 🐛 トラブルシューティング

### スキーマ実行時のエラー

**エラー**: `relation "lesson_progress" already exists`
- **解決**: テーブルが既に存在している場合は、`DROP TABLE IF EXISTS` を使用するか、既存のテーブルを確認

**エラー**: `policy "..." for table "..." already exists`
- **解決**: 既存のポリシーを削除してから再作成：
  ```sql
  DROP POLICY IF EXISTS "Users can view own lesson progress" ON lesson_progress;
  ```

### API呼び出し時のエラー

**401 Unauthorized**
- ユーザーが認証されていません。ログイン状態を確認してください。

**400 Bad Request**
- リクエストパラメータが不足しているか、無効です。エラーメッセージを確認してください。

**500 Internal Server Error**
- サーバーサイドのエラーです。ログを確認してください。

---

## 📚 参考資料

- [data-model-design.md](./data-model-design.md) - 元の設計書
- [supabase/schema.sql](./supabase/schema.sql) - データベーススキーマ
- [src/types/database.ts](./src/types/database.ts) - TypeScript型定義
- [src/types/index.ts](./src/types/index.ts) - アプリケーション型定義と定数

---

## 👥 貢献

データモデルの改善提案やバグ報告は、GitHubのIssueまたはPull Requestでお願いします。

---

**最終更新**: 2025-10-22  
**バージョン**: 2.0  
**ステータス**: 実装完了（フロントエンド統合待ち）

