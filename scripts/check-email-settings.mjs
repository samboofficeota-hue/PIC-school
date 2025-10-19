#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

console.log('📧 Supabaseのメール設定を確認します...\n');

// 環境変数の読み込み
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

async function checkEmailSettings() {
  console.log('🔍 認証設定の確認\n');
  
  // ユーザーを取得
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
  
  if (usersError) {
    console.error('❌ ユーザー取得エラー:', usersError.message);
    return;
  }
  
  console.log(`📊 登録ユーザー数: ${users.users.length}人\n`);
  
  if (users.users.length > 0) {
    console.log('👥 ユーザー一覧:\n');
    users.users.forEach((user, index) => {
      const status = user.email_confirmed_at ? '✅ 確認済み' : '⚠️ 未確認';
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   状態: ${status}`);
      console.log(`   登録日: ${new Date(user.created_at).toLocaleString('ja-JP')}`);
      if (user.email_confirmed_at) {
        console.log(`   確認日: ${new Date(user.email_confirmed_at).toLocaleString('ja-JP')}`);
      }
      console.log('');
    });
  }
  
  console.log('\n📝 解決方法:\n');
  console.log('【方法1: 開発環境では自動確認を有効化（推奨）】');
  console.log('1. Supabase Dashboard にアクセス');
  console.log('   https://supabase.com/dashboard/project/gifcpbfdjmxyiefdcvvk/auth/users');
  console.log('');
  console.log('2. Settings > Authentication に移動');
  console.log('   https://supabase.com/dashboard/project/gifcpbfdjmxyiefdcvvk/settings/auth');
  console.log('');
  console.log('3. "Enable email confirmations" を OFF にする');
  console.log('   → メール確認なしでログイン可能になります');
  console.log('');
  console.log('【方法2: 手動でユーザーを確認済みにする】');
  
  // 未確認ユーザーがいる場合
  const unconfirmedUsers = users.users.filter(u => !u.email_confirmed_at);
  if (unconfirmedUsers.length > 0) {
    console.log('\n以下のコマンドで未確認ユーザーを確認済みにできます:');
    console.log('node scripts/confirm-users.mjs\n');
  }
  
  console.log('【方法3: SMTP設定を行う（本番環境向け）】');
  console.log('1. Dashboard > Settings > Authentication > SMTP Settings');
  console.log('2. 独自のSMTPサーバーを設定（Gmail、SendGrid等）');
  console.log('');
  console.log('⚠️  注意: Supabaseの無料プランではメール送信に制限があります');
  console.log('   開発中は方法1（メール確認OFF）が最も簡単です\n');
}

checkEmailSettings().catch(console.error);

