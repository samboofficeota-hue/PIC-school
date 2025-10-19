#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

console.log('🔧 データベースの問題を修正します...\n');

// .env.localから環境変数を読み込む
const envContent = readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 環境変数が設定されていません');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// ==========================================
// 1. 実績データの重複削除
// ==========================================
async function fixDuplicateAchievements() {
  console.log('📝 ステップ1: 実績データの重複を確認中...');
  
  // 現在の実績数を確認
  const { data: achievements, error: countError } = await supabase
    .from('achievements')
    .select('id, name, category, points');
  
  if (countError) {
    console.error('❌ エラー:', countError.message);
    return false;
  }
  
  console.log(`   現在の実績数: ${achievements.length}件`);
  
  // 重複を検出
  const uniqueMap = new Map();
  const duplicateIds = [];
  
  achievements.forEach(a => {
    const key = `${a.name}-${a.category}-${a.points}`;
    if (uniqueMap.has(key)) {
      // 重複発見 - 後から見つかったものを削除対象に
      duplicateIds.push(a.id);
    } else {
      uniqueMap.set(key, a.id);
    }
  });
  
  if (duplicateIds.length === 0) {
    console.log('✅ 重複はありません\n');
    return true;
  }
  
  console.log(`   重複: ${duplicateIds.length}件を削除します...`);
  
  // 重複を削除
  const { error: deleteError } = await supabase
    .from('achievements')
    .delete()
    .in('id', duplicateIds);
  
  if (deleteError) {
    console.error('❌ 削除エラー:', deleteError.message);
    return false;
  }
  
  console.log(`✅ 重複削除完了: ${uniqueMap.size}件の実績が残りました\n`);
  return true;
}

// ==========================================
// 2. チャプターデータの追加
// ==========================================
async function addChaptersToPrograms() {
  console.log('📚 ステップ2: Publishedプログラムのチャプターを確認中...');
  
  // Published プログラムを取得
  const { data: programs, error: programError } = await supabase
    .from('programs')
    .select('id, title')
    .eq('status', 'published');
  
  if (programError) {
    console.error('❌ エラー:', programError.message);
    return false;
  }
  
  // チャプターデータ定義
  const chaptersData = {
    4: [ // ビジネススキル基礎コース
      {
        title: 'ビジネスの基本原則',
        description: 'ビジネスの基本概念と原則について学びます。',
        content: `# ビジネスの基本原則

## はじめに
ビジネスの成功には基本原則の理解が不可欠です。

## 主要トピック
1. 市場における需要と供給
2. 顧客価値の創造
3. 競争優位性の構築
4. 持続可能なビジネスモデル`,
        duration_minutes: 45,
        order_index: 1,
        is_free: true
      },
      {
        title: '市場分析と顧客理解',
        description: '市場の動向を分析し、顧客のニーズを理解する方法を学びます。',
        content: `# 市場分析と顧客理解

## 分析手法
1. SWOT分析
2. PEST分析
3. 競合分析
4. 顧客セグメンテーション`,
        duration_minutes: 60,
        order_index: 2,
        is_free: false
      },
      {
        title: '戦略立案と実行',
        description: '効果的なビジネス戦略を立案し、実行する方法を学びます。',
        content: `# 戦略立案と実行

## 戦略フレームワーク
- ポーターの5つの力
- バリューチェーン分析
- ブルーオーシャン戦略`,
        duration_minutes: 75,
        order_index: 3,
        is_free: false
      },
      {
        title: 'データ分析と意思決定',
        description: 'データに基づいた意思決定を行うための分析手法を学びます。',
        content: `# データ分析と意思決定

## 分析ツールと手法
- Excel分析
- BIツールの活用
- 予測モデリング`,
        duration_minutes: 70,
        order_index: 4,
        is_free: false
      },
      {
        title: '第1章まとめとテスト',
        description: 'これまでの学習内容をまとめ、理解度をテストします。',
        content: `# 第1章まとめとテスト

## テスト内容
- 選択問題: 10問
- 記述問題: 2問
- 合格ライン: 70点以上`,
        duration_minutes: 30,
        order_index: 5,
        is_free: false
      }
    ],
    5: [ // マーケティング戦略
      {
        title: 'マーケティングの基礎',
        description: 'マーケティングの基本概念と重要性について学びます。',
        content: `# マーケティングの基礎

## マーケティングの4P
- Product (製品)
- Price (価格)
- Place (流通)
- Promotion (プロモーション)`,
        duration_minutes: 40,
        order_index: 1,
        is_free: true
      },
      {
        title: 'デジタルマーケティング',
        description: 'デジタル時代のマーケティング手法を学びます。',
        content: `# デジタルマーケティング

## デジタルチャネル
- SEO/SEM
- SNSマーケティング
- コンテンツマーケティング`,
        duration_minutes: 55,
        order_index: 2,
        is_free: false
      },
      {
        title: 'ブランド戦略',
        description: '強いブランドを構築する方法を学びます。',
        content: `# ブランド戦略

## ブランド構築のステップ
1. ブランドアイデンティティの確立
2. ブランドポジショニング
3. ブランド体験の設計`,
        duration_minutes: 50,
        order_index: 3,
        is_free: false
      }
    ],
    6: [ // データ分析コース
      {
        title: 'データ分析入門',
        description: 'データ分析の基礎概念と重要性について学びます。',
        content: `# データ分析入門

## 基本統計
- 平均値、中央値、最頻値
- 分散と標準偏差
- 相関分析`,
        duration_minutes: 45,
        order_index: 1,
        is_free: true
      },
      {
        title: 'データ可視化',
        description: 'データを効果的に可視化する方法を学びます。',
        content: `# データ可視化

## ツールと手法
- グラフの選択
- ダッシュボード設計
- インタラクティブ可視化`,
        duration_minutes: 60,
        order_index: 2,
        is_free: false
      },
      {
        title: '予測分析',
        description: '機械学習を用いた予測分析の基礎を学びます。',
        content: `# 予測分析

## 機械学習入門
- 教師あり学習
- 教師なし学習
- モデル評価`,
        duration_minutes: 70,
        order_index: 3,
        is_free: false
      }
    ],
    7: [ // リーダーシップ開発
      {
        title: 'リーダーシップの本質',
        description: 'リーダーシップの基本概念と重要性について学びます。',
        content: `# リーダーシップの本質

## リーダーシップスタイル
- 変革型リーダーシップ
- サーバントリーダーシップ
- 状況対応型リーダーシップ`,
        duration_minutes: 40,
        order_index: 1,
        is_free: true
      },
      {
        title: 'チームマネジメント',
        description: '効果的なチーム運営の方法を学びます。',
        content: `# チームマネジメント

## 高パフォーマンスチームの特徴
- 心理的安全性
- 明確な目標
- 相互信頼`,
        duration_minutes: 55,
        order_index: 2,
        is_free: false
      },
      {
        title: 'コミュニケーションスキル',
        description: 'リーダーに必要なコミュニケーション能力を磨きます。',
        content: `# コミュニケーションスキル

## 効果的なコミュニケーション
- アクティブリスニング
- フィードバックの技術
- プレゼンテーションスキル`,
        duration_minutes: 45,
        order_index: 3,
        is_free: false
      }
    ]
  };
  
  let addedCount = 0;
  
  for (const program of programs) {
    // 既存のチャプター数を確認
    const { data: existingChapters } = await supabase
      .from('chapters')
      .select('id')
      .eq('program_id', program.id);
    
    const existingCount = existingChapters?.length || 0;
    
    if (existingCount > 0) {
      console.log(`   プログラム${program.id} (${program.title}): ${existingCount}チャプター既存 - スキップ`);
      continue;
    }
    
    const chapters = chaptersData[program.id];
    if (!chapters) {
      console.log(`   プログラム${program.id} (${program.title}): チャプターデータなし - スキップ`);
      continue;
    }
    
    console.log(`   プログラム${program.id} (${program.title}): ${chapters.length}チャプター追加中...`);
    
    // チャプターを追加
    for (const chapter of chapters) {
      const { error } = await supabase
        .from('chapters')
        .insert({
          program_id: program.id,
          ...chapter
        });
      
      if (error) {
        console.error(`   ❌ エラー: ${error.message}`);
        return false;
      }
      addedCount++;
    }
    
    console.log(`   ✅ 完了`);
  }
  
  if (addedCount > 0) {
    console.log(`\n✅ チャプター追加完了: ${addedCount}チャプター\n`);
  } else {
    console.log('✅ すべてのプログラムにチャプターが既に存在します\n');
  }
  
  return true;
}

