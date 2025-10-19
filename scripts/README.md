# スクリプトディレクトリ

このディレクトリには、データベース管理とメンテナンス用のスクリプトが含まれています。

## 📁 ファイル一覧

### `fix-database.mjs`
データベースの問題を自動的に修正するスクリプト。

**機能:**
- 実績データの重複削除
- Published プログラムへのチャプター追加
- データベースの検証

**使用方法:**
```bash
node scripts/fix-database.mjs
```

**実行内容:**
1. 実績データの重複を検出・削除
2. チャプターが不足しているプログラムに自動追加
3. 修正結果を表示

### `update-types.sh`
型定義ファイルの移行をサポートするスクリプト。

**機能:**
- 古い型定義ファイルのバックアップ作成
- 新旧型定義の違いを説明
- 移行オプションの提示

**使用方法:**
```bash
bash scripts/update-types.sh
```

## 🛠️ スクリプトの作成方法

新しいスクリプトを作成する場合のテンプレート:

```javascript
#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// 環境変数の読み込み
const envContent = readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

// Supabaseクライアントの作成
const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// メイン処理
async function main() {
  try {
    console.log('処理開始...');
    
    // ここに処理を記述
    
    console.log('完了！');
  } catch (error) {
    console.error('エラー:', error);
    process.exit(1);
  }
}

main();
```

## 📝 ベストプラクティス

1. **エラーハンドリング**: すべての操作でエラーチェックを実施
2. **ログ出力**: 処理の進捗を適切にログ出力
3. **検証**: 処理後の状態を必ず確認
4. **バックアップ**: 重要な操作前にデータのバックアップを推奨
5. **テスト**: 本番環境で実行する前にテストを実施

## ⚠️ 注意事項

- `SUPABASE_SERVICE_ROLE_KEY` は管理者権限です
- RLSポリシーをバイパスするため、慎重に使用してください
- 本番環境での実行は特に注意が必要です
- 大量のデータを操作する場合は、バッチ処理を検討してください

