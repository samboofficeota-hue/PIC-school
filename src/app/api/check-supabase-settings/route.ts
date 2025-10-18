import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    
    // 環境変数の確認
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '設定済み' : '未設定',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '設定済み' : '未設定',
    };

    // テスト用のユーザー登録でメール設定を確認
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'testpassword123';
    
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        emailRedirectTo: 'https://pic-school.vercel.app/auth/login'
      }
    });

    // 既存のユーザーを確認
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

    return NextResponse.json({ 
      success: true,
      message: 'Supabase設定の確認',
      environment: envCheck,
      signupTest: {
        email: testEmail,
        success: !signupError,
        userCreated: !!signupData?.user,
        emailConfirmationRequired: signupData?.user && !signupData.user.email_confirmed_at,
        error: signupError ? {
          message: signupError.message,
          status: signupError.status
        } : null
      },
      existingUsers: users ? users.length : 0,
      usersError: usersError ? usersError.message : null,
      recommendations: [
        'SupabaseダッシュボードでAuthentication → Settingsを確認',
        'Enable email confirmationsが有効になっているか確認',
        'Authentication → URL ConfigurationでリダイレクトURLを確認',
        'Authentication → Email TemplatesでConfirm signupテンプレートを確認'
      ],
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
