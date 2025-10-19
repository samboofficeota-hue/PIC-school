#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

console.log('✉️ 未確認ユーザーを確認済みにします...\n');

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

async function confirmUnverifiedUsers() {
  console.log('🔍 未確認ユーザーを検索中...\n');
  
  // すべてのユーザーを取得
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
  
  if (usersError) {
    console.error('❌ ユーザー取得エラー:', usersError.message);
    return;
  }
  
  // 未確認ユーザーをフィルタ
  const unconfirmedUsers = users.users.filter(u => !u.email_confirmed_at);
  
  if (unconfirmedUsers.length === 0) {
    console.log('✅ すべてのユーザーが確認済みです！\n');
    return;
  }
  
  console.log(`⚠️  未確認ユーザー: ${unconfirmedUsers.length}人\n`);
  
  for (const user of unconfirmedUsers) {
    console.log(`処理中: ${user.email}`);
    
    // ユーザーを確認済みにする
    const { data, error } = await supabase.auth.admin.updateUserById(
      user.id,
      { email_confirm: true }
    );
    
    if (error) {
      console.error(`   ❌ エラー: ${error.message}`);
    } else {
      console.log(`   ✅ 確認済みに変更しました`);
    }
  }
  
  console.log('\n🎉 完了！すべてのユーザーが確認済みになりました\n');
  console.log('📝 これらのユーザーは今すぐログインできます:\n');
  
  for (const user of unconfirmedUsers) {
    console.log(`   - ${user.email}`);
  }
  console.log('');
}

confirmUnverifiedUsers().catch(console.error);

