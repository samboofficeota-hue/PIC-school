-- データの問題を修正するSQLスクリプト
-- 実行前にバックアップを取ることを推奨します

-- ==========================================
-- 1. 実績データの重複削除
-- ==========================================
-- 重複した実績を削除し、各実績を1つのみ残す

-- 重複を確認
SELECT name, category, points, COUNT(*) as count
FROM achievements
GROUP BY name, category, points
HAVING COUNT(*) > 1;

-- 重複を削除（最小IDのみを残す）
WITH duplicates AS (
  SELECT id,
         ROW_NUMBER() OVER (PARTITION BY name, category, points ORDER BY id) as rn
  FROM achievements
)
DELETE FROM achievements
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- 結果確認
SELECT COUNT(*) as total_achievements FROM achievements;

-- ==========================================
-- 2. Published プログラムにチャプターを追加
-- ==========================================

-- プログラムID: 4 (ビジネススキル基礎コース) のチャプター
INSERT INTO chapters (program_id, title, description, content, duration_minutes, order_index, is_free) VALUES
(4, 'ビジネスの基本原則', 'ビジネスの基本概念と原則について学びます。', 
  '# ビジネスの基本原則

## はじめに
ビジネスの成功には基本原則の理解が不可欠です。このチャプターでは、ビジネスの本質的な概念について学びます。

## 主要トピック
1. 市場における需要と供給
2. 顧客価値の創造
3. 競争優位性の構築
4. 持続可能なビジネスモデル

## 学習目標
- ビジネスの基本概念を理解する
- 価値創造のプロセスを学ぶ
- 市場分析の重要性を認識する',
  45, 1, true),

(4, '市場分析と顧客理解', '市場の動向を分析し、顧客のニーズを理解する方法を学びます。',
  '# 市場分析と顧客理解

## 市場分析の重要性
効果的なビジネス戦略を立てるには、市場の包括的な分析が必要です。

## 分析手法
1. SWOT分析
2. PEST分析
3. 競合分析
4. 顧客セグメンテーション

## 実践演習
実際の市場データを使用して分析を行います。',
  60, 2, false),

(4, '戦略立案と実行', '効果的なビジネス戦略を立案し、実行する方法を学びます。',
  '# 戦略立案と実行

## 戦略フレームワーク
- ポーターの5つの力
- バリューチェーン分析
- ブルーオーシャン戦略

## 実行計画
目標設定からKPI管理まで、実行に必要なステップを学びます。',
  75, 3, false),

(4, 'データ分析と意思決定', 'データに基づいた意思決定を行うための分析手法を学びます。',
  '# データ分析と意思決定

## データドリブン経営
現代のビジネスにおいてデータ分析は不可欠です。

## 分析ツールと手法
- Excel分析
- BI ツールの活用
- 予測モデリング
- A/Bテスト',
  70, 4, false),

(4, '第1章まとめとテスト', 'ビジネススキル基礎コースの第1章の内容をまとめ、理解度をテストします。',
  '# 第1章まとめとテスト

## これまでの学習内容
1. ビジネスの基本原則
2. 市場分析手法
3. 戦略立案
4. データ分析

## テスト内容
- 選択問題: 10問
- 記述問題: 2問
- 合格ライン: 70点以上',
  30, 5, false);

-- プログラムID: 5 (マーケティング戦略) のチャプター
INSERT INTO chapters (program_id, title, description, content, duration_minutes, order_index, is_free) VALUES
(5, 'マーケティングの基礎', 'マーケティングの基本概念と重要性について学びます。',
  '# マーケティングの基礎

## マーケティングとは
顧客のニーズを理解し、価値を提供するプロセスです。

## マーケティングの4P
- Product (製品)
- Price (価格)
- Place (流通)
- Promotion (プロモーション)',
  40, 1, true),

(5, 'デジタルマーケティング', 'デジタル時代のマーケティング手法を学びます。',
  '# デジタルマーケティング

## デジタルチャネル
- SEO/SEM
- SNSマーケティング
- コンテンツマーケティング
- メールマーケティング',
  55, 2, false),

