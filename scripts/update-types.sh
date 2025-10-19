#!/bin/bash

echo "🔄 型定義ファイルを更新します..."
echo ""

# バックアップを作成
echo "📦 バックアップを作成中..."
cp src/types/index.ts src/types/index.ts.backup
echo "   ✅ src/types/index.ts.backup に保存しました"
echo ""

# 新しい型定義の内容を確認
echo "📋 新しい型定義ファイルの情報:"
echo "   ファイル: src/types/database.ts"
echo "   サイズ: $(wc -l < src/types/database.ts) 行"
echo ""

# 使用方法の説明
cat << 'EOF'
✨ 型定義の更新方法

【オプション1: 段階的な移行（推奨）】
新しいファイルと古いファイルを併用：

  // 新しいコードでは database.ts を使用
  import { Program, Chapter } from '@/types/database';
  
  // 既存のコードは index.ts のまま
  import { User, Course } from '@/types';

【オプション2: 一括置換】
すべてのファイルを一度に更新：

  # 以下のコマンドを実行（確認してから）
  find src -type f \( -name "*.tsx" -o -name "*.ts" \) \
    ! -path "*/types/*" \
    -exec grep -l "@/types'" {} \; | \
    xargs sed -i '' "s/@\/types'/@\/types\/database'/g"

---

📝 主な変更点:

【旧】 src/types/index.ts
  - User, Course, Lecture
  - 古い設計に基づく型定義

【新】 src/types/database.ts
  - UserProfile, Program, Chapter
  - 実際のSupabaseスキーマに対応
  - リレーション型も含む
  - API レスポンス型も定義

---

🔍 影響を受けるファイル:
  - src/app/mypage/page.tsx
  - src/app/program/[id]/page.tsx
  - src/app/program/[id]/chapter/[chapterId]/page.tsx
  - src/app/api/*/route.ts (各APIルート)

---

EOF

echo "次のステップを選択してください:"
echo "  1. 段階的に移行する（推奨）"
echo "  2. 一括で置換する"
echo "  3. 後で手動で行う"
echo ""

