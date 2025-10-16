# PIC School - 公益資本主義オンラインスクール

公益資本主義を学ぶオンラインスクールプラットフォーム

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

### ページ構成

1. **ホームページ** (`/`)
   - ヒーローセクション
   - 特徴紹介
   - カリキュラム概要
   - 学習の流れ
   - CTAセクション

2. **プログラム詳細ページ** (`/program/[id]`)
   - プログラム概要
   - 学習内容一覧
   - 学習目標・前提条件
   - サイドバー（価格、進捗、特徴、講師情報）

3. **チャプター詳細ページ** (`/program/[id]/chapter/[chapterId]`)
   - 左側：カリキュラムナビゲーション
   - 右側：学習コンテンツ
   - 重要なポイント
   - 詳細内容
   - タブナビゲーション

## 🛠️ 技術スタック

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React (useState, useEffect)

## 📝 開発ガイドライン

- TypeScriptを使用
- Tailwind CSSでスタイリング
- コンポーネントは機能別に整理
- レスポンシブデザインを心がける

## 🚢 デプロイ

Vercelを使用してデプロイします。

---

**PIC School - 一緒に公益資本主義を学びましょう！** 🎓