(5, 'ブランド戦略', '強いブランドを構築する方法を学びます。',
  '# ブランド戦略

## ブランディングの重要性
ブランドは企業の無形資産です。

## ブランド構築のステップ
1. ブランドアイデンティティの確立
2. ブランドポジショニング
3. ブランド体験の設計',
  50, 3, false);

-- プログラムID: 6 (データ分析コース) のチャプター
INSERT INTO chapters (program_id, title, description, content, duration_minutes, order_index, is_free) VALUES
(6, 'データ分析入門', 'データ分析の基礎概念と重要性について学びます。',
  '# データ分析入門

## なぜデータ分析が重要か
データドリブンな意思決定の時代です。

## 基本統計
- 平均値、中央値、最頻値
- 分散と標準偏差
- 相関分析',
  45, 1, true),

(6, 'データ可視化', 'データを効果的に可視化する方法を学びます。',
  '# データ可視化

## 可視化の原則
データストーリーテリングの技術

## ツールと手法
- グラフの選択
- ダッシュボード設計
- インタラクティブ可視化',
  60, 2, false),

(6, '予測分析', '機械学習を用いた予測分析の基礎を学びます。',
  '# 予測分析

## 機械学習入門
- 教師あり学習
- 教師なし学習
- モデル評価',
  70, 3, false);

-- プログラムID: 7 (リーダーシップ開発) のチャプター
INSERT INTO chapters (program_id, title, description, content, duration_minutes, order_index, is_free) VALUES
(7, 'リーダーシップの本質', 'リーダーシップの基本概念と重要性について学びます。',
  '# リーダーシップの本質

## リーダーとマネージャーの違い
リーダーシップは影響力です。

## リーダーシップスタイル
- 変革型リーダーシップ
- サーバントリーダーシップ
- 状況対応型リーダーシップ',
  40, 1, true),

(7, 'チームマネジメント', '効果的なチーム運営の方法を学びます。',
  '# チームマネジメント

## 高パフォーマンスチームの特徴
- 心理的安全性
- 明確な目標
- 相互信頼

## チームビルディング
実践的な手法とツール',
  55, 2, false),

(7, 'コミュニケーションスキル', 'リーダーに必要なコミュニケーション能力を磨きます。',
  '# コミュニケーションスキル

## 効果的なコミュニケーション
- アクティブリスニング
- フィードバックの技術
- プレゼンテーションスキル',
  45, 3, false);

-- ==========================================
-- 3. Draft プログラムの状態を確認
-- ==========================================
-- Draft プログラムの一覧を表示（手動で判断するため）
SELECT id, title, status, 
       (SELECT COUNT(*) FROM chapters WHERE program_id = programs.id) as chapter_count
FROM programs
WHERE status = 'draft';

-- もし公開する場合は以下のコメントを外して実行
-- UPDATE programs SET status = 'published' WHERE id IN (1, 2, 3);

-- もし削除する場合は以下のコメントを外して実行（注意: CASCADE削除されます）
-- DELETE FROM programs WHERE id IN (1, 2, 3);

-- ==========================================
-- 4. 修正結果の確認
-- ==========================================

-- 実績の確認
SELECT 'Achievements' as table_name, COUNT(*) as count FROM achievements
UNION ALL
SELECT 'Programs', COUNT(*) FROM programs
UNION ALL
SELECT 'Chapters', COUNT(*) FROM chapters
UNION ALL
SELECT 'Published Programs', COUNT(*) FROM programs WHERE status = 'published'
UNION ALL
SELECT 'Draft Programs', COUNT(*) FROM programs WHERE status = 'draft';

-- Published プログラムのチャプター数
SELECT 
  p.id,
  p.title,
  p.status,
  COUNT(c.id) as chapter_count
FROM programs p
LEFT JOIN chapters c ON c.program_id = p.id
WHERE p.status = 'published'
GROUP BY p.id, p.title, p.status
ORDER BY p.id;

