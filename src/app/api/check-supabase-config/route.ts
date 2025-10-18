import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    
    // 現在の認証設定を確認
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    // 環境変数の詳細確認
    const envDetails = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '設定済み' : '未設定',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '設定済み' : '未設定',
    };

    // テスト用のユーザー登録を試行（実際には登録しない）
    const testEmail = 'test-config@example.com';
    const testPassword = 'testpassword123';
    
    // サインアップのテスト（実際には登録しない）
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        emailRedirectTo: 'https://pic-school.vercel.app/auth/login'
      }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Supabase設定の確認',
      user: user ? { 
        id: user.id, 
        email: user.email, 
        email_confirmed_at: user.email_confirmed_at,
        created_at: user.created_at
      } : null,
      userError: userError ? userError.message : null,
      environment: envDetails,
      signupTest: {
        data: signupData ? {
          user: signupData.user ? {
            id: signupData.user.id,
            email: signupData.user.email,
            email_confirmed_at: signupData.user.email_confirmed_at
          } : null,
          session: signupData.session ? 'セッション作成済み' : 'セッションなし'
        } : null,
        error: signupError ? signupError.message : null
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
