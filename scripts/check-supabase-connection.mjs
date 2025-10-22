#!/usr/bin/env node

/**
 * Supabase接続チェックスクリプト
 * 環境変数とSupabase接続を確認します
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 環境変数を読み込み
dotenv.config({ path: '.env.local' });

console.log('🔍 Supabase接続チェックを開始します...\n');

// 環境変数の確認
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('📋 環境変数の確認:');
console.log(`NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ 設定済み' : '❌ 未設定'}`);
console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey ? '✅ 設定済み' : '❌ 未設定'}`);
console.log(`SUPABASE_SERVICE_ROLE_KEY: ${serviceRoleKey ? '✅ 設定済み' : '❌ 未設定'}\n`);

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ 必要な環境変数が設定されていません。');
  console.log('以下の環境変数を設定してください:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.log('- SUPABASE_SERVICE_ROLE_KEY (サーバーサイド操作用)');
  process.exit(1);
}

// Supabaseクライアントの作成
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔗 Supabase接続テストを実行中...');

try {
  // 基本的な接続テスト
  const { data, error } = await supabase
    .from('user_profiles')
    .select('count')
    .limit(1);

  if (error) {
    console.log('❌ Supabase接続エラー:');
    console.log(`エラーコード: ${error.code}`);
    console.log(`エラーメッセージ: ${error.message}`);
    console.log(`詳細: ${error.details}`);
    
    if (error.code === 'PGRST116') {
      console.log('\n💡 解決方法:');
      console.log('1. Supabaseプロジェクトが正しく設定されているか確認');
      console.log('2. データベーステーブルが作成されているか確認');
      console.log('3. RLS (Row Level Security) ポリシーが適切に設定されているか確認');
    }
  } else {
    console.log('✅ Supabase接続成功！');
    console.log('データベースに正常に接続できています。');
  }
} catch (err) {
  console.log('❌ 接続テスト中にエラーが発生しました:');
  console.log(err.message);
}

console.log('\n📝 次のステップ:');
console.log('1. Supabaseダッシュボードでプロジェクト設定を確認');
console.log('2. データベーススキーマが正しく適用されているか確認');
console.log('3. 環境変数がVercelに正しく設定されているか確認');
console.log('4. RLSポリシーが適切に設定されているか確認');
