#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

console.log('🔧 メール確認を無効化します...\n');

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

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function disableEmailConfirmation() {
  console.log('⚠️  注意: この操作はSupabase Dashboardで行う必要があります\n');
  console.log('📝 手順:\n');
  console.log('1. 以下のURLにアクセス:');
  console.log('   https://supabase.com/dashboard/project/gifcpbfdjmxyiefdcvvk/settings/auth\n');
  console.log('2. "Email" セクションを探す\n');
  console.log('3. "Enable email confirmations" のトグルを OFF にする\n');
  console.log('4. 保存ボタンをクリック\n');
  console.log('✅ これで新規登録時にメール確認なしでログインできます！\n');
  
  console.log('📧 既存の未確認ユーザーを確認済みにする場合:\n');
  console.log('   node scripts/confirm-users.mjs\n');
}

disableEmailConfirmation();