// ==========================================
// 3. 結果確認
// ==========================================
async function verifyResults() {
  console.log('🔍 ステップ3: 修正結果を確認中...\n');
  
  // 実績数
  const { count: achievementCount } = await supabase
    .from('achievements')
    .select('*', { count: 'exact', head: true });
  
  console.log(`   実績: ${achievementCount}件`);
  
  // プログラムとチャプター数
  const { data: programs } = await supabase
    .from('programs')
    .select('id, title, status')
    .eq('status', 'published')
    .order('id');
  
  for (const program of programs || []) {
    const { count: chapterCount } = await supabase
      .from('chapters')
      .select('*', { count: 'exact', head: true })
      .eq('program_id', program.id);
    
    const status = chapterCount > 0 ? '✅' : '⚠️';
    console.log(`   ${status} プログラム${program.id} (${program.title}): ${chapterCount}チャプター`);
  }
  
  console.log('\n✅ すべての修正が完了しました！\n');
}

// ==========================================
// メイン処理
// ==========================================
async function main() {
  try {
    const step1 = await fixDuplicateAchievements();
    if (!step1) {
      console.error('❌ ステップ1でエラーが発生しました');
      process.exit(1);
    }
    
    const step2 = await addChaptersToPrograms();
    if (!step2) {
      console.error('❌ ステップ2でエラーが発生しました');
      process.exit(1);
    }
    
    await verifyResults();
    
    console.log('🎉 データベースの修正がすべて完了しました！');
    console.log('\n📝 次のステップ:');
    console.log('   1. src/types/database.ts を使用して型定義を更新');
    console.log('   2. アプリケーションをテスト');
    console.log('   3. IMPROVEMENT_GUIDE.md を参照\n');
    
  } catch (error) {
    console.error('❌ 予期しないエラー:', error);
    process.exit(1);
  }
}

main();

