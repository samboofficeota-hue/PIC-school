# PIC School - ビジネススキルオンラインスクール

ビジネススキルを体系的に学ぶオンラインスクールプラットフォーム

## 🚀 クイックスタート

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

http://localhost:3000 でアプリケーションが起動します。

## 📁 プロジェクト構造

```
src/
├── app/                      # Next.js App Router
│   ├── globals.css          # グローバルスタイル
│   ├── layout.tsx           # ルートレイアウト
│   ├── page.tsx             # ホームページ
│   └── program/             # プログラム関連ページ
│       └── [id]/            # 動的ルート
│           ├── page.tsx     # プログラム詳細ページ
│           └── chapter/     # チャプター関連ページ
│               └── [chapterId]/ # 動的ルート
│                   └── page.tsx # チャプター詳細ページ
├── components/              # Reactコンポーネント
│   └── ui/                  # UIコンポーネント
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       └── progress.tsx
├── lib/                     # ライブラリ・ユーティリティ
│   └── utils/               # 共通ユーティリティ
│       └── index.ts
└── types/                   # TypeScript型定義
    └── index.ts
```

## 🎯 現在の機能

### 📱 ページ構成

1. **ホームページ** (`/`)
   - ヒーローセクション（統計情報付き）
   - 4つの主要特徴紹介
   - 5章構成のカリキュラム概要
   - 3ステップの学習フロー
   - CTAセクション

2. **プログラム詳細ページ** (`/program/[id]`)
   - プログラム概要とメタデータ
   - 5章の学習内容一覧
   - 学習目標・前提条件
   - サイドバー（価格、進捗、特徴、講師情報）
   - 進捗トラッキング

3. **チャプター詳細ページ** (`/program/[id]/chapter/[chapterId]`)
   - 左側：カリキュラムナビゲーション
   - 右側：学習コンテンツ
   - 重要なポイント表示
   - 詳細内容（タブナビゲーション）
   - ヘルプボタン

### 🔧 API エンドポイント

1. **ファイルアップロード** (`/api/upload`)
   - Cloudflare R2へのファイルアップロード
   - ファイルサイズ制限（10MB）
   - 対応ファイル形式：画像・動画

2. **R2接続テスト** (`/api/test-r2`)
   - Cloudflare R2の接続状況確認
   - バケット情報取得

### 🧪 テスト・デバッグ機能

1. **Supabase接続テスト** (`/test-supabase`)
   - データベース接続確認
   - プログラムデータ取得テスト

2. **Cloudflare R2テスト** (`/test-cloudflare`)
   - ストレージ接続確認
   - ファイルアップロードテスト

3. **環境変数デバッグ** (`/debug-env`)
   - 環境変数の設定状況確認

## 🛠️ 技術スタック

### フロントエンド
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React (useState, useEffect)

### バックエンド・データベース
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Cloudflare R2 (S3互換)
- **API**: Next.js API Routes

### 開発・デプロイ
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Deployment**: Vercel (推奨)

## 🔧 環境設定

### 必要な環境変数

```bash
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cloudflare R2設定
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ACCESS_KEY_ID=your_access_key_id
CLOUDFLARE_SECRET_ACCESS_KEY=your_secret_access_key
CLOUDFLARE_R2_ENDPOINT=your_r2_endpoint
```

### セットアップ手順

1. **リポジトリのクローン**
   ```bash
   git clone <repository-url>
   cd PIC-school
   ```

2. **依存関係のインストール**
   ```bash
   npm install
   ```

3. **環境変数の設定**
   - `.env.local`ファイルを作成
   - 上記の環境変数を設定

4. **開発サーバーの起動**
   ```bash
   npm run dev
   ```

## 📝 開発ガイドライン

- TypeScriptを使用
- Tailwind CSSでスタイリング
- コンポーネントは機能別に整理
- レスポンシブデザインを心がける
- API エンドポイントは `/api/` 配下に配置
- テストページは `/test-*` パスで管理

## 🧪 テスト・デバッグ

### 接続テスト
- **Supabase**: `http://localhost:3000/test-supabase`
- **Cloudflare R2**: `http://localhost:3000/test-cloudflare`
- **環境変数**: `http://localhost:3000/debug-env`

### API テスト
- **R2接続**: `curl http://localhost:3000/api/test-r2`
- **ファイルアップロード**: POST `/api/upload`

## 🗄️ データベース管理

### Node.jsスクリプトを使用したSupabase操作

Cursorから直接Supabaseを操作する場合、Node.jsスクリプトを使用すると効率的です。

#### メリット
- ✅ **高速**: ブラウザでダッシュボードを開く必要なし
- ✅ **自動化**: 複雑な操作を一度に実行
- ✅ **検証**: 実行結果を即座に確認
- ✅ **再現性**: スクリプトとして保存・共有可能

#### 基本的な使い方

1. **スクリプトの作成**
```javascript
// scripts/database-operation.mjs
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// .env.localから環境変数を読み込む
const envContent = readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY, // 管理者権限
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// データベース操作の例
async function main() {
  // データ取得
  const { data, error } = await supabase
    .from('programs')
    .select('*');
  
  if (error) {
    console.error('エラー:', error);
    return;
  }
  
  console.log('プログラム一覧:', data);
}

main();
```

2. **実行**
```bash
node scripts/database-operation.mjs
```

#### 提供されているスクリプト

```bash
# データベースの問題を自動修正
node scripts/fix-database.mjs
```

このスクリプトは以下を実行します：
- 重複データの削除
- 不足データの追加
- データベースの検証

#### よくある操作例

**データの一括挿入**
```javascript
const { error } = await supabase
  .from('chapters')
  .insert([
    { program_id: 1, title: 'チャプター1', order_index: 1 },
    { program_id: 1, title: 'チャプター2', order_index: 2 }
  ]);
```

**データの更新**
```javascript
const { error } = await supabase
  .from('programs')
  .update({ status: 'published' })
  .eq('id', 1);
```

**重複の削除**
```javascript
// 1. 重複を検出
const { data } = await supabase
  .from('achievements')
  .select('*');

// 2. 重複を削除
const duplicateIds = [/* 重複ID */];
const { error } = await supabase
  .from('achievements')
  .delete()
  .in('id', duplicateIds);
```

#### 注意事項
- `SUPABASE_SERVICE_ROLE_KEY` は管理者権限です（RLSをバイパス）
- 本番環境での実行は慎重に
- 重要な操作の前にはバックアップを推奨

### Supabase Dashboard（Webブラウザ）
手動でデータを確認・編集する場合：
- Dashboard: https://supabase.com/dashboard
- Table Editor: テーブルのデータを直接編集
- SQL Editor: SQLクエリを実行

## 🚢 デプロイ

Vercelを使用してデプロイします。

1. **Vercelにプロジェクトをインポート**
2. **環境変数を設定**
3. **デプロイ実行**

---

**PIC School - ビジネススキルを体系的に学びましょう！** 🎓