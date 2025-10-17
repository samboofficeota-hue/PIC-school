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

## 🚢 デプロイ

Vercelを使用してデプロイします。

1. **Vercelにプロジェクトをインポート**
2. **環境変数を設定**
3. **デプロイ実行**

---

**PIC School - ビジネススキルを体系的に学びましょう！** 🎓