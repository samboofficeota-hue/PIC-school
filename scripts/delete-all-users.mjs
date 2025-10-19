#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

console.log('🗑️  全ユーザーを削除します...\n');

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

async function deleteAllUsers() {
  // 削除対象のメールアドレス
  const emailsToDelete = [
    'sambo.office.ota@gmail.com',
    'yoshi.ota.bj@gmail.com'
  ];
  
  console.log('🔍 削除対象のユーザーを検索中...\n');
  
  // すべてのユーザーを取得
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
  
  if (usersError) {
    console.error('❌ ユーザー取得エラー:', usersError.message);
    return;
  }
  
  // 削除対象のユーザーを抽出
  const usersToDelete = users.users.filter(u => emailsToDelete.includes(u.email));
  
  if (usersToDelete.length === 0) {
    console.log('✅ 削除対象のユーザーは見つかりませんでした\n');
    return;
  }
  
  console.log(`⚠️  以下のユーザーを削除します:\n`);
  usersToDelete.forEach(user => {
    console.log(`   - ${user.email} (ID: ${user.id})`);
  });
  console.log('');
  
  // 削除実行
  let deletedCount = 0;
  let failedCount = 0;
  
  for (const user of usersToDelete) {
    console.log(`削除中: ${user.email}`);
    
    const { error } = await supabase.auth.admin.deleteUser(user.id);
    
    if (error) {
      console.error(`   ❌ エラー: ${error.message}`);
      failedCount++;
    } else {
      console.log(`   ✅ 削除完了`);
      deletedCount++;
    }
  }
  
  console.log('\n📊 削除結果:');
  console.log(`   成功: ${deletedCount}件`);
  if (failedCount > 0) {
    console.log(`   失敗: ${failedCount}件`);
  }
  
  console.log('\n🎉 ユーザーの削除が完了しました！');
  console.log('✅ データベースがクリーンな状態になりました');
  console.log('📝 これで新規登録からやり直せます\n');
}

deleteAllUsers().catch(console.error);